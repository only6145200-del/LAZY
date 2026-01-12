
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Map as MapIcon, 
  Settings, 
  Plus, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  Wallet, 
  Car, 
  Train, 
  Navigation,
  CloudRain,
  Zap,
  LayoutGrid,
  List,
  AlertCircle,
  MapPin,
  Coffee,
  Heart,
  Download,
  Home,
  MapPinned,
  Compass
} from 'lucide-react';
import { TravelTag, TransportPreference, TravelFrequency, UserDNA, Destination } from './types';
import DNASelector from './components/DNASelector';
import ItineraryCard from './components/ItineraryCard';
import { generateItinerary, swapDestination } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<'landing' | 'onboarding' | 'planner' | 'itinerary'>('landing');
  const [city, setCity] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(15000);
  const [dna, setDna] = useState<UserDNA>({
    tags: [TravelTag.FOODIE, TravelTag.CULTURAL],
    frequency: TravelFrequency.FIRST_TIME,
    transport: TransportPreference.PUBLIC
  });

  const [itinerary, setItinerary] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleGenerate = async () => {
    setLoading(true);
    setStep('itinerary');
    const result = await generateItinerary(city, startPoint, days, budget, dna);
    setItinerary(result);
    setLoading(false);
  };

  const handleSwap = async (oldDest: Destination, reason: string) => {
    const newDest = await swapDestination(oldDest, reason, city, dna);
    setItinerary(prev => prev.map(d => d.id === oldDest.id ? newDest : d));
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#FCF8F3] relative pb-24 border-x border-[#F0EBE4] shadow-sm">
      {/* Landing View */}
      {step === 'landing' && (
        <div className="h-screen flex flex-col items-center justify-center p-12 bg-[#FCF8F3] animate-in fade-in duration-1000">
          <div className="relative mb-12">
            <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center border border-[#E8E1D9] shadow-2xl shadow-[#A67C52]/10 relative z-10">
              <Compass size={56} className="text-[#A67C52] animate-[spin_20s_linear_infinite]" />
            </div>
            <div className="absolute -inset-4 border border-[#A67C52]/20 rounded-[3rem] rotate-6"></div>
          </div>
          <h1 className="text-6xl font-black mb-4 tracking-tighter text-[#3E2723]">懶旅伴</h1>
          <p className="text-[#8D8173] font-medium text-center leading-relaxed mb-24 italic max-w-[240px]">
            「你出發，安置我。<br/>剩下的瑣碎，交給 AI 去煩惱。」
          </p>
          
          <div className="w-full space-y-6">
            <button 
              onClick={() => setStep('onboarding')}
              className="w-full bg-[#A67C52] text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-[#A67C52]/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              開啟我的懶人流浪 <ChevronRight size={22} />
            </button>
            <p className="text-center text-[#B5A99A] text-[10px] font-bold uppercase tracking-[0.4em] opacity-70">
              - 智慧型旅遊救贖 -
            </p>
          </div>
        </div>
      )}

      {/* Onboarding - DNA */}
      {step === 'onboarding' && (
        <div className="p-10 space-y-12 animate-in slide-in-from-bottom-10 duration-500">
          <header className="space-y-3">
            <h2 className="text-4xl font-black text-[#3E2723] tracking-tight leading-tight">定義你的<br/>流浪基因</h2>
            <div className="h-1 w-12 bg-[#A67C52] rounded-full"></div>
            <p className="text-sm text-[#8D8173] font-medium leading-relaxed">我們得先確認你的品味，才能幫你精準地安置行程。</p>
          </header>

          <section className="space-y-6">
            <label className="text-[10px] font-black text-[#B5A99A] uppercase tracking-[0.3em]">你想成為哪種旅人？</label>
            <DNASelector 
              selectedTags={dna.tags} 
              onToggleTag={(tag) => {
                setDna(prev => ({
                  ...prev,
                  tags: prev.tags.includes(tag) 
                    ? prev.tags.filter(t => t !== tag) 
                    : [...prev.tags, tag]
                }));
              }} 
            />
          </section>

          <section className="space-y-6">
            <label className="text-[10px] font-black text-[#B5A99A] uppercase tracking-[0.3em]">這座城市，你熟嗎？</label>
            <div className="space-y-4">
              {(Object.values(TravelFrequency)).map(freq => (
                <button
                  key={freq}
                  onClick={() => setDna(prev => ({ ...prev, frequency: freq }))}
                  className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${
                    dna.frequency === freq ? 'bg-white border-[#A67C52] shadow-xl translate-x-1' : 'bg-[#FAF7F2] border-[#F0EBE4]'
                  }`}
                >
                  <span className={`font-black ${dna.frequency === freq ? 'text-[#A67C52]' : 'text-[#8D8173]'}`}>{freq}</span>
                  <div className={`w-5 h-5 rounded-full border-2 ${dna.frequency === freq ? 'bg-[#A67C52] border-[#A67C52]' : 'border-[#E8E1D9]'}`}></div>
                </button>
              ))}
            </div>
          </section>

          <button 
            onClick={() => setStep('planner')}
            className="w-full bg-[#3E2723] text-white font-black py-7 rounded-[3rem] shadow-xl mt-8"
          >
            下一步：出發設定
          </button>
        </div>
      )}

      {/* Planner - Details */}
      {step === 'planner' && (
        <div className="p-10 space-y-12 animate-in slide-in-from-bottom-10 duration-500">
          <header className="space-y-3">
            <h2 className="text-4xl font-black text-[#3E2723] tracking-tight">細節設定</h2>
            <div className="h-1 w-12 bg-[#A67C52] rounded-full"></div>
            <p className="text-sm text-[#8D8173] font-medium leading-relaxed">填入基本座標，剩下的空白由 AI 填滿。</p>
          </header>

          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#B5A99A] uppercase tracking-[0.3em] flex items-center gap-2">
                <Home size={14} className="text-[#A67C52]" /> 你的落腳處 (從哪出發？)
              </label>
              <input 
                type="text" 
                placeholder="例如：東京希爾頓、成田機場..."
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                className="w-full p-6 rounded-[2rem] bg-white border border-[#F0EBE4] focus:border-[#A67C52] outline-none font-bold text-[#3E2723] transition-all text-lg placeholder-[#B5A99A]/40"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#B5A99A] uppercase tracking-[0.3em] flex items-center gap-2">
                <Search size={14} className="text-[#A67C52]" /> 目的地城市
              </label>
              <input 
                type="text" 
                placeholder="例如：京都、布拉格、倫敦..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-6 rounded-[2rem] bg-white border border-[#F0EBE4] focus:border-[#A67C52] outline-none font-bold text-[#3E2723] transition-all text-lg placeholder-[#B5A99A]/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B5A99A] uppercase tracking-[0.3em] flex items-center gap-2">
                  <Calendar size={14} className="text-[#A67C52]" /> 浪費幾天？
                </label>
                <div className="flex items-center bg-white rounded-[2rem] border border-[#F0EBE4] p-2 h-[74px]">
                  <button onClick={() => setDays(Math.max(1, days-1))} className="w-full font-black text-[#B5A99A] text-xl">-</button>
                  <span className="w-full text-center font-black text-[#3E2723]">{days} 天</span>
                  <button onClick={() => setDays(days+1)} className="w-full font-black text-[#B5A99A] text-xl">+</button>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B5A99A] uppercase tracking-[0.3em] flex items-center gap-2">
                  <Wallet size={14} className="text-[#A67C52]" /> 預算上限 (TWD)
                </label>
                <input 
                  type="number" 
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full p-6 rounded-[2rem] bg-white border border-[#F0EBE4] focus:border-[#A67C52] outline-none font-black text-[#3E2723] text-center"
                />
              </div>
            </div>

            <div className="space-y-5">
              <label className="text-[10px] font-black text-[#B5A99A] uppercase tracking-[0.3em] flex items-center gap-2">
                <Car size={14} className="text-[#A67C52]" /> 移動方式
              </label>
              <div className="grid grid-cols-3 gap-4">
                {Object.values(TransportPreference).map(tp => (
                  <button
                    key={tp}
                    onClick={() => setDna(prev => ({ ...prev, transport: tp }))}
                    className={`py-6 px-2 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
                      dna.transport === tp ? 'bg-[#A67C52] border-[#A67C52] text-white shadow-xl' : 'bg-white border-[#F0EBE4] text-[#8D8173]'
                    }`}
                  >
                    {tp === TransportPreference.DRIVING && <Car size={20} />}
                    {tp === TransportPreference.PUBLIC && <Train size={20} />}
                    {tp === TransportPreference.MIXED && <Zap size={20} />}
                    <span className="text-[10px] font-black">{tp}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={!city}
            className={`w-full bg-[#A67C52] text-white font-black py-7 rounded-[3rem] shadow-2xl transition-all flex items-center justify-center gap-3 ${
              !city ? 'opacity-20 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'
            }`}
          >
            <Sparkles size={22} /> 生成救贖行程
          </button>
        </div>
      )}

      {/* Itinerary - Results */}
      {step === 'itinerary' && (
        <div className="animate-in fade-in duration-1000">
          {/* Header */}
          <div className="glass sticky top-0 z-50 px-8 py-8 border-b border-[#F0EBE4]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-[#3E2723] tracking-tighter">{city} 漫讀</h1>
                <p className="text-[9px] text-[#B5A99A] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]"></span>
                  {days} 天 • {dna.frequency}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} className="p-4 bg-white rounded-2xl text-[#8D8173] shadow-sm border border-[#F0EBE4] transition-colors hover:bg-[#FAF7F2]">
                  {viewMode === 'list' ? <MapIcon size={22} /> : <List size={22} />}
                </button>
                <button onClick={() => setStep('planner')} className="p-4 bg-white rounded-2xl text-[#8D8173] shadow-sm border border-[#F0EBE4] transition-colors hover:bg-[#FAF7F2]">
                  <Settings size={22} />
                </button>
              </div>
            </div>

            {/* Weather Sensor */}
            <div onClick={() => setIsRaining(!isRaining)} className={`mt-8 px-5 py-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
              isRaining ? 'bg-[#EBF5FF] border-[#D0E6FF]' : 'bg-[#FFF9F0] border-[#FFECDA]'
            }`}>
              <div className="flex items-center gap-4">
                {isRaining ? <CloudRain className="text-blue-400" size={18} /> : <Sparkles className="text-amber-400" size={18} />}
                <p className="text-[10px] font-bold text-[#3E2723] leading-snug">
                  {isRaining ? "「聽說會下雨，我已幫你切換為室內避雨模式。」" : "「今天陽光燦爛，適合去街角浪費生命。」"}
                </p>
              </div>
              <div className="text-[8px] font-black text-[#A67C52] uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-[#A67C52]/20 shadow-sm">模擬天氣</div>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-48 space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 border-[3px] border-[#F0EBE4] border-t-[#A67C52] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-[#A67C52] animate-pulse" size={32} />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <p className="font-black text-[#3E2723] text-xl tracking-tight">AI 正在規劃你的流浪...</p>
                  <p className="text-[11px] text-[#B5A99A] italic font-medium leading-relaxed max-w-[200px] mx-auto opacity-70">
                    「好風景需要耐心等待，<br/>就像好心情需要慢慢醞釀。」
                  </p>
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8 px-4 opacity-70 bg-[#FAF7F2] py-4 rounded-3xl border border-dashed border-[#E8E1D9]">
                  <Home size={14} className="text-[#A67C52]" />
                  <span className="text-[10px] font-black text-[#8D8173] uppercase tracking-[0.2em]">
                    啟程自：{startPoint || '城市中心座標'}
                  </span>
                </div>
                {(isRaining ? itinerary.map(d => !d.isIndoor ? {...d, name: `${d.name} (避雨推薦)`, isIndoor: true, description: "下雨天就別勉強了，這裏有屋簷也有靈魂。"} : d) : itinerary).map((spot) => (
                  <ItineraryCard key={spot.id} destination={spot} onSwap={(reason) => handleSwap(spot, reason)} />
                ))}
              </div>
            ) : (
              <div className="h-[65vh] bg-white rounded-[4rem] border border-[#F0EBE4] shadow-inner relative overflow-hidden flex items-center justify-center">
                <div className="text-center space-y-6 px-10">
                  <div className="w-20 h-20 bg-[#FAF7F2] rounded-full mx-auto flex items-center justify-center">
                    <MapPin size={40} className="text-[#A67C52] opacity-40" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-sm uppercase tracking-[0.4em] text-[#3E2723]">靈魂導航地圖</p>
                    <p className="text-[10px] font-medium leading-relaxed text-[#B5A99A]">
                      「地圖只是參考，迷失在巷弄裡才是旅行的開始。」
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-8 py-8 glass border-t border-[#F0EBE4] flex items-center justify-between z-[100]">
            <div className="flex flex-col">
              <span className="text-[8px] text-[#B5A99A] font-black uppercase tracking-[0.3em]">救贖預算平衡</span>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-24 h-1.5 bg-[#F0EBE4] rounded-full overflow-hidden">
                  <div className="bg-[#A67C52] h-full" style={{ width: `${Math.random() * 40 + 20}%` }}></div>
                </div>
                <span className="text-[10px] font-black text-[#3E2723]">舒適</span>
              </div>
            </div>
            <button className="bg-[#3E2723] text-white px-10 py-5 rounded-[2.5rem] font-black text-xs shadow-2xl shadow-[#3E2723]/20 active:scale-95 transition-transform flex items-center gap-3">
              立即出發 <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-24 bg-white/95 backdrop-blur-md border-t border-[#F0EBE4] grid grid-cols-4 z-40 px-6">
        <button onClick={() => setStep('landing')} className={`flex flex-col items-center justify-center transition-colors ${step === 'landing' ? 'text-[#A67C52]' : 'text-[#B5A99A]'}`}>
          <LayoutGrid size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black mt-2 uppercase tracking-tighter">首頁</span>
        </button>
        <button onClick={() => setStep('planner')} className={`flex flex-col items-center justify-center transition-colors ${step === 'planner' ? 'text-[#A67C52]' : 'text-[#B5A99A]'}`}>
          <Search size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black mt-2 uppercase tracking-tighter">規劃</span>
        </button>
        <div className="relative flex flex-col items-center justify-center">
          <button 
            onClick={() => setStep('onboarding')}
            className="absolute -top-10 w-16 h-16 bg-[#3E2723] rounded-3xl flex items-center justify-center text-white shadow-2xl border-[5px] border-white active:scale-90 transition-transform hover:scale-110"
          >
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>
        <button className="flex flex-col items-center justify-center text-[#B5A99A] opacity-50">
          <Download size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black mt-2 uppercase tracking-tighter">離線</span>
        </button>
      </div>
    </div>
  );
};

export default App;
