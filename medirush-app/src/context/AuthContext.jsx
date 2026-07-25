import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Self-healing database profile synchronization
  const checkAndCreateProfile = async (sessionUser) => {
    if (!sessionUser) return;
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user profile:', fetchError.message);
        return;
      }

      // If profile does not exist, insert it using metadata
      if (!existingProfile) {
        const metadata = sessionUser.user_metadata || {};
        const name = metadata.name || metadata.full_name || sessionUser.email?.split('@')[0] || 'Phone User';
        const email = sessionUser.email || `${sessionUser.phone || sessionUser.id}@medirush.app`;
        const phone = sessionUser.phone || metadata.phone || '';
        const role = metadata.role || 'user';

        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: sessionUser.id,
              name,
              email,
              phone,
              role,
              verified: sessionUser.email_confirmed_at ? true : false
            }
          ]);

        if (insertError) {
          console.error('Error auto-creating profile in database:', insertError.message);
        } else {
          console.log('Successfully auto-created user profile in database.');
        }
      }
    } catch (err) {
      console.error('Unexpected error in profile check/creation:', err);
    }
  };

  const loginAsDemo = () => {
    const demoUser = { id: 'demo-123', email: 'demo@medirush.app', user_metadata: { name: 'Demo User' } };
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const logout = async () => {
    localStorage.removeItem('demo_user');
    await supabase.auth.signOut();
    setUser(null);
  };

  const logoutAllDevices = async () => {
    localStorage.removeItem('demo_user');
    await supabase.auth.signOut({ scope: 'global' });
    setUser(null);
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const loginWithApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const sendPhoneOtp = async (phone) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (error) throw error;
    return data;
  };

  const verifyPhoneOtp = async (phone, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) throw error;
    
    if (data.user) {
      await checkAndCreateProfile(data.user);
    }
    return data;
  };

  useEffect(() => {
    const storedDemo = localStorage.getItem('demo_user');
    if (storedDemo) {
      setUser(JSON.parse(storedDemo));
      setLoading(false);
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('demo_user');
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }

    // Check for an active session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        await checkAndCreateProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth events (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await checkAndCreateProfile(session.user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginAsDemo, 
      logout,
      logoutAllDevices,
      loginWithGoogle,
      loginWithApple,
      sendPhoneOtp,
      verifyPhoneOtp,
      checkAndCreateProfile
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
