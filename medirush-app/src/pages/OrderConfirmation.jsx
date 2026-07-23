import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Package, ArrowRight, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [txnId, setTxnId] = useState('');

  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setTxnId('TXN' + Math.floor(Math.random() * 1000000000));
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-24 relative overflow-hidden flex flex-col items-center pt-16">
      
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20"
      >
        <CheckCircle2 size={50} className="text-green-500" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center px-4 mb-8"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Successful!</h1>
        <p className="text-gray-500 font-medium">Your medicines are being packed and will be delivered shortly.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md px-4"
      >
        <div className="glass-card p-6 border-white/60 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                <p className="font-extrabold text-gray-900">{id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction ID</p>
                <p className="font-extrabold text-gray-900">{txnId}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                <p className="font-extrabold text-primary">10 - 15 mins</p>
              </div>
              <span className="bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-md border border-green-200">
                Paid
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate(`/track-order/${id}`)}
            variant="primary" 
            size="lg" 
            className="w-full py-4 shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
          >
            <Package size={20} /> Track Order
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => navigate('/home')}
              variant="outline"
              className="py-3 flex items-center justify-center gap-2"
            >
              <Home size={18} /> Home
            </Button>
            <Button 
              onClick={handleDownload}
              variant="outline"
              className="py-3 flex items-center justify-center gap-2"
              disabled={downloading}
            >
              <Download size={18} /> {downloading ? 'Saving...' : 'Invoice'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
