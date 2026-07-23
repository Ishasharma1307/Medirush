import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, ShieldCheck, ChevronRight, Truck, Wallet, Smartphone, Landmark } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { cn } from '../utils/cn';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0 && !isProcessing && step === 1) {
      navigate('/cart');
    }
  }, [cartItems, navigate, isProcessing, step]);

  const deliveryFee = 5.00;
  const platformFee = 1.50;
  const taxes = cartSubtotal * 0.05;
  const total = cartSubtotal + deliveryFee + platformFee + taxes;

  const handleNextStep = () => setStep(s => s + 1);
  const handlePrevStep = () => setStep(s => s - 1);

  const handlePayment = () => {
    if (!paymentMethod) return;
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const fakeOrderId = 'ORD' + Math.floor(Math.random() * 1000000);
      clearCart();
      navigate(`/order-confirmation/${fakeOrderId}`);
    }, 2500);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-24 relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md pt-8 pb-4 px-5 shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => step > 1 ? handlePrevStep() : navigate('/cart')} 
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mt-6 flex items-center justify-between px-2">
          {['Address', 'Summary', 'Payment'].map((label, idx) => (
            <div key={label} className="flex flex-col items-center relative z-10 w-full">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors mb-2 shadow-sm",
                step > idx + 1 ? "bg-green-500 text-white" : 
                step === idx + 1 ? "bg-primary text-white ring-4 ring-primary/20" : 
                "bg-gray-200 text-gray-500"
              )}>
                {step > idx + 1 ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                step >= idx + 1 ? "text-gray-900" : "text-gray-400"
              )}>{label}</span>
            </div>
          ))}
          {/* Connecting lines */}
          <div className="absolute top-[6.5rem] left-[15%] right-[15%] h-0.5 bg-gray-200 -z-10">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 mt-8 relative z-20">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Address */}
          {step === 1 && (
            <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div className="glass-card p-6 border-white/60">
                <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center">
                  <MapPin className="text-primary mr-2" size={20} /> Delivery Address
                </h2>
                <div className="space-y-4">
                  <Input label="Full Name" placeholder="John Doe" defaultValue="Isha Sharma" />
                  <Input label="Phone Number" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
                  <Input label="Street Address" placeholder="123 Main St" defaultValue="Apt 4B, Health Avenue" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" placeholder="City" defaultValue="Mumbai" />
                    <Input label="Zip Code" placeholder="10001" defaultValue="400001" />
                  </div>
                </div>
              </div>
              <Button onClick={handleNextStep} size="lg" className="w-full py-4 shadow-lg shadow-primary/30">
                Continue to Summary
              </Button>
            </motion.div>
          )}

          {/* Step 2: Summary */}
          {step === 2 && (
            <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div className="glass-card p-6 border-white/60">
                <h2 className="text-lg font-extrabold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center p-1 border border-gray-200">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-extrabold text-gray-900 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <div className="flex justify-between text-gray-600 text-sm font-medium">
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm font-medium">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm font-medium">
                    <span>Platform Fee</span>
                    <span>${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm font-medium">
                    <span>Taxes</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-extrabold text-gray-900">Grand Total</span>
                    <span className="text-xl font-extrabold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleNextStep} size="lg" className="w-full py-4 shadow-lg shadow-primary/30">
                Proceed to Payment
              </Button>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              
              {isProcessing ? (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-full animate-ping absolute inset-0"></div>
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-primary/30 text-white">
                      <ShieldCheck size={40} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Processing Payment</h2>
                  <p className="text-gray-500 font-medium">Please do not close this window or press back.</p>
                </div>
              ) : (
                <>
                  <div className="glass-card p-6 border-white/60">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-extrabold text-gray-900">Payment Method</h2>
                      <span className="text-xl font-extrabold text-primary">${total.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: 'upi', label: 'UPI (GPay, PhonePe)', icon: Smartphone },
                        { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                        { id: 'netbanking', label: 'Net Banking', icon: Landmark },
                        { id: 'wallet', label: 'Wallets', icon: Wallet },
                        { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                      ].map(method => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={cn(
                            "w-full flex items-center p-4 rounded-xl border-2 transition-all",
                            paymentMethod === method.id 
                              ? "border-primary bg-primary/5 shadow-sm" 
                              : "border-gray-100 bg-white hover:border-primary/30 hover:bg-gray-50"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center mr-4",
                            paymentMethod === method.id ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                          )}>
                            <method.icon size={20} />
                          </div>
                          <span className={cn(
                            "font-bold",
                            paymentMethod === method.id ? "text-primary" : "text-gray-700"
                          )}>{method.label}</span>
                          
                          {paymentMethod === method.id && (
                            <CheckCircle2 className="ml-auto text-primary" size={20} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={handlePayment} 
                    disabled={!paymentMethod}
                    size="lg" 
                    className="w-full py-4 shadow-lg shadow-primary/30 text-lg flex items-center justify-center gap-2"
                  >
                    Pay ${total.toFixed(2)} <ChevronRight size={20} />
                  </Button>
                </>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
