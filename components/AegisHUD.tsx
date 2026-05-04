import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Activity, Cpu, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface AegisHUDProps {
  isConnected: boolean;
  isStreaming: boolean;
  volume: number;
  transcript: string;
  detectedItem?: any;
  agentStatus: 'IDLE' | 'SCANNING' | 'ANALYZING' | 'INTERROGATING';
}

export const AegisHUD: React.FC<AegisHUDProps> = ({
  isConnected,
  isStreaming,
  volume,
  transcript,
  detectedItem,
  agentStatus
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col p-6 font-mono text-[10px] uppercase tracking-wider text-cyan-400">
      {/* Top Status Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-sm">
            <Shield className={cn("w-3 h-3", isConnected ? "text-cyan-400 animate-pulse" : "text-red-500")} />
            <span>AEGIS SPATIAL COMMAND // V3.0-PRO</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-sm">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>LATENCY: 12MS // PPA-SECURE-LINK</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-sm">
            <div className={cn("w-2 h-2 rounded-full", isStreaming ? "bg-red-500 animate-pulse" : "bg-slate-500")} />
            <span>LIVE VLA FEED: {isStreaming ? 'ACTIVE' : 'STANDBY'}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-sm">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>AGENT STATUS: {agentStatus}</span>
          </div>
        </div>
      </div>

      {/* Center Targeting / Interrogation */}
      <div className="flex-1 flex items-center justify-center relative">
        <AnimatePresence>
          {detectedItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-64 h-64 border-2 border-cyan-500/50 rounded-lg flex flex-col items-center justify-center bg-cyan-500/5 shadow-[0_0_30px_rgba(0,229,255,0.1)]"
            >
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

              <div className="text-center space-y-1">
                <div className="text-cyan-400 font-bold text-xs">{detectedItem.name}</div>
                <div className="text-cyan-400/60">EST. MASS: {detectedItem.weight} LBS</div>
                <div className="text-cyan-400/60">VOL: {Math.round(detectedItem.weight / 10)} CUFT</div>
              </div>

              {/* Asset DNA Tag */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-3 py-1 font-bold text-[8px] whitespace-nowrap">
                ASSET DNA: {detectedItem.assetDna?.hash || 'MINTING...'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crosshair */}
        <div className="absolute w-8 h-8 pointer-events-none opacity-40">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-400" />
        </div>
      </div>

      {/* Bottom Readout */}
      <div className="mt-auto grid grid-cols-3 gap-6 items-end">
        {/* Left: Environmental / Circular */}
        <div className="space-y-2">
          <div className="text-cyan-400/40 text-[8px]">CIRCULAR VALORIZATION METRICS</div>
          <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 p-3 rounded-sm space-y-2">
            <div className="flex justify-between items-center">
              <span>LGEC COMPLIANCE</span>
              <CheckCircle2 className="w-3 h-3 text-green-400" />
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <motion.div 
                className="bg-cyan-400 h-full"
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
              />
            </div>
            <div className="text-[8px] text-cyan-400/60">ASSET LIFE EXTENSION: +24 MOS</div>
          </div>
        </div>

        {/* Center: VLA Concierge Transcript */}
        <div className="flex flex-col gap-2">
          <div className="text-center text-cyan-400/40 text-[8px]">AGENTIC INTERROGATION STREAM</div>
          <div className="bg-black/60 backdrop-blur-xl border-t-2 border-cyan-500 p-4 min-h-[100px] flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <Zap className={cn("w-3 h-3", volume > 0.1 ? "text-yellow-400" : "text-cyan-400")} />
              <span className="text-cyan-400 font-bold">LOGISTICS OFFICER:</span>
            </div>
            <div className="text-white text-xs leading-relaxed italic">
              {transcript || "Awaiting spatial input... Lead the walk, Commander."}
            </div>
            {/* Audio Visualizer */}
            <div className="flex gap-0.5 h-4 mt-3 items-center">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-cyan-400"
                  animate={{
                    height: volume > 0.1 ? [4, Math.random() * 16 + 4, 4] : 4
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Mission Readiness */}
        <div className="space-y-2">
          <div className="text-right text-cyan-400/40 text-[8px]">MISSION READINESS // DEST: FT LIBERTY</div>
          <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 p-3 rounded-sm space-y-2">
            <div className="flex justify-between items-center">
              <span>SPATIAL READINESS</span>
              <span className="text-cyan-400 font-bold">92%</span>
            </div>
            <div className="flex justify-between items-center text-[8px] text-cyan-400/60">
              <span>HOUSING FIT: MODEL B</span>
              <span className="text-green-400">OPTIMAL</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-500 text-[8px]">
              <AlertTriangle className="w-2 h-2" />
              <span>GHOST CAPACITY DETECTED: 14%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
