import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff, LogIn, AlertCircle, Activity, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const Login = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (authError) throw authError;
      if (data.session) navigate('/home');
    } catch (err) {
      let message = err.message;
      if (message.includes('Invalid login credentials')) message = 'Incorrect email or password. Please try again.';
      else if (message.includes('Email not confirmed')) message = 'Please verify your email address before logging in.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background font-sans relative overflow-hidden">
      
      {/* Decorative Background for the entire page */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Left Side: Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-blue-800 to-indigo-900 p-12 text-white flex-col justify-between relative overflow-hidden shadow-floating z-10 rounded-r-[3rem] border-r border-white/20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulseSoft"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400/20 blur-2xl animate-pulseSoft" style={{animationDelay: '1s'}}></div>
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 flex items-center">
          <Link to="/" className="flex items-center group cursor-pointer">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-glass mr-4 group-hover:scale-105 transition-transform border border-white/30">
              <Activity className="text-white h-7 w-7 drop-shadow-md" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight drop-shadow-md">MediRush</span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative z-10 max-w-md">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-md border border-white/30 shadow-glass text-white text-[11px] uppercase tracking-widest font-bold px-4 py-2 rounded-full mb-8">
            <ShieldCheck size={14} className="mr-2" /> Secure Access
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">Welcome back to <br/>health & safety.</h1>
          <p className="text-blue-100 text-lg font-bold leading-relaxed drop-shadow-sm">
            Log in to manage your emergency prescriptions, track your orders in real-time, and discover nearby pharmacies.
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="relative z-10 text-[11px] uppercase tracking-widest text-blue-200/70 font-bold">
          &copy; {new Date().getFullYear()} MediRush Inc.
        </motion.div>
      </div>

      {/* Right Side: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="w-full max-w-md glass-card p-8 sm:p-12 border-white/60"
        >
          
          <div className="text-center mb-10 lg:hidden">
             <div className="w-16 h-16 bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Activity size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">MediRush</h2>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm">Log In</h2>
            <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Please enter your details to access your account.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-danger/10 backdrop-blur-sm border-l-4 border-danger rounded-r-xl flex items-start shadow-sm">
              <AlertCircle className="text-danger mr-3 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-sm text-danger font-bold">{error}</p>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-extrabold text-gray-700 mb-2 ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-bold text-gray-900 shadow-inner placeholder:text-gray-400 placeholder:font-medium"
                placeholder="you@example.com"
              />
            </div>

            <div className="relative">
              <label className="block text-[11px] uppercase tracking-widest font-extrabold text-gray-700 mb-2 ml-1">Password</label>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-bold text-gray-900 shadow-inner pr-12 placeholder:text-gray-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-5 top-[42px] text-gray-400 hover:text-primary transition-colors focus:outline-none bg-white p-1 rounded-md shadow-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-end">
              <a href="#" className="text-[11px] uppercase tracking-widest font-extrabold text-primary hover:text-blue-800 transition-colors">Forgot password?</a>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full py-4 mt-4 shadow-lg shadow-primary/30" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : 'Log In Securely'}
            </Button>
            
            <Button 
              type="button" 
              variant="glass"
              className="w-full py-4 mt-4 text-primary border-primary/20 hover:bg-primary/5 flex items-center justify-center" 
              onClick={() => {
                loginAsDemo();
                navigate('/home');
              }}
            >
              Quick Demo Login
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-600 font-bold text-[11px] uppercase tracking-widest">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-extrabold text-primary hover:text-blue-800 transition-colors ml-1 border-b border-primary/30">
              Sign up now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
