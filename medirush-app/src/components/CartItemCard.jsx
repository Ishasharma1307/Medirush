import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, FileText } from 'lucide-react';
import { cn } from '../utils/cn';

export const CartItemCard = ({ item, onUpdateQuantity, onRemove }) => {
  const navigate = useNavigate();

  const handleNavigateDetail = () => {
    if (item?.id) {
      const cleanId = String(item.id).replace('ai-suggested-bundle-', '');
      navigate(`/medicines/${cleanId}`);
    }
  };

  return (
    <div className="glass-card p-4 border-white/60 flex gap-4 transition-all duration-300 hover:shadow-floating">
      {/* Image - Clickable */}
      <div 
        onClick={handleNavigateDetail}
        className="w-24 h-24 bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/50 shadow-inner cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
        title="View product details"
      >
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
        ) : (
          <div className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No Img</div>
        )}
      </div>

      {/* Details - Clickable Title */}
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div 
            onClick={handleNavigateDetail}
            className="cursor-pointer group"
            title="View product details"
          >
            <h3 className="font-extrabold text-gray-900 text-base drop-shadow-sm line-clamp-1 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <p className="text-gray-500 text-xs font-bold mt-0.5 line-clamp-1">{item.pharmacy_name}</p>
            {item.prescription_required && (
              <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-lg mt-2 shadow-sm">
                <FileText size={10} className="mr-1" /> Rx Required
              </span>
            )}
          </div>
          <p className="font-extrabold text-primary text-lg drop-shadow-sm ml-2">${(item.price * item.quantity).toFixed(2)}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-xl p-1 border border-white/50 shadow-sm">
            <button 
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <Minus size={16} />
            </button>
            <span className="font-extrabold text-gray-900 w-4 text-center">{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>
          <button 
            onClick={() => onRemove(item.id)}
            className="p-2 text-danger/70 hover:text-danger hover:bg-danger/10 hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-danger/20 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
