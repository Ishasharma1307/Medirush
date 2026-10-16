import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LogOut, Menu, X, Activity, Home, Pill, Stethoscope, ShoppingCart, User, AlertCircle, Package } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (logout) await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const NavLink = ({ to, children, icon: Icon, isDanger }) => {
    const active = isActive(to);
    return (
      <Link 
        to={to} 
        className={cn(
          "flex items-center px-4 py-2 rounded-xl font-bold transition-all duration-300 text-sm",
          isDanger 
            ? "text-danger bg-danger/10 hover:bg-danger/20" 
            : active 
              ? "bg-primary/10 text-primary shadow-sm" 
              : "text-gray-600 hover:text-primary hover:bg-gray-50/50"
        )}
      >
        {Icon && <Icon className={cn("w-4 h-4 mr-1.5", active ? "text-primary" : "")} />}
        {children}
      </Link>
    );
  };

  // Mobile Bottom Nav Item
  const MobileNavItem = ({ to, icon: Icon, label, isCenter, badge }) => {
    const active = isActive(to);
    
    if (isCenter) {
      return (
        <Link to={to} className="relative -top-6 flex flex-col items-center justify-center">
          <div className="w-14 h-14 bg-danger rounded-full flex items-center justify-center shadow-lg shadow-danger/40 text-white animate-pulseSoft">
            <Icon size={28} />
          </div>
          <span className="text-[10px] font-bold text-danger mt-1">{label}</span>
        </Link>
      );
    }
    
    return (
      <Link to={to} className="relative flex flex-col items-center justify-center w-full h-full">
        <Icon size={22} className={cn("mb-1", active ? "text-primary" : "text-gray-400")} />
        {badge > 0 && (
          <span className="absolute top-1 right-[20%] bg-danger text-white text-[9px] font-extrabold px-1 min-w-[14px] text-center rounded-full border border-white">
            {badge}
          </span>
        )}
        <span className={cn("text-[10px] font-bold", active ? "text-primary" : "text-gray-400")}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop & Tablet Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "hidden md:block fixed w-full top-0 z-50 transition-all duration-500 pt-4 px-4 sm:px-6 lg:px-8",
        )}
      >
        <div className={cn(
          "max-w-7xl mx-auto rounded-2xl transition-all duration-500",
          scrolled ? "glass-panel px-6 py-3" : "bg-transparent px-2 py-4"
        )}>
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to={user ? "/home" : "/"} className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform mr-3">
                  <Activity className="text-white h-6 w-6" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-gray-900 transition-colors">
                  MediRush
                </span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="flex items-center space-x-1">
              {user ? (
                <>
                  <NavLink to="/home" icon={Home}>Home</NavLink>
                  <NavLink to="/medicines" icon={Pill}>Medicines</NavLink>
                  <NavLink to="/orders" icon={Package}>My Orders</NavLink>
                  <NavLink to="/symptom-checker" icon={Stethoscope}>Symptoms</NavLink>
                  <NavLink to="/cart" icon={ShoppingCart}>
                    <div className="flex items-center">
                      Cart
                      {cartCount > 0 && (
                        <span className="ml-1.5 bg-danger text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </div>
                  </NavLink>
                  
                  <div className="h-6 w-px bg-gray-200/50 mx-2"></div>
                  
                  <Link to="/emergency-request">
                    <Button variant="danger" size="sm" className="ml-1 shadow-danger/30 animate-pulseSoft">
                      Emergency
                    </Button>
                  </Link>
                  
                  <div className="h-6 w-px bg-gray-200/50 mx-2"></div>
                  
                  <Link to="/profile" className="ml-1" title="View Profile">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-sm">
                      <User size={18} />
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Log Out of MediRush"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-all ml-1.5 border border-transparent hover:border-rose-200 cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Link to="/login">
                    <Button variant="ghost" size="md">Log In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="md">Sign Up Free</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center shadow-sm">
        <Link to={user ? "/home" : "/"} className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-md mr-2">
            <Activity className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            MediRush
          </span>
        </Link>
        {user && (
          <div className="flex items-center gap-2">
            <Link to="/orders" className="p-1.5 rounded-xl bg-gray-100/80 text-gray-700 hover:text-primary" title="My Orders">
              <Package size={18} />
            </Link>
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <User size={16} />
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-gray-200/60"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 w-full z-50 glass-panel rounded-t-3xl pb-safe">
          <div className="flex justify-around items-center h-16 px-2 relative">
            <MobileNavItem to="/home" icon={Home} label="Home" />
            <MobileNavItem to="/medicines" icon={Pill} label="Meds" />
            
            {/* Center Emergency Button */}
            <div className="w-16 flex justify-center">
              <MobileNavItem to="/emergency-request" icon={AlertCircle} label="SOS" isCenter />
            </div>
            
            <MobileNavItem to="/orders" icon={Package} label="Orders" />
            <MobileNavItem to="/cart" icon={ShoppingCart} label="Cart" badge={cartCount} />
          </div>
        </div>
      )}
    </>
  );
};
