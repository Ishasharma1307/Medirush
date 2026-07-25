import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  // State to determine if we are in "request recovery email" mode or "reset/update password" mode
  const [isResetMode, setIsResetMode] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auto-detect if user came from a recovery link (checks URL hash/parameters)
  useEffect(() => {
    const checkRecovery = async () => {
      // Check if hash contains access token and type is recovery
      const hash = window.location.hash;
      if (hash && (hash.includes('type=recovery') || hash.includes('access_token='))) {
        setIsResetMode(true);
      } else {
        // Double check session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && window.location.href.includes('recovery')) {
          setIsResetMode(true);
        }
      }
    };
    checkRecovery();
  }, []);

  // Auto-hide messages
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
    if (score <= 3) return { score, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const targetEmail = email.trim();
    if (!targetEmail) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/forgot-password`,
      });

      if (resetError) throw resetError;
      setSuccessMsg('Reset password link has been sent to your email address.');
      setEmail('');
    } catch (err) {
      let msg = err.message || 'Failed to send reset link.';
      if (msg.includes('rate limit')) {
        msg = 'Rate limit exceeded. Please wait a few minutes before requesting another link.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;
      
      setSuccessMsg('Password updated successfully! Redirecting you to login...');
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        navigate('/login');
      }, 3500);
    } catch (err) {
      setError(err.message || 'Failed to update password. Reset link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background font-sans relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Dynamic Toast Alerts */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4">
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="glass-card border-secondary/30 p-4 shadow-xl flex items-start bg-emerald-50/90 backdrop-blur-md rounded-2xl relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
              <CheckCircle2 className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="font-extrabold text-emerald-800 text-xs uppercase tracking-wider mb-0.5">Success</h4>
                <p className="text-xs text-emerald-700 font-bold leading-relaxed">{successMsg}</p>
              </div>
              <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800 transition-colors ml-2 self-start">
                <X size={16} />
              </button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="glass-card border-danger/30 p-4 shadow-xl flex items-start bg-red-50/90 backdrop-blur-md rounded-2xl relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
              <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="font-extrabold text-red-800 text-xs uppercase tracking-wider mb-0.5">Error</h4>
                <p className="text-xs text-red-700 font-bold leading-relaxed">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 transition-colors ml-2 self-start">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex items-center justify-center p-6 sm:p-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card p-8 sm:p-12 shadow-2xl bg-white/80 backdrop-blur-lg rounded-3xl border border-white/60"
        >
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Lock size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
              {isResetMode ? 'Reset Password' : 'Forgot Password?'}
            </h2>
            <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
              {isResetMode ? 'Enter a strong, secure new password.' : 'Get a link to restore access to your account.'}
            </p>
          </div>

          {!isResetMode ? (
            /* Form 1: Request Reset Link */
            <form className="space-y-6" onSubmit={handleRequestReset}>
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-extrabold text-gray-700 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all font-bold text-gray-900 shadow-inner placeholder:text-gray-400 placeholder:font-medium text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                className="w-full py-4 shadow-lg shadow-primary/20 rounded-2xl flex items-center justify-center font-extrabold text-sm" 
                disabled={loading}
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            /* Form 2: Enter New Password */
            <form className="space-y-5" onSubmit={handleUpdatePassword}>
              {/* New Password */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-extrabold text-gray-700 mb-2 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all font-bold text-gray-900 shadow-inner placeholder:text-gray-400 placeholder:font-medium text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none p-1 rounded-md"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2.5 px-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">Password Strength</span>
                      <span className={`text-[10px] uppercase tracking-wider font-extrabold ${strength.text}`}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-gray-200'}`}></div>
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-gray-200'}`}></div>
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 5 ? strength.color : 'bg-gray-200'}`}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-extrabold text-gray-700 mb-2 ml-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all font-bold text-gray-900 shadow-inner placeholder:text-gray-400 placeholder:font-medium text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none p-1 rounded-md"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                className="w-full py-4 mt-4 shadow-lg shadow-primary/20 rounded-2xl flex items-center justify-center font-extrabold text-sm" 
                disabled={loading}
              >
                {loading ? 'Updating password...' : 'Update Password'}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="font-extrabold text-xs text-primary hover:underline uppercase tracking-wider flex items-center justify-center gap-1.5">
              Back to Login <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
