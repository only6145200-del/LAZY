
import React, { useState } from 'react';
import { Destination } from '../types';
// Fixed: Added ChevronRight to the lucide-react imports
import { RefreshCw, MapPin, Clock, DollarSign, Coffee, Camera, Trash2, Quote, ChevronRight } from 'lucide-react';

interface ItineraryCardProps {
  destination: Destination;
  onSwap: (reason: string) => void;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ destination, onSwap }) => {
  const [isSwapping, setIsSwapping] = useState(false);

  const reasons = [
    { label: "太俗氣", value: "太普通了，我不要當觀光客" },
    { label: "懶得動", value: "太遠了，我只想在附近流浪" },
    { label: "預算低", value: "荷包在哭泣，找個免費的靈魂出口" },
    { label: "沒頻率", value: "這個地方跟我今天的心情頻率不合" }
  ];

  return (
    <div className="relative mb-14 group px-2 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Aesthetic Vertical Guide */}
      <div className="absolute left-[-15px] top-0 bottom-[-56px] w-[1px] bg-[#F0EBE4]">
        <div className="absolute top-10 left-[-6px] w-3 h-3 rounded-full bg-white border-2 border-[#A67C52]"></div>
      </div>

      <div className="bg-white rounded-[3rem] overflow-hidden border border-[#F0EBE4] shadow-sm hover:shadow-2xl transition-all duration-700">
        <div className="flex flex-col">
          {/* Main Photo Section */}
          <div className="relative w-full h-64 overflow-hidden bg-[#FAF7F2]">
            <img 
              src={destination.image} 
              alt={destination.name} 
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1518005020411-38b81210a7ab?q=80&w=800&auto=format&fit=crop`;
              }}
            />
            <div className="absolute top-6 left-6 flex gap-3">
              <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#A67C52] text-[9px] font-black rounded-full tracking-[0.2em] uppercase shadow-sm">
                {destination.type}
              </span>
              {destination.isIndoor && (
                <span className="px-4 py-1.5 bg-[#3E2723]/80 backdrop-blur-md text-white text-[9px] font-black rounded-full flex items-center gap-1.5 tracking-widest">
                  <Coffee size={10} /> 避世處
                </span>
              )}
            </div>
            <button 
              onClick={() => setIsSwapping(!isSwapping)}
              className="absolute top-6 right-6 p-4 bg-white/95 backdrop-blur-lg rounded-[1.5rem] text-[#A67C52] shadow-xl hover:rotate-180 transition-all duration-700 active:scale-90"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {/* Descriptive Content Section */}
          <div className="p-9 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-[#3E2723] tracking-tighter leading-none">
                  {destination.name}
                </h3>
                <div className="flex items-center gap-2 text-[#B5A99A]">
                  <MapPin size={12} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">靈魂座標 24.5N</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#A67C52] bg-[#FAF7F2] px-3 py-1.5 rounded-full">
                <Camera size={13} strokeWidth={2.5} />
                <span className="text-[9px] font-black tracking-widest">AESTHETIC</span>
              </div>
            </div>

            <div className="relative pt-2">
              <Quote className="absolute -left-4 -top-2 text-[#A67C52] opacity-10 rotate-180" size={32} />
              <p className="text-[15px] text-[#5D5246] leading-relaxed font-medium italic relative z-10">
                {destination.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#F0EBE4]">
              <div className="flex gap-6 text-[10px] font-black text-[#B5A99A] uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2"><Clock size={14} className="text-[#A67C52]/40" /> {destination.time}</span>
                <span className="flex items-center gap-2"><DollarSign size={14} className="text-[#A67C52]/40" /> {destination.cost}</span>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-[#A67C52] tracking-widest hover:translate-x-1 transition-transform">
                導航靈魂 <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Humorous Reasons Feedback */}
        {isSwapping && (
          <div className="p-10 bg-[#FAF7F2] border-t border-[#F0EBE4] animate-in fade-in slide-in-from-bottom-6 duration-500">
            <header className="mb-8 space-y-2">
              <h4 className="text-[10px] font-black text-[#8D8173] uppercase tracking-[0.4em] flex items-center gap-2">
                <Trash2 size={14} className="text-[#A67C52]" /> 為什麼想拋棄這個靈魂？
              </h4>
              <p className="text-[11px] text-[#B5A99A] font-medium">別害羞，AI 不會受傷，但我們需要知道你的品味。</p>
            </header>
            
            <div className="grid grid-cols-2 gap-4">
              {reasons.map(r => (
                <button
                  key={r.label}
                  onClick={() => {
                    onSwap(r.value);
                    setIsSwapping(false);
                  }}
                  className="px-4 py-5 bg-white border border-[#E8E1D9] rounded-[1.5rem] text-[11px] font-black text-[#3E2723] hover:border-[#A67C52] hover:text-[#A67C52] hover:shadow-lg transition-all text-center leading-snug"
                >
                  {r.label}
                </button>
              ))}
              <button 
                onClick={() => setIsSwapping(false)}
                className="col-span-2 py-4 text-[10px] font-black text-[#B5A99A] uppercase tracking-[0.3em] hover:text-[#3E2723] transition-colors"
              >
                算了，我還是忍受一下吧
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryCard;
