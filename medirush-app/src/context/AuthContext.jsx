import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const storedDemo = localStorage.getItem('demo_user');
    if (storedDemo) {
      setUser(JSON.parse(storedDemo));
      setLoading(false);
      
      // We still want to listen for real logout events
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('demo_user');
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }

    // Check for an active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth events (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginAsDemo, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
