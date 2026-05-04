import React, { useEffect, useRef, useState } from 'react';
import { InventoryItem, WasteMetrics, UserProfile } from './types';
import { useGeminiLive } from './hooks/useGeminiLive';
import { InventoryOverlay } from './components/InventoryOverlay';
import { IntroScreen } from './components/IntroScreen';
import { OnboardingTour } from './components/OnboardingTour';
import { Dashboard } from './components/Dashboard';
import { LiveAgentHUD } from './components/LiveAgentHUD';

type ViewState = 'INTRO' | 'DASHBOARD' | 'BRIEF' | 'SCANNER';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // App View State
  const [view, setView] = useState<ViewState>('INTRO');
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourExplanation, setTourExplanation] = useState('');

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
      rank: 'E-1',
      moveType: 'PCS',
      weightAllowance: 4000
  });

  // Persistent State
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('moveguru_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  // Ephemeral State for Visual Targeting
  const [detectedItem, setDetectedItem] = useState<InventoryItem | null>(null);
  
  // Save on Change
  useEffect(() => {
    localStorage.setItem('moveguru_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Derived Metrics
  const metrics: WasteMetrics = {
    totalWeight: inventory.reduce((acc, item) => acc + item.weight, 0),
    totalCarbonSaved: inventory.reduce((acc, item) => acc + item.carbonSaved, 0),
    totalTariffCredit: inventory.reduce((acc, item) => acc + item.tariffCredit, 0),
    inventoryCount: inventory.length,
    divertedWeight: inventory.reduce((acc, item) => item.status !== 'KEEP' ? acc + item.weight : acc, 0)
  };

  const handleLogin = (profile: UserProfile) => {
      setUserProfile(profile);
      setView('DASHBOARD');
      const hideTour = localStorage.getItem('moveguru_hide_tour') === 'true';
      if (!hideTour) {
          setShowTour(true);
      }
  };

  const handleItemLogged = (item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
  };
  
  const handleItemDetected = (item: InventoryItem) => {
    setDetectedItem(item);
  };

  const { isStreaming, isConnected, volume, transcript, startStream, stopStream } = useGeminiLive({
    videoRef,
    onItemLogged: handleItemLogged,
    onDetect: handleItemDetected,
    onStartOnboarding: (msg) => {
      setShowTour(true);
      setTourStep(0);
      setTourExplanation(msg);
    },
    onNextStep: (explanation) => {
      setTourStep(prev => prev + 1);
      setTourExplanation(explanation);
    },
    onAssessmentRecorded: (assessment) => {
      setUserProfile(prev => ({ ...prev, assessment }));
      console.log("Assessment Recorded:", assessment);
    }
  });

  // Setup Video Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      if (view === 'SCANNER' && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Camera access denied", err);
        }
      }
    }

    if (view === 'SCANNER') {
      setupCamera();
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }

    return () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
        }
    };
  }, [view]);

  // Handlers
  const toggleStream = () => {
    if (isStreaming) {
      stopStream();
    } else {
      startStream();
    }
  };

  const exitScanner = () => {
    stopStream();
    setView('DASHBOARD');
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans">
      
      {view === 'INTRO' && (
        <IntroScreen onLogin={handleLogin} />
      )}

      {view === 'DASHBOARD' && (
        <>
          <Dashboard 
            inventory={inventory}
            badges={[]} // Badges deprecated in Pro mode
            metrics={metrics}
            onDeploy={() => setView('BRIEF')}
            onLogout={() => setView('INTRO')}
          />
          {showTour && (
              <OnboardingTour 
                onClose={() => setShowTour(false)} 
              />
          )}
        </>
      )}

      {view === 'BRIEF' && (
        <div className="absolute inset-0 z-50 flex flex-col h-full bg-slate-900 text-white p-6 items-center justify-center font-mono">
            <div className="max-w-md w-full space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                    <h2 className="text-2xl font-bold uppercase">Mission Briefing</h2>
                    <p className="text-green-400 text-sm">DoD Instruction 4715.23 Compliance</p>
                </div>
                
                <div className="bg-slate-800 p-4 rounded text-sm space-y-3">
                    <p><strong>1. SCAN:</strong> Walk through each room. The Officer will identify items.</p>
                    <p><strong>2. VERIFY:</strong> Confirm contents (e.g., "Full Dresser") for accurate box counts.</p>
                    <p><strong>3. DIVERT:</strong> Identify heavy items for Base Exchange credit.</p>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                      onClick={() => setView('SCANNER')}
                      className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded uppercase transition-colors"
                  >
                      Start Inventory Scan
                  </button>
                  <button 
                    onClick={() => setView('DASHBOARD')}
                    className="w-full py-2 hover:bg-white/5 text-white/50 text-sm font-bold rounded uppercase transition-colors"
                  >
                    Return to Dashboard
                  </button>
                </div>
            </div>
        </div>
      )}

      {view === 'SCANNER' && (
        <>
            {/* 1. Camera View */}
            <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />

            {/* 2. Live Agent HUD */}
            <LiveAgentHUD 
              volume={volume}
              isConnected={isConnected}
              isStreaming={isStreaming}
              transcript={transcript}
            />

            {/* 3. Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />
            
            {/* 3. Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

            {/* 4. UI Layer */}
            <InventoryOverlay 
                items={inventory}
                detectedItem={detectedItem}
                metrics={metrics}
                userProfile={userProfile}
                isStreaming={isStreaming}
                isConnected={isConnected}
                volume={volume}
                transcript={transcript}
                onToggleStream={toggleStream}
                onExit={exitScanner}
            />
        </>
      )}
    </div>
  );
}
