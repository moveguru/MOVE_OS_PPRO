import React, { useState, useEffect } from 'react';
import { InventoryItem, Badge, WasteMetrics } from '../types';
import { LedgerService, CustodyRecord } from '../services/LedgerService';

interface DashboardProps {
  inventory: InventoryItem[];
  badges: Badge[];
  metrics: WasteMetrics;
  onDeploy: () => void;
  onLogout: () => void;
}

type TabState = 'LEDGER' | 'CIRCULAR' | 'METRICS' | 'TELEMETRY';

export const Dashboard: React.FC<DashboardProps> = ({ inventory, badges, metrics, onDeploy, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabState>('LEDGER');
  const [ledgerBlocks, setLedgerBlocks] = useState<CustodyRecord[]>([]);
  
  // Sync Ledger when inventory changes
  useEffect(() => {
      // In a real app, this would query the backend smart contract.
      // For the prototype, we generate blocks for recent items if they aren't in the ledger yet.
      const currentLedger = LedgerService.getLedger();
      if (inventory.length > currentLedger.length) {
          const newItems = inventory.slice(currentLedger.length);
          newItems.forEach(item => {
              LedgerService.commitRecord(item, 'ORIGIN_SCAN', 'AGENT_AI_CORE');
          });
          setLedgerBlocks(LedgerService.getLedger());
      } else {
          setLedgerBlocks(currentLedger);
      }
  }, [inventory]);

  // Rank Logic
  const totalXP = badges.reduce((acc, b) => acc + b.xp, 0) + (inventory.length * 50);
  const nextRankXP = Math.ceil((totalXP + 1) / 1000) * 1000;
  const rankProgress = ((totalXP % 1000) / 1000) * 100;
  const currentRank = totalXP < 1000 ? "Recruit" : totalXP < 2000 ? "Logistics Specialist" : "Supply Commander";

  const divertedItems = inventory.filter(i => i.status === 'DONATE' || i.status === 'TRASH');

  return (
    <div className="absolute inset-0 bg-black text-white overflow-y-auto z-40 font-sans">
      {/* Tactical Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10" 
           style={{
             backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }} 
      />
      
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-tactical-green/20 p-6 flex justify-between items-center z-50 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="text-[9px] text-tactical-green font-mono tracking-[0.4em] uppercase crt-flicker">MoveOS // Agent-Led Logistics Architecture</div>
          <div className="text-2xl font-display tracking-wider uppercase">Mission Control</div>
        </div>
        <button 
          onClick={onLogout} 
          className="text-[9px] font-mono border border-white/20 hover:border-tactical-red hover:text-tactical-red px-4 py-2 uppercase tracking-[0.2em] transition-all"
        >
          Disconnect
        </button>
      </div>

      <style>{`
        @keyframes slide-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-entry {
          animation: slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>

      <div className="p-6 pb-32 space-y-8 max-w-5xl mx-auto relative z-10">
        
        {/* Mission Status Bar */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-shrink-0 bg-tactical-green/10 border border-tactical-green/30 px-4 py-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-tactical-green animate-pulse" />
            <span className="text-[10px] font-mono text-tactical-green uppercase tracking-widest">System: Nominal</span>
          </div>
          <div className="flex-shrink-0 bg-white/5 border border-white/10 px-4 py-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-tactical-blue" />
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Agents: Active</span>
          </div>
          <div className="flex-shrink-0 bg-white/5 border border-white/10 px-4 py-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Chain of Custody: Secure</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Dashboard Panel */}
          <div className="lg:col-span-3 space-y-6">
             
             {/* Profile & Deploy Action */}
             <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-white/5 p-6 border border-white/10 relative overflow-hidden group flex-1">
                     <div className="absolute top-0 left-0 w-1 h-full bg-tactical-green opacity-50" />
                     <div className="relative z-10">
                         <div className="flex justify-between items-start mb-2">
                            <div className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em]">Operator Profile</div>
                            <div className="text-[8px] font-mono bg-white/10 px-2 py-0.5 border border-white/20 text-white/60">VERIFIED</div>
                         </div>
                         <div className="text-3xl font-display text-white uppercase tracking-tight">{currentRank}</div>
                         <div className="mt-2 text-xs font-mono text-white/60">WT ALLOWANCE: 8,000 LBS</div>
                     </div>
                </div>

                <button 
                  onClick={onDeploy}
                  className="group relative md:w-1/3 py-6 bg-tactical-green text-black font-display text-lg uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-tactical-green/90 active:scale-[0.98] shadow-[0_0_30px_rgba(0,255,65,0.2)] flex flex-col items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <span className="relative z-10">Launch AI Agent</span>
                </button>
             </div>

             {/* Dynamic Module Tabs */}
             <div className="border-b border-white/10 flex gap-6 mt-4">
                 <button onClick={() => setActiveTab('LEDGER')} className={`pb-3 text-[10px] font-mono tracking-widest uppercase transition-all border-b-2 ${activeTab === 'LEDGER' ? 'text-white border-tactical-blue' : 'text-white/40 border-transparent hover:text-white/70'}`}>Chain of Custody</button>
                 <button onClick={() => setActiveTab('CIRCULAR')} className={`pb-3 text-[10px] font-mono tracking-widest uppercase transition-all border-b-2 ${activeTab === 'CIRCULAR' ? 'text-white border-tactical-green' : 'text-white/40 border-transparent hover:text-white/70'}`}>Circular Engine</button>
                 <button onClick={() => setActiveTab('METRICS')} className={`pb-3 text-[10px] font-mono tracking-widest uppercase transition-all border-b-2 ${activeTab === 'METRICS' ? 'text-white border-yellow-500' : 'text-white/40 border-transparent hover:text-white/70'}`}>Agent QC Metrics</button>
                 <button onClick={() => setActiveTab('TELEMETRY')} className={`pb-3 text-[10px] font-mono tracking-widest uppercase transition-all border-b-2 ${activeTab === 'TELEMETRY' ? 'text-white border-purple-500' : 'text-white/40 border-transparent hover:text-white/70'}`}>ITV Telemetry</button>
             </div>

             {/* Tab Content Rendering */}
             <div className="min-h-[400px]">
                 
                 {/* CHAIN OF CUSTODY (LEDGER) */}
                 {activeTab === 'LEDGER' && (
                    <div className="space-y-4 animate-entry">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-mono text-white/50 uppercase tracking-[0.2em] bg-white/5 inline-block px-3 py-1">Secure Custody Ledger</h3>
                            <span className="text-[10px] font-mono text-tactical-green bg-tactical-green/10 px-2 border border-tactical-green/30">BLOCKS: {ledgerBlocks.length}</span>
                        </div>
                        {ledgerBlocks.length === 0 ? (
                            <div className="text-center py-12 text-white/20 font-mono text-[10px] border border-dashed border-white/10 uppercase tracking-widest">
                                [ No Assets Logged in Smart Contract ]
                            </div>
                        ) : (
                            ledgerBlocks.map((block) => (
                            <div key={block.hash} className="bg-white/5 border border-white/10 flex flex-col group hover:border-tactical-blue/30 transition-all font-mono">
                                {/* Block Header */}
                                <div className="bg-black/50 px-4 py-2 border-b border-white/5 flex justify-between items-center text-[9px] text-white/40 uppercase">
                                    <span>Block #{block.blockHeight}</span>
                                    <span>{new Date(block.timestamp).toISOString()}</span>
                                </div>
                                {/* Block Body */}
                                <div className="p-4 flex justify-between items-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-tactical-blue/50 group-hover:bg-tactical-blue transition-all duration-300" />
                                    <div className="pl-2">
                                        <div className="text-white text-sm tracking-widest uppercase mb-1">
                                            {block.itemName}
                                        </div>
                                        <div className="flex gap-4 text-[9px]">
                                            <span className="text-tactical-blue/80">ACTION: {block.action}</span>
                                            <span className="text-yellow-500/80">ACTOR: {block.actor}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <div className="text-[8px] text-white/20">PREV HASH: {block.previousHash}</div>
                                        <div className="text-[10px] text-tactical-blue bg-tactical-blue/10 px-2 py-0.5 font-bold tracking-widest border border-tactical-blue/20">
                                            {block.hash}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                 )}

                 {/* CIRCULAR ENGINE */}
                 {activeTab === 'CIRCULAR' && (
                     <div className="animate-entry space-y-6">
                         <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 border-l-2 border-tactical-green">
                                <div className="text-white/40 text-[9px] uppercase font-mono tracking-[0.2em] mb-4">Carbon Offset</div>
                                <div className="text-4xl font-display text-white">{metrics.totalCarbonSaved.toFixed(0)}</div>
                                <div className="text-[9px] text-tactical-green font-mono mt-2 tracking-widest uppercase">LBS CO2e Saved</div>
                            </div>
                            
                            <div className="bg-white/5 p-6 border-l-2 border-tactical-blue/50">
                                <div className="text-white/40 text-[9px] uppercase font-mono tracking-[0.2em] mb-4">Avoided Cost (Tariff Advisory)</div>
                                <div className="text-4xl font-display text-white">${metrics.totalTariffCredit.toFixed(0)}</div>
                                <div className="text-[9px] text-tactical-blue font-mono mt-2 tracking-widest uppercase mb-1">DOD Budget Retained</div>
                            </div>
                         </div>

                         <div>
                            <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-4 border-b border-white/10 pb-2">Assets Ready for Micro-Marketplace</h4>
                            {divertedItems.length === 0 ? (
                                <p className="text-[10px] font-mono text-white/20">No items tagged for diversion yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {divertedItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 border border-tactical-green/20">
                                           <div className="flex flex-col">
                                                <span className="font-display text-sm tracking-wider uppercase text-white">{item.name}</span>
                                                <span className="text-[8px] font-mono text-white/40">Est. Impact: ${item.tariffCredit.toFixed(2)} savings</span>
                                           </div>
                                           <button className="bg-tactical-green/10 text-tactical-green border border-tactical-green/50 text-[8px] px-3 py-1 font-mono uppercase hover:bg-tactical-green hover:text-black transition-colors">
                                               Route to Base Exchange
                                           </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                         </div>
                     </div>
                 )}

                 {/* METRICS / QC */}
                 {activeTab === 'METRICS' && (
                     <div className="animate-entry space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 p-5 relative">
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500/50" />
                                <div className="text-white/40 text-[9px] uppercase font-mono tracking-[0.2em] mb-3">Live QC Monitoring</div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-2">
                                        <span className="text-white/60">Pro-Gear Rules</span>
                                        <span className="text-tactical-green">PASSED</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-2">
                                        <span className="text-white/60">Hazmat Flags</span>
                                        <span className="text-tactical-green">NONE DETECTED</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-mono">
                                        <span className="text-white/60">Packing Protocol</span>
                                        <span className="text-yellow-500">PENDING_DAY_OF</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-5 relative">
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-yellow-500/50" />
                                <div className="text-white/40 text-[9px] uppercase font-mono tracking-[0.2em] mb-3">Claims Radar</div>
                                <div className="text-[10px] font-mono text-white/30 space-y-2 mt-4">
                                    <p>Origin Records Generated: {inventory.length}</p>
                                    <p>Destination Damage Scans: <span className="text-white">0</span></p>
                                    <button className="mt-4 border border-white/20 px-3 py-1 text-[8px] hover:bg-white/10 transition-colors w-full uppercase">Generate Draft Packet</button>
                                </div>
                            </div>
                        </div>
                     </div>
                 )}

                 {/* TELEMETRY */}
                 {activeTab === 'TELEMETRY' && (
                    <div className="animate-entry flex flex-col items-center justify-center p-12 border border-dashed border-white/10 bg-white/5">
                        <svg className="w-12 h-12 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <div className="text-[10px] font-display text-white/30 uppercase tracking-[0.4em] mb-2">Shipment Not Yet Dispatched</div>
                        <p className="text-[9px] font-mono text-white/20 max-w-sm text-center mt-2">
                           GPS, Waypoint, IoT Sensor, and Predictive ETA telemetry modules will activate upon origin custody transfer.
                        </p>
                    </div>
                 )}

             </div>

          </div>

          {/* Right Column: Mission Feed / Sidebar */}
          <div className="space-y-6 hidden lg:block">
            <div className="bg-white/5 border border-white/10 p-6 h-[500px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-tactical-green/5 rounded-bl-full pointer-events-none" />
              <div className="text-[10px] font-display text-white/30 uppercase tracking-[0.4em] mb-6 border-b border-white/10 pb-4">Agent Feed</div>
              <div className="flex-grow space-y-4 font-mono text-[9px] overflow-y-auto pr-2">
                <div className="text-tactical-green">[{new Date().toLocaleTimeString()}] MOVE_OS ONLINE</div>
                <div className="text-white/40">[{new Date().toLocaleTimeString()}] SMART CONTRACT READY</div>
                <div className="text-tactical-blue">[{new Date().toLocaleTimeString()}] CIRCULAR ENGINE INIT</div>
                {inventory.length > 0 && (
                  <div className="text-white/60 border-l border-white/20 pl-2">
                      Last Asset Logged: {inventory[inventory.length-1].name} <br/>
                      Validation: AI_OBSERVED
                  </div>
                )}
                <div className="text-white/20 animate-pulse mt-4">_ AWAITING LOGISTICS INPUT</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

