import React, { useState } from 'react';

interface OnboardingTourProps {
  onClose: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('moveguru_hide_tour', 'true');
    }
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-24">
      {/* Blurred background overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={handleClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-[0_0_50px_rgba(0,255,65,0.1)] overflow-hidden font-sans pointer-events-auto mt-[-10vh]">
        
        {/* Tactical Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tactical-green via-tactical-blue to-transparent" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white/10 pointer-events-none" />

        <div className="mb-8 relative z-10">
            <div className="text-[10px] text-tactical-green font-mono uppercase tracking-[0.3em] mb-2 crt-flicker">Orientation Briefing</div>
            <h2 className="text-3xl font-display text-white tracking-wider uppercase">HUD Elements Overview</h2>
            <p className="text-white/60 text-sm mt-2 font-mono">Familiarize yourself with the Asset Scanner interface before deployment.</p>
        </div>

        <div className="space-y-6 mb-8 relative z-10">
            {/* ISWM Meter */}
            <div className="flex gap-4 items-start">
               <div className="bg-tactical-green/10 text-tactical-green p-3 rounded shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide">ISWM Meter</h3>
                  <p className="text-white/50 text-sm leading-relaxed">Tracks your waste diversion progress in real-time. The DoD mandate requires 50% diversion from landfills. Navigate to the top left of your HUD to monitor compliance.</p>
               </div>
            </div>

            {/* Inventory List */}
            <div className="flex gap-4 items-start">
               <div className="bg-white/5 text-white/80 p-3 rounded shrink-0 border border-white/10">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
               </div>
               <div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide">Inventory List (Manifest)</h3>
                  <p className="text-white/50 text-sm leading-relaxed">Displays your verified digital twin of assets. Items are logged based on JTR standards with their estimated weights and carton counts. Found on the left panel.</p>
               </div>
            </div>

            {/* Mic Status */}
            <div className="flex gap-4 items-start">
               <div className="bg-tactical-blue/10 text-tactical-blue p-3 rounded shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
               </div>
               <div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide">Engagement Status (Mic)</h3>
                  <p className="text-white/50 text-sm leading-relaxed">Located at the bottom center. Controls your direct line to the AI Officer. The officer will actively interrogate you about item details to ensure accuracy.</p>
               </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-white/10 gap-4 relative z-10">
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative w-5 h-5 bg-black border border-white/30 flex items-center justify-center group-hover:border-tactical-green transition-colors">
                    {dontShowAgain && <div className="w-3 h-3 bg-tactical-green" />}
                    <input 
                      type="checkbox" 
                      className="absolute opacity-0 cursor-pointer w-full h-full"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                    />
                </div>
                <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest group-hover:text-white transition-colors">Don't show this briefing again</span>
            </label>

            <button 
                onClick={handleClose}
                className="bg-tactical-green text-black font-bold uppercase tracking-[0.2em] px-8 py-3 text-xs shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:bg-tactical-green/90 transition-colors"
            >
                Acknowledge
            </button>
        </div>

      </div>
    </div>
  );
};
