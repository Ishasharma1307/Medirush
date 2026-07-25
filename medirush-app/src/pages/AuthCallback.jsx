import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Activity, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { checkAndCreateProfile } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let active = true;

    const handleCallback = async () => {
      try {
        // Parse hash/session from URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          // Sync profile to database using user_metadata
          await checkAndCreateProfile(session.user);
          
          if (active) {
            navigate('/home', { replace: true });
          }
        } else {
          // If no session is returned, check if user is already signed in
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await checkAndCreateProfile(user);
            if (active) {
              navigate('/home', { replace: true });
            }
          } else {
            throw new Error('No active session found. Please try logging in again.');
          }
        }
      } catch (err) {
        console.error('Callback error:', err.message);
        if (active) {
          setErrorMsg(err.message || 'Verification failed. Please try again.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 4000);
        }
      }
    };

    handleCallback();

    return () => {
      active = false;
    };
  }, [navigate, checkAndCreateProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans relative overflow-hidden">
      {/* Decorative Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-10 text-center shadow-2xl bg-white/80 backdrop-blur-lg rounded-3xl border border-white/60"
      >
        {!errorMsg ? (
          <div className="flex flex-col items-center">
            {/* Pulsing Loading Spinner */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulseSoft">
                <Activity className="text-primary h-10 w-10 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">Verifying Your Account</h3>
            <p className="text-sm text-gray-500 font-bold max-w-xs leading-relaxed">
              Setting up your secure healthcare dashboard and syncing your details...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mb-6">
              <ShieldAlert size={36} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">Verification Failed</h3>
            <p className="text-sm text-danger font-bold max-w-xs leading-relaxed mb-4">
              {errorMsg}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              Redirecting you to the login page...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
