import React, { useState } from 'react';
import { UserProfile } from '../types';

interface IntroScreenProps {
  onLogin: (profile: UserProfile) => void;
}

const RANKS = [
  { label: 'E-1 to E-4', allowance: 4000 },
  { label: 'E-5', allowance: 7000 },
  { label: 'E-6', allowance: 8000 },
  { label: 'E-7', allowance: 10000 },
  { label: 'E-8', allowance: 12000 },
  { label: 'E-9', allowance: 14000 },
  { label: 'O-1 to O-3', allowance: 12000 },
  { label: 'O-4', allowance: 14000 },
  { label: 'O-5', allowance: 16000 },
  { label: 'O-6', allowance: 18000 },
];

export const IntroScreen: React.FC<IntroScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<number>(0);
  const [isBriefing, setIsBriefing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    rank: 'E-5',
    branch: 'ARMY',
    moveType: 'PCS',
    weightAllowance: 7000
  });

  const handleRankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = RANKS.find(r => r.label === e.target.value);
    setProfile(prev => ({
      ...prev,
      rank: e.target.value,
      weightAllowance: selected ? selected.allowance : 7000
    }));
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfile(prev => ({
        ...prev,
        branch: e.target.value
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);

  const startBriefing = () => {
    setIsBriefing(true);
    // In a real app, we'd trigger TTS here. 
    // For now, we'll simulate the agent's engagement.
    setTimeout(() => {
      setIsBriefing(false);
      onLogin(profile);
    }, 4000);
  };

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      nextStep(); // Go to Profile after permissions
    } catch (err) {
      console.error("Microphone and Camera permissions are required.");
    }
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 z-50 overflow-hidden font-sans">
      
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{
             backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)',
             backgroundSize: '32px 32px'
           }} 
      />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03] z-10" />

      {/* Briefing Overlay */}
      {isBriefing && (
        <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center">
          <div className="w-32 h-32 rounded-full border-2 border-tactical-green flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 rounded-full border border-tactical-green animate-ping opacity-20" />
            <svg className="w-16 h-16 text-tactical-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <div className="text-tactical-green font-mono text-xs mb-4 tracking-[0.5em] uppercase">Logistics Officer // Briefing</div>
          <h2 className="text-3xl font-display text-white mb-6 uppercase tracking-wider">Welcome to the Mission, {profile.rank}</h2>
          <p className="text-white/60 text-sm max-w-md font-mono leading-relaxed">
            "I am your Asset Conversion Engine. My objective is to optimize your {profile.moveType} mission. 
            I will identify, weigh, and categorize your inventory with 99.8% accuracy. 
            Stand by for system initialization..."
          </p>
          <div className="mt-12 flex gap-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-8 h-1 bg-tactical-green animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Step 0: Splash */}
      {step === 0 && (
        <div className="z-10 text-center animate-fade-in-up">
          <div className="text-tactical-green text-xs font-mono mb-6 tracking-[0.5em] uppercase crt-flicker">Department of Defense</div>
          <h1 className="text-8xl font-display text-white mb-2 tracking-tighter leading-none">
            MOVE<span className="text-tactical-green">GURU</span>
          </h1>
          <p className="text-white/40 text-[10px] font-mono mb-16 uppercase tracking-[0.3em]">Asset Transparency & Compliance Engine // V3.1-PRO</p>
          
          <button 
            onClick={nextStep}
            className="group relative px-12 py-4 bg-transparent border border-tactical-green text-tactical-green font-display uppercase tracking-[0.2em] hover:bg-tactical-green hover:text-black transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-tactical-green/10 group-hover:bg-transparent" />
            <span className="relative z-10">Initialize System</span>
          </button>
        </div>
      )}

      {/* Step 1: System Authorization (Permissions) */}
      {step === 1 && (
        <div className="z-10 w-full max-w-md bg-black/80 backdrop-blur-xl border border-tactical-green/20 p-10 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fade-in-up relative">
           <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-tactical-green" />
           <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-tactical-green" />
           
           <h2 className="text-2xl font-display text-white mb-8 uppercase tracking-wider border-b border-tactical-green/20 pb-4">System Authorization</h2>
           
           <div className="space-y-4 mb-10">
             <div className="flex items-center gap-5 p-5 bg-white/5 border border-white/10">
               <div className="w-12 h-12 rounded-none bg-tactical-green/10 border border-tactical-green/30 flex items-center justify-center text-tactical-green">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
               </div>
               <div>
                 <div className="text-xs font-display text-white uppercase tracking-widest">Visual Optical Sensor</div>
                 <div className="text-[9px] font-mono text-white/40 uppercase mt-1">Asset Identification Array</div>
               </div>
             </div>

             <div className="flex items-center gap-5 p-5 bg-white/5 border border-white/10">
               <div className="w-12 h-12 rounded-none bg-tactical-green/10 border border-tactical-green/30 flex items-center justify-center text-tactical-green">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
               </div>
               <div>
                 <div className="text-xs font-display text-white uppercase tracking-widest">Audio Input Array</div>
                 <div className="text-[9px] font-mono text-white/40 uppercase mt-1">Officer Interrogation Link</div>
               </div>
             </div>
           </div>

           <button 
              onClick={requestPermissions}
              className="w-full py-5 bg-tactical-green hover:bg-tactical-green/80 text-black font-display uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(0,255,65,0.2)]"
            >
              Authorize Access
            </button>
        </div>
      )}

      {/* Step 2: Profile Configuration */}
      {step === 2 && (
        <div className="z-10 w-full max-w-md bg-black/80 backdrop-blur-xl border border-tactical-green/20 p-10 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fade-in-up relative">
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-tactical-green" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-tactical-green" />

          <h2 className="text-2xl font-display text-white mb-8 uppercase tracking-wider border-b border-tactical-green/20 pb-4">Profile Configuration</h2>
          
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[9px] font-mono text-tactical-green uppercase tracking-[0.3em] mb-3">Service Branch</label>
                  <select 
                    value={profile.branch}
                    onChange={handleBranchChange}
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-none font-mono text-xs focus:border-tactical-green focus:outline-none transition-colors appearance-none"
                  >
                    {['ARMY', 'NAVY', 'MARINES', 'AIR FORCE', 'SPACE FORCE', 'COAST GUARD', 'GOVERNMENT', 'CORPORATE'].map(b => (
                      <option key={b} value={b} className="bg-black">{b}</option>
                    ))}
                  </select>
               </div>
               <div>
                  <label className="block text-[9px] font-mono text-tactical-green uppercase tracking-[0.3em] mb-3">Rank / Grade</label>
                  <select 
                    value={profile.rank}
                    onChange={handleRankChange}
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-none font-mono text-xs focus:border-tactical-green focus:outline-none transition-colors appearance-none"
                  >
                    {RANKS.map(r => (
                      <option key={r.label} value={r.label} className="bg-black">{r.label} (Max {r.allowance.toLocaleString()} lbs)</option>
                    ))}
                  </select>
               </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono text-tactical-green uppercase tracking-[0.3em] mb-3">Operation Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['PCS', 'RETIREMENT', 'SEPARATION', 'CORPORATE'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setProfile(prev => ({ ...prev, moveType: type as any }))}
                    className={`text-[9px] font-bold py-4 border transition-all font-mono ${profile.moveType === type ? 'bg-tactical-green border-tactical-green text-black' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={startBriefing}
              className="w-full py-5 mt-4 bg-tactical-green hover:bg-tactical-green/80 text-black font-display uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(0,255,65,0.2)]"
            >
              Confirm & Launch
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 flex items-center gap-8 text-[9px] text-white/20 font-mono tracking-[0.2em]">
        <span>UNCLASSIFIED // FOUO</span>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <span>SECURE TERMINAL 04</span>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <span className="crt-flicker">V3.1-PRO</span>
      </div>

      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
