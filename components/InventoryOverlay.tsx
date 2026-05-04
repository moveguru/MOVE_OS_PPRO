import React, { useEffect, useState } from 'react';
import { InventoryItem, WasteMetrics, UserProfile } from '../types';

interface InventoryOverlayProps {
  items: InventoryItem[];
  detectedItem: InventoryItem | null;
  metrics: WasteMetrics;
  userProfile: UserProfile;
  isStreaming: boolean;
  isConnected: boolean;
  volume: number;
  transcript: { role: 'user' | 'model'; text: string } | null;
  onToggleStream: () => void;
  onExit: () => void;
}

export const InventoryOverlay: React.FC<InventoryOverlayProps> = ({
  items,
  detectedItem,
  metrics,
  userProfile,
  isStreaming,
  isConnected,
  volume,
  transcript,
  onToggleStream,
  onExit
}) => {
  const [latestItem, setLatestItem] = useState<InventoryItem | null>(null);
  const [milestone, setMilestone] = useState<string | null>(null);
  
  const ROOMS = ['Living Room', 'Master Bedroom', 'Kitchen', 'Dining Room', 'Garage', 'Storage'];
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

  // Calculate Capacity Percentage
  const capacityUsedPercent = Math.min((metrics.totalWeight / userProfile.weightAllowance) * 100, 100);
  
  // Calculate Diversion Percentage (ISWM)
  const diversionPercent = metrics.totalWeight > 0 
    ? (metrics.divertedWeight / metrics.totalWeight) * 100 
    : 0;

  // Effect to handle both new logged items AND ephemeral detected items
  useEffect(() => {
    // Priority: Detected item (ephemeral) > Newest logged item
    if (detectedItem) {
        setLatestItem(detectedItem);
        // Clear ephemeral detection visual after 2s if no updates
        const timer = setTimeout(() => setLatestItem(null), 2000);
        return () => clearTimeout(timer);
    } else if (items.length > 0) {
      const newItem = items[items.length - 1];
      // Only set if we don't have a transient detection showing
      setLatestItem(newItem);

      // Milestone Check: Every 5th item
      if (items.length % 5 === 0) {
          setMilestone("High Value Asset");
          setTimeout(() => setMilestone(null), 4000);
      }

      const timer = setTimeout(() => setLatestItem(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [items, detectedItem]);

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between safe-area-inset overflow-hidden">
      
      {/* --- Visual Effects --- */}
      {isStreaming && (
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-scan-lines z-0 crt-flicker" />
      )}
      <style>{`
        .bg-scan-lines {
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 255, 65, 0.5) 50%);
          background-size: 100% 4px;
          animation: scan 0.5s linear infinite;
        }
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fade-in-right {
            from { opacity: 0; transform: translateX(-20px) translateY(10px); filter: blur(4px); }
            to { opacity: 1; transform: translateX(0) translateY(0); filter: blur(0); }
        }
        .animate-fade-in-right {
            animation: fade-in-right 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fade-in-left {
            from { opacity: 0; transform: translateX(20px) translateY(-10px); filter: blur(4px); }
            to { opacity: 1; transform: translateX(0) translateY(0); filter: blur(0); }
        }
        .animate-fade-in-left {
            animation: fade-in-left 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes target-lock {
            0% { transform: scale(1.1); opacity: 0; box-shadow: inset 0 0 0 rgba(0,255,65,0); }
            50% { transform: scale(0.98); opacity: 1; box-shadow: inset 0 0 20px rgba(0,255,65,0.2); }
            100% { transform: scale(1); opacity: 1; box-shadow: inset 0 0 10px rgba(0,255,65,0.1); }
        }
        .animate-target-lock {
            animation: target-lock 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes pulse-corner {
            0%, 100% { opacity: 0.3; filter: brightness(1); transform: scale(1); }
            50% { opacity: 1; filter: brightness(1.5); transform: scale(1.05); }
        }
        .animate-pulse-corner-tl { animation: pulse-corner 2s infinite ease-in-out; transform-origin: top left; }
        .animate-pulse-corner-tr { animation: pulse-corner 2s infinite ease-in-out 0.5s; transform-origin: top right; }
        .animate-pulse-corner-br { animation: pulse-corner 2s infinite ease-in-out 1s; transform-origin: bottom right; }
        .animate-pulse-corner-bl { animation: pulse-corner 2s infinite ease-in-out 1.5s; transform-origin: bottom left; }
      `}</style>

      {/* --- Milestone Notification --- */}
      {milestone && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
              <div className="bg-tactical-blue/10 backdrop-blur-md border border-tactical-blue text-tactical-blue px-8 py-3 rounded-none shadow-[0_0_40px_rgba(0,209,255,0.2)] flex items-center gap-4">
                  <div className="bg-tactical-blue text-black p-1.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                  <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Strategic Asset Logged</div>
                      <div className="text-lg font-display uppercase tracking-wider">{milestone}</div>
                  </div>
              </div>
          </div>
      )}

      {/* --- Bounding Box Overlay (Tactical Target Lock) --- */}
      {latestItem && latestItem.boundingBox && (
        <div 
            className="absolute z-20 pointer-events-none transition-all duration-300 animate-target-lock"
            style={{
                top: `${latestItem.boundingBox.ymin / 10}%`,
                left: `${latestItem.boundingBox.xmin / 10}%`,
                height: `${(latestItem.boundingBox.ymax - latestItem.boundingBox.ymin) / 10}%`,
                width: `${(latestItem.boundingBox.xmax - latestItem.boundingBox.xmin) / 10}%`,
            }}
        >
            <div className={`absolute inset-0 border-2 border-dashed ${latestItem.status === 'DETECTED' ? 'border-tactical-blue/60 bg-tactical-blue/5' : 'border-tactical-green/60 bg-tactical-green/5'}`}></div>
            
            {/* Overlay grid lines */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {/* Tactical Corners */}
            <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 animate-pulse-corner-tl shadow-[0_0_15px_rgba(0,255,65,0.5)] ${latestItem.status === 'DETECTED' ? 'border-tactical-blue shadow-tactical-blue/50' : 'border-tactical-green shadow-tactical-green/50'}`} />
            <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 animate-pulse-corner-tr shadow-[0_0_15px_rgba(0,255,65,0.5)] ${latestItem.status === 'DETECTED' ? 'border-tactical-blue shadow-tactical-blue/50' : 'border-tactical-green shadow-tactical-green/50'}`} />
            <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 animate-pulse-corner-bl shadow-[0_0_15px_rgba(0,255,65,0.5)] ${latestItem.status === 'DETECTED' ? 'border-tactical-blue shadow-tactical-blue/50' : 'border-tactical-green shadow-tactical-green/50'}`} />
            <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 animate-pulse-corner-br shadow-[0_0_15px_rgba(0,255,65,0.5)] ${latestItem.status === 'DETECTED' ? 'border-tactical-blue shadow-tactical-blue/50' : 'border-tactical-green shadow-tactical-green/50'}`} />

            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-50">
                <div className={`w-full h-[2px] ${latestItem.status === 'DETECTED' ? 'bg-tactical-blue' : 'bg-tactical-green'}`}></div>
                <div className={`h-full w-[2px] absolute ${latestItem.status === 'DETECTED' ? 'bg-tactical-blue' : 'bg-tactical-green'}`}></div>
                {/* Center dot */}
                <div className={`absolute w-1 h-1 rounded-full ${latestItem.status === 'DETECTED' ? 'bg-white' : 'bg-white'}`}></div>
            </div>
            
            <div className="absolute -top-12 left-0 animate-fade-in-right whitespace-nowrap opacity-0" style={{ animationDelay: '0.1s' }}>
                 <div className={`text-xs font-black px-4 py-2 uppercase tracking-[0.2em] flex items-center gap-3 border shadow-2xl backdrop-blur-md ${latestItem.status === 'DETECTED' ? 'bg-tactical-blue/90 text-black border-tactical-blue' : 'bg-tactical-green/90 text-black border-tactical-green'}`}>
                    <span className={`w-2.5 h-2.5 rounded-full animate-ping ${latestItem.status === 'DETECTED' ? 'bg-white' : 'bg-black'}`}></span>
                    {latestItem.status === 'DETECTED' ? `ACQUIRING // ${latestItem.name}` : `VERIFIED // ${latestItem.name}`}
                 </div>
            </div>
            
            {latestItem.status !== 'DETECTED' && (
                <div className="absolute -bottom-10 right-0 animate-fade-in-left whitespace-nowrap opacity-0" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-black/95 text-tactical-green text-xs font-mono px-4 py-2 border-2 border-tactical-green/50 flex gap-4 shadow-2xl backdrop-blur-md">
                        <span className="flex items-center gap-1 font-bold"><span className="opacity-50 font-normal">WT:</span>{latestItem.weight} LB</span>
                        <span className="opacity-30">|</span>
                        <span className="flex items-center gap-1 font-bold"><span className="opacity-50 font-normal">VOL:</span>{latestItem.cartonCount && latestItem.cartonCount > 0 ? `${latestItem.cartonCount} CTN` : 'BULK'}</span>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* --- Mission Control Header --- */}
      <div className="flex justify-between items-start p-6 pointer-events-none relative z-30 w-full bg-gradient-to-b from-black/90 via-black/40 to-transparent">
        
        {/* Left Section: Room Selector & ISWM Strategic Meter */}
        <div className="flex flex-col gap-6">
            
            {/* Room Context Selector */}
            <div className="pointer-events-auto relative">
                <button 
                  onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                  className="flex items-center justify-between gap-4 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 w-56 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border-tactical-green hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all group"
                >
                    <div className="flex flex-col items-start text-left">
                        <span className="text-[9px] text-tactical-green uppercase tracking-[0.3em] font-black group-hover:animate-pulse">Location Context</span>
                        <span className="text-xs text-white font-display uppercase tracking-widest mt-0.5">{selectedRoom}</span>
                    </div>
                    <svg className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isRoomDropdownOpen ? 'rotate-180 text-tactical-green' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {/* Tactical Corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/50 group-hover:border-tactical-green transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/50 group-hover:border-tactical-green transition-colors" />
                </button>
                
                {isRoomDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-black/85 backdrop-blur-xl border border-white/20 shadow-2xl z-50 animate-fade-in-up origin-top">
                        {ROOMS.map(room => (
                            <button
                                key={room}
                                onClick={() => {
                                    setSelectedRoom(room);
                                    setIsRoomDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest transition-colors ${selectedRoom === room ? 'bg-tactical-green/20 text-tactical-green border-l-4 border-tactical-green' : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent hover:border-white/30'}`}
                            >
                                {room}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ISWM Strategic Meter */}
            <div className="flex flex-col gap-2 w-64 iswm-target pointer-events-none">
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <div className="text-[10px] text-tactical-green uppercase font-black tracking-[0.3em]">Waste Diversion</div>
                  <div className="text-[8px] text-white/40 uppercase font-mono">DoD Mandate Compliance</div>
                </div>
                <div className="text-lg font-display text-white tracking-wider">{diversionPercent.toFixed(1)}%</div>
            </div>
            <div className="w-full h-1.5 bg-white/5 border border-white/10 relative overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,255,65,0.5)] ${diversionPercent >= 50 ? 'bg-tactical-green' : 'bg-yellow-500'}`} 
                    style={{ width: `${Math.min(diversionPercent, 100)}%` }} 
                />
                {/* Target Marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-tactical-red/50 z-10" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-white/40 uppercase">
              <span>Diverted: {metrics.divertedWeight.toFixed(0)} LB</span>
              <span>Target: 50%</span>
            </div>
            </div>
        </div>

        {/* Right: Capacity Utilization (Tactical) */}
        <div className="flex flex-col gap-2 w-64 items-end capacity-target">
             <div className="flex justify-between items-end w-full text-right">
                <div className="text-lg font-display text-white tracking-wider">{(metrics.totalWeight / 1000).toFixed(1)}K / {(userProfile.weightAllowance / 1000).toFixed(1)}K</div>
                <div className="flex flex-col items-end">
                  <div className="text-[10px] text-tactical-blue uppercase font-black tracking-[0.3em]">Weight Allowance</div>
                  <div className="text-[8px] text-white/40 uppercase font-mono">{userProfile.rank} Entitlement</div>
                </div>
            </div>
            <div className="w-full h-1.5 bg-white/5 border border-white/10 relative overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,209,255,0.5)] ${capacityUsedPercent > 90 ? 'bg-tactical-red' : 'bg-tactical-blue'}`} 
                    style={{ width: `${capacityUsedPercent}%` }} 
                />
            </div>
            <div className="text-[9px] font-mono text-white/40 uppercase">Available: {(userProfile.weightAllowance - metrics.totalWeight).toLocaleString()} LB</div>
        </div>
      </div>


      {/* --- Main Content Area --- */}
      <div className="flex-grow relative flex">
         {/* Center: System Status / Captions (Moved to LiveAgentHUD) */}
         <div className="absolute inset-x-0 bottom-24 flex flex-col items-center justify-center px-8 z-30">
            {/* Transcript removed here to avoid duplication with LiveAgentHUD */}
        </div>

        {/* Left: Glassmorphism Inventory List (Burying Manifest) */}
        <div className="absolute left-0 top-0 bottom-24 w-72 p-4 overflow-y-auto pointer-events-none manifest-target">
            <div className="flex flex-col-reverse gap-[-10px]">
                {items.slice().reverse().map((item, idx) => (
                    <div 
                        key={item.id} 
                        className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-none w-full flex justify-between items-center text-left animate-fade-in-up shadow-2xl relative"
                        style={{ 
                          animationDelay: `${idx * 0.05}s`,
                          marginTop: idx === 0 ? '0' : '-12px', // Overlap effect
                          zIndex: 100 - idx,
                          opacity: 1 - (idx * 0.15) // Fade out older items
                        }}
                    >
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-tactical-green opacity-50" />
                         <div className="flex flex-col items-start overflow-hidden pl-2">
                             <span className="text-white text-[11px] font-bold uppercase tracking-wider truncate w-32">{item.name}</span>
                             <span className="text-[8px] text-white/40 font-mono uppercase tracking-widest">{item.condition}</span>
                         </div>
                         <div className="flex flex-col items-end">
                             <span className="text-tactical-green text-xs font-mono font-bold">{item.weight} LB</span>
                             {item.cartonCount && item.cartonCount > 0 && <span className="text-[8px] text-tactical-blue font-mono">{item.cartonCount} CTN</span>}
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- Bottom Controls --- */}
      <div className="relative w-full px-4 pb-6 flex items-end justify-between pointer-events-none z-30 bg-gradient-to-t from-black/90 to-transparent pt-12">
        
        {/* Left: Exit */}
        <button onClick={onExit} className="pointer-events-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
             <div className="w-8 h-8 rounded border border-gray-600 flex items-center justify-center text-xs">ESC</div>
             <span className="text-[10px] uppercase tracking-widest">End Session</span>
        </button>

        {/* Center: Mic (Engagement Status) */}
        <div className="pointer-events-auto mic-target">
            <button 
                onClick={onToggleStream}
                className={`relative group rounded-full w-20 h-20 flex items-center justify-center transition-all ${isStreaming ? 'bg-red-500/10' : 'bg-white/5'}`}
            >
                {isStreaming && (
                <div 
                    className="absolute inset-0 rounded-full border border-green-500 opacity-60"
                    style={{ transform: `scale(${1 + volume * 1.5})`, transition: 'transform 0.1s ease-out' }}
                />
                )}
                
                <div className={`z-10 w-14 h-14 rounded-full flex items-center justify-center transition-colors border ${isStreaming ? 'bg-red-600 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-transparent border-green-500 text-green-500'}`}>
                {isStreaming ? (
                    <div className="w-4 h-4 bg-white rounded-sm" />
                ) : (
                    <svg className="w-6 h-6 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                )}
                </div>
            </button>
            <div className="text-center mt-2 text-[9px] uppercase tracking-widest text-gray-500">{isStreaming ? 'Live' : 'Standby'}</div>
        </div>

        {/* Right: Connection */}
         <div className={`flex items-center gap-2 px-3 py-1 rounded border ${isConnected ? 'bg-green-900/20 border-green-800 text-green-500' : 'bg-red-900/20 border-red-800 text-red-500'}`}>
             <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
             <span className="text-[9px] font-bold uppercase">{isConnected ? 'SAT-LINK' : 'OFFLINE'}</span>
         </div>

      </div>

    </div>
  );
};
