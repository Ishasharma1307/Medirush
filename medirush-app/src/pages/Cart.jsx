import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { CartItemCard } from '../components/CartItemCard';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

export const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem, cartSubtotal } = useCart();
  
  const handleCheckout = () => {
    navigate('/checkout');
  };

  const subtotal = cartSubtotal;
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-24 relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary to-blue-800 pt-10 pb-20 px-5 shadow-floating relative overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-xl transition-all shadow-sm border border-white/20">
              <ArrowLeft size={20} className="text-white" />
            </button>
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Your Cart</h1>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-glass border border-white/30 relative">
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-sm border border-white"></div>
            <ShoppingBag size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 -mt-10 relative z-20"
      >
        
        {cartItems.length === 0 ? (
          <motion.div variants={itemVariants} className="glass-card p-12 text-center flex flex-col items-center justify-center border border-white/60">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-full mb-6 border border-white/50 shadow-inner">
              <ShoppingBag size={48} className="text-primary/50" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">Your cart is empty</h2>
            <p className="text-gray-600 font-medium mb-8">Looks like you haven't added any medicines yet.</p>
            <Button 
              onClick={() => navigate('/home')}
              variant="primary"
              size="lg"
              className="px-8 py-4 shadow-lg shadow-primary/30"
            >
              Continue Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <motion.div variants={itemVariants} key={item.id}>
                  <CartItemCard 
                    item={item} 
                    onUpdateQuantity={updateQuantity} 
                    onRemove={removeItem} 
                  />
                </motion.div>
              ))}
            </div>

            {/* Right: Order Summary */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="glass-card border-white/60 p-6 sticky top-24">
                <h3 className="text-xl font-extrabold text-gray-900 mb-5 tracking-tight drop-shadow-sm">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 font-medium text-sm">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium text-sm">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-900">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200/50 flex justify-between items-center">
                    <span className="text-base font-extrabold text-gray-900 uppercase tracking-widest text-[11px]">Total</span>
                    <span className="text-3xl font-extrabold text-primary drop-shadow-sm">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  variant="primary"
                  className="w-full py-4 shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Checkout
                  <ChevronRight size={18} className="opacity-70" />
                </Button>

                <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-500/10 border border-green-500/20 py-2.5 rounded-xl shadow-sm">
                  <ShieldCheck size={16} className="text-green-600" />
                  Safe & Secure Payment
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </motion.div>
    </div>
  );
};
