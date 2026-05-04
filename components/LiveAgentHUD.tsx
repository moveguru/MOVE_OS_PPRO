import React from 'react';
import { motion } from 'motion/react';

interface LiveAgentHUDProps {
  volume: number;
  isConnected: boolean;
  isStreaming: boolean;
  transcript: { role: 'user' | 'model'; text: string } | null;
}

export const LiveAgentHUD: React.FC<LiveAgentHUDProps> = ({ volume, isConnected, isStreaming, transcript }) => {
  const bars = 24;
  
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center pointer-events-none w-full max-w-xl">
      {/* Agent Status Indicator (Tactical) */}
      <div className="flex items-center gap-4 px-6 py-2 bg-black/80 backdrop-blur-xl border-x border-tactical-green/30 rounded-none mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative">
        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-tactical-green shadow-[0_0_10px_rgba(0,255,65,0.5)]" />
        <div className="absolute -right-1 top-0 bottom-0 w-1 bg-tactical-green shadow-[0_0_10px_rgba(0,255,65,0.5)]" />
        
        <div className="relative w-3 h-3 flex items-center justify-center">
          <div className={`w-full h-full rounded-full transition-colors duration-500 ${isConnected ? 'bg-tactical-green' : 'bg-tactical-red'}`} />
          {isConnected && isStreaming && (
            <motion.div 
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-tactical-green" 
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-display uppercase tracking-[0.3em] text-white leading-none">
            {isConnected ? 'Logistics Officer' : 'Officer Offline'}
          </span>
          <span className="text-[7px] font-mono uppercase tracking-[0.1em] text-white/40 leading-none mt-1">
            {isConnected ? 'Secure SAT-Link Active' : 'Signal Lost'}
          </span>
        </div>
      </div>

      {/* Voice Visualization (Analog Hardware Style) */}
      <div className="relative flex items-center justify-center h-20 w-full mb-8 px-12">
        {/* Background Grid */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-full h-[1px] bg-tactical-green" />
          <div className="absolute w-[1px] h-full bg-tactical-green" />
        </div>

        <div className="flex items-center gap-1 w-full justify-center">
          {Array.from({ length: bars }).map((_, i) => {
            const distance = Math.abs(i - bars/2);
            const multiplier = 1 - (distance / (bars/2));
            const height = isStreaming ? Math.max(4, volume * 200 * multiplier) : 4;
            
            return (
              <motion.div
                key={i}
                animate={{ 
                  height,
                  backgroundColor: isStreaming ? '#00FF41' : '#ffffff10'
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-1 rounded-none shadow-[0_0_15px_rgba(0,255,65,0.2)]"
              />
            );
          })}
        </div>
      </div>

      {/* Live Transcript (Live Captions at Bottom) */}
      <div className="fixed bottom-32 left-0 right-0 flex items-center justify-center px-10 w-full z-[70] pointer-events-none">
        {transcript && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={transcript.text}
            className={`px-8 py-4 rounded-none border-t-2 shadow-2xl max-w-2xl w-full relative overflow-hidden backdrop-blur-md ${
              transcript.role === 'model' 
                ? 'bg-black/80 border-tactical-green text-white' 
                : 'bg-black/60 border-white/20 text-white/60 italic'
            }`}
          >
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
            
            <p className="text-base font-mono leading-relaxed tracking-tight text-center">
              {transcript.role === 'model' && <span className="text-[8px] uppercase font-black text-tactical-green block mb-1 tracking-[0.3em]">Officer Response</span>}
              <span className="crt-flicker">"{transcript.text}"</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
