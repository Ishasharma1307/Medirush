import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { pharmacyService } from '../services/pharmacyService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [pharmacyProfile, setPharmacyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load associated pharmacy record if role is pharmacy
  const fetchPharmacyProfile = async (ownerId) => {
    if (!ownerId) return null;
    const { data } = await pharmacyService.getPharmacyProfileByOwner(ownerId);
    if (data) {
      setPharmacyProfile(data);
    } else {
      setPharmacyProfile(null);
    }
    return data;
  };

  // Self-healing database profile synchronization
  const checkAndCreateProfile = async (sessionUser) => {
    if (!sessionUser) {
      setUserProfile(null);
      setPharmacyProfile(null);
      return;
    }
    try {
      // Check if profile exists in 'users' table
      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user profile:', fetchError.message);
      }

      let currentProfile = existingProfile;

      // If profile does not exist, insert it using auth metadata
      if (!existingProfile) {
        const metadata = sessionUser.user_metadata || {};
        const name = metadata.name || metadata.full_name || sessionUser.email?.split('@')[0] || 'MediRush User';
        const email = sessionUser.email || `${sessionUser.phone || sessionUser.id}@medirush.app`;
        const phone = sessionUser.phone || metadata.phone || '';
        const role = metadata.role || 'user';

        const { data: insertedProfile, error: insertError } = await supabase
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
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error auto-creating profile in database:', insertError.message);
          currentProfile = {
            id: sessionUser.id,
            name,
            email,
            phone,
            role,
            verified: false
          };
        } else {
          console.log('Successfully auto-created user profile in database.');
          currentProfile = insertedProfile;
        }
      }

      setUserProfile(currentProfile);

      // If user is a pharmacy partner, fetch their pharmacy profile
      if (currentProfile?.role === 'pharmacy' || sessionUser.user_metadata?.role === 'pharmacy') {
        await fetchPharmacyProfile(sessionUser.id);
      } else {
        setPharmacyProfile(null);
      }
    } catch (err) {
      console.error('Unexpected error in profile check/creation:', err);
    }
  };

  const loginAsDemo = () => {
    const demoUser = { id: 'demo-123', email: 'demo@medirush.app', user_metadata: { name: 'Demo Customer', role: 'user' } };
    const demoProf = { id: 'demo-123', name: 'Demo Customer', email: 'demo@medirush.app', role: 'user', verified: true };
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setUserProfile(demoProf);
    setPharmacyProfile(null);
  };

  const loginAsDemoPharmacy = () => {
    const demoPharmUser = { id: 'demo-pharmacy-123', email: 'pharmacy@medirush.app', user_metadata: { name: 'Apollo Pharmacy Admin', role: 'pharmacy' } };
    const demoProf = { id: 'demo-pharmacy-123', name: 'Apollo Pharmacy Admin', email: 'pharmacy@medirush.app', role: 'pharmacy', verified: true };
    const demoPharm = {
      id: 'pharmacy-demo-uuid-123',
      owner_id: 'demo-pharmacy-123',
      pharmacy_name: 'Apollo Pharmacy (Demo Store)',
      license_number: 'DL-IND-2026-APOLLO99',
      phone: '+919876543210',
      email: 'pharmacy@medirush.app',
      address: 'Plot 42, Health Avenue, MG Road, Connaught Place, New Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      verification_status: 'approved',
      verified: true,
      is_open: true
    };

    localStorage.setItem('demo_user', JSON.stringify(demoPharmUser));
    setUser(demoPharmUser);
    setUserProfile(demoProf);
    setPharmacyProfile(demoPharm);
  };

  const logout = async () => {
    localStorage.removeItem('demo_user');
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setPharmacyProfile(null);
  };

  const logoutAllDevices = async () => {
    localStorage.removeItem('demo_user');
    await supabase.auth.signOut({ scope: 'global' });
    setUser(null);
    setUserProfile(null);
    setPharmacyProfile(null);
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

  const resendSignupOtp = async (email) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const verifySignupOtp = async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
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
      const parsedDemo = JSON.parse(storedDemo);
      setUser(parsedDemo);
      
      const role = parsedDemo.user_metadata?.role || 'user';
      setUserProfile({
        id: parsedDemo.id,
        name: parsedDemo.user_metadata?.name || 'Demo User',
        email: parsedDemo.email,
        role: role,
        verified: true
      });

      if (role === 'pharmacy') {
        setPharmacyProfile({
          id: 'pharmacy-demo-uuid-123',
          owner_id: parsedDemo.id,
          pharmacy_name: 'Apollo Pharmacy (Demo Store)',
          license_number: 'DL-IND-2026-APOLLO99',
          phone: '+919876543210',
          email: parsedDemo.email,
          address: 'Plot 42, Health Avenue, MG Road, Connaught Place, New Delhi',
          latitude: 28.6139,
          longitude: 77.2090,
          verification_status: 'approved',
          verified: true,
          is_open: true
        });
      }

      setLoading(false);
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('demo_user');
          setUser(null);
          setUserProfile(null);
          setPharmacyProfile(null);
        }
      });
      return () => subscription.unsubscribe();
    }

    // Check for an active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkAndCreateProfile(session.user);
      } else {
        setUser(null);
        setUserProfile(null);
        setPharmacyProfile(null);
      }
      setLoading(false);
    });

    // Listen for auth events (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          checkAndCreateProfile(session.user);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setPharmacyProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user,
      userProfile,
      pharmacyProfile,
      loading, 
      loginAsDemo,
      loginAsDemoPharmacy,
      logout,
      logoutAllDevices,
      loginWithGoogle,
      loginWithApple,
      sendPhoneOtp,
      verifyPhoneOtp,
      resendSignupOtp,
      verifySignupOtp,
      checkAndCreateProfile,
      fetchPharmacyProfile
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
