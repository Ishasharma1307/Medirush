import React from 'react';
import { LocateFixed, Plus, Minus } from 'lucide-react';
import { useMap } from 'react-leaflet';

export const MapControls = ({ onRecenter }) => {
  const map = useMap(); 
  
  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-3">
      {/* Zoom Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden pointer-events-auto">
        <button 
          onClick={(e) => { e.stopPropagation(); map.zoomIn(); }}
          className="p-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100"
        >
          <Plus size={20} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); map.zoomOut(); }}
          className="p-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
        >
          <Minus size={20} />
        </button>
      </div>

      {/* Recenter Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onRecenter(); }}
        className="p-3 bg-primary text-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group pointer-events-auto"
      >
        <LocateFixed size={24} className="group-hover:animate-spin-slow" />
      </button>
    </div>
  );
};
