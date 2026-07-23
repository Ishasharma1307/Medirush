import React from 'react';
import { Package, MapPin, User, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';

export const AdminOrderCard = ({ order, onUpdateStatus }) => {
  const isPending = order.status === 'Pending';
  
  return (
    <div className={cn(
      "glass-card overflow-hidden transition-all duration-300 hover:shadow-floating", 
      order.is_emergency ? "border-danger/40 shadow-danger/10" : "border-white/60"
    )}>
      
      {/* Header */}
      <div className={cn(
        "p-5 border-b flex justify-between items-center backdrop-blur-md", 
        order.is_emergency ? "bg-danger/10 border-danger/20" : "bg-white/40 border-white/50"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner", 
            order.is_emergency ? "bg-danger/20 text-danger border border-danger/30" : "bg-white/80 text-primary border border-white"
          )}>
            <Package size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{order.id}</p>
            <h4 className="font-extrabold text-gray-900 text-lg drop-shadow-sm">{order.customer_name}</h4>
          </div>
        </div>
        <div className="text-right">
          <p className="font-extrabold text-primary text-xl drop-shadow-sm mb-1">${order.total.toFixed(2)}</p>
          <span className={cn(
            "text-[9px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-lg border shadow-sm",
            isPending ? "bg-orange-500/10 text-orange-600 border-orange-500/20" : "bg-blue-500/10 text-blue-700 border-blue-500/20"
          )}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5 bg-white/20 backdrop-blur-sm">
        
        {order.is_emergency && (
          <div className="bg-danger/10 text-danger text-[11px] font-extrabold uppercase tracking-widest p-3.5 rounded-xl flex items-center gap-2 border border-danger/20 shadow-sm animate-pulseSoft">
            <AlertTriangle size={16} /> EMERGENCY ORDER
          </div>
        )}

        <div className="space-y-3 bg-white/40 p-4 rounded-xl border border-white/50 shadow-inner">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="font-bold text-gray-800 text-sm drop-shadow-sm"><span className="text-primary mr-1">{item.quantity}x</span> {item.name}</span>
              <span className="text-gray-600 font-extrabold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 space-y-3">
          <p className="text-sm text-gray-700 font-bold flex items-start gap-3 bg-white/60 p-3.5 rounded-xl border border-white/50 shadow-sm">
            <div className="bg-white p-1.5 rounded-lg shadow-inner flex-shrink-0 mt-0.5"><MapPin size={16} className="text-primary" /></div>
            <span className="leading-relaxed mt-1">{order.delivery_address}</span>
          </p>
          {order.prescription_url && (
            <p className="text-[11px] uppercase tracking-widest text-primary flex items-center gap-2 font-bold cursor-pointer hover:underline bg-primary/10 w-fit px-3 py-2 rounded-lg border border-primary/20 shadow-sm">
              <FileText size={14} /> View Prescription
            </p>
          )}
        </div>

        {/* Actions */}
        {isPending && (
          <div className="grid grid-cols-2 gap-4 pt-3">
            <Button 
              onClick={() => onUpdateStatus(order.id, 'Rejected')}
              variant="glass"
              className="py-3 text-[11px] uppercase tracking-widest text-danger border-danger/20 hover:bg-danger/10 flex items-center justify-center gap-2"
            >
              <XCircle size={16} /> Reject
            </Button>
            <Button 
              onClick={() => onUpdateStatus(order.id, 'Accepted')}
              variant="primary"
              className="py-3 text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
            >
              <CheckCircle size={16} /> Accept
            </Button>
          </div>
        )}
      </div>

    </div>
  );
};
