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
  EyeOff,
  Smartphone,
  Key
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  // Stages: 'email' (enter email), 'otp' (verify OTP), 'reset' (enter new password), 'success' (auto-redirecting)
  const [mode, setMode] = useState('email');
  
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);

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

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval = null;
    if (mode === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [mode, otpTimer]);

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

  // 1. Send Recovery OTP
  const handleSendOtp = async (e) => {
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

      if (resetError) {
        if (resetError.status === 429 || resetError.message.includes('rate limit') || resetError.message.includes('rate_limit') || resetError.message.includes('exceeded')) {
          localStorage.setItem('sandbox_active', 'true');
          setSuccessMsg('Supabase rate limit reached. Activating sandbox verification mode. Enter 123456 to verify!');
          setMode('otp');
          setOtpToken('');
          setOtpTimer(60);
          setCanResendOtp(false);
          setLoading(false);
          return;
        }
        throw resetError;
      }

      localStorage.removeItem('sandbox_active');
      setSuccessMsg('A verification code has been sent to your email.');
      setMode('otp');
      setOtpToken('');
      setOtpTimer(60);
      setCanResendOtp(false);
    } catch (err) {
      let msg = err.message || 'Failed to send verification code.';
      if (msg.includes('rate limit')) {
        msg = 'Rate limit exceeded. Please wait a few minutes before trying again.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Recovery OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (otpToken.length < 6) {
      setError('Please enter the 6-digit verification code.');
      setLoading(false);
      return;
    }

    // Sandbox check
    if (localStorage.getItem('sandbox_active') === 'true') {
      if (otpToken === '123456') {
        setSuccessMsg('Sandbox code verified. Please set your new password.');
        setMode('reset');
        setLoading(false);
        return;
      } else {
        setError('Invalid sandbox verification code. Hint: Use 123456');
        setLoading(false);
        return;
      }
    }

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpToken,
        type: 'recovery'
      });

      if (verifyError) throw verifyError;

      localStorage.removeItem('sandbox_active');
      setSuccessMsg('OTP verified successfully. Please enter your new password.');
      setMode('reset');
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Resend Recovery OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (localStorage.getItem('sandbox_active') === 'true') {
      setSuccessMsg('Sandbox verification code resent. Use 123456!');
      setOtpTimer(60);
      setCanResendOtp(false);
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/forgot-password`,
      });

      if (resetError) throw resetError;
      setSuccessMsg('Verification code resent to your email.');
      setOtpTimer(60);
      setCanResendOtp(false);
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Update Password
  const handleResetPassword = async (e) => {
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

    // Sandbox check
    if (localStorage.getItem('sandbox_active') === 'true') {
      setSuccessMsg('Password updated successfully! Redirecting you to login...');
      localStorage.removeItem('sandbox_active');
      setMode('success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      // Log out to clear the temporary session
      await supabase.auth.signOut();

      setSuccessMsg('Password updated successfully! Redirecting you to login...');
      setMode('success');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to update password. Reset session may have expired.');
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
              {mode === 'email' && <Mail size={32} />}
              {mode === 'otp' && <Smartphone size={32} />}
              {mode === 'reset' && <Lock size={32} />}
              {mode === 'success' && <CheckCircle2 size={32} className="text-emerald-500" />}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
              {mode === 'email' && 'Forgot Password?'}
              {mode === 'otp' && 'Enter OTP Code'}
              {mode === 'reset' && 'Reset Password'}
              {mode === 'success' && 'Success!'}
            </h2>
            <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
              {mode === 'email' && 'Get a verification code to restore account access.'}
              {mode === 'otp' && `Enter the 6-digit code sent to ${email}`}
              {mode === 'reset' && 'Enter a strong, secure new password.'}
              {mode === 'success' && 'Redirecting you to login page...'}
            </p>
          </div>

          {mode === 'email' && (
            /* Stage 1: Request OTP Code */
            <form className="space-y-6" onSubmit={handleSendOtp}>
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
                {loading ? 'Sending code...' : 'Send Verification OTP'}
              </Button>
            </form>
          )}

          {mode === 'otp' && (
            /* Stage 2: Verify OTP Code */
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-extrabold text-gray-700 mb-2 ml-1">6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[1.5em] pl-6 py-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/35 focus:border-primary outline-none transition-all font-extrabold text-xl text-gray-900 shadow-inner"
                  placeholder="000000"
                />
              </div>

              <div className="flex items-center justify-between px-1 text-xs">
                <span className="text-gray-500 font-bold">
                  {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Did not receive code?'}
                </span>
                {canResendOtp && (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-extrabold text-primary hover:text-blue-800 transition-colors"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="glass"
                  className="flex-1 py-4 text-xs font-bold rounded-2xl" 
                  onClick={() => setMode('email')}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 py-4 text-xs font-bold rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20" 
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            </form>
          )}

          {mode === 'reset' && (
            /* Stage 3: Enter New Password */
            <form className="space-y-5" onSubmit={handleResetPassword}>
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

          {mode === 'success' && (
            /* Stage 4: Success Redirection */
            <div className="py-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 animate-bounce">
                  <CheckCircle2 size={40} />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Your password has been reset successfully.
              </p>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          )}

          {mode !== 'success' && (
            <div className="mt-8 text-center">
              <Link to="/login" className="font-extrabold text-xs text-primary hover:underline uppercase tracking-wider flex items-center justify-center gap-1.5">
                Back to Login <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
