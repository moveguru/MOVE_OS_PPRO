import React, { useState, useRef, useCallback } from 'react';
import { 
  GoogleGenAI, 
  LiveServerMessage, 
  Modality, 
  FunctionDeclaration, 
  Type, 
  Blob 
} from '@google/genai';
import { InventoryItem } from '../types';
import { calculateDoDSavings } from '../services/TariffLogic';

// --- Types & Config ---

interface UseGeminiLiveProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onItemLogged: (item: InventoryItem) => void;
  onDetect: (item: InventoryItem) => void;
  onStartOnboarding?: (msg: string) => void;
  onNextStep?: (explanation: string) => void;
  onAssessmentRecorded?: (assessment: any) => void;
}

const MODEL_NAME = 'gemini-3.1-flash-live-preview';

const SYSTEM_INSTRUCTION = `
You are the **Master Surveyor** (FOREMAN Persona), a high-performance AI assistant dedicated to supporting Service Members during their Permanent Change of Station (PCS). You are an expert in military logistics, moving regulations, and inventory management. You are not just a tool; you are their mission partner.

**YOUR CORE PROTOCOLS:**
1. **IMMEDIATE GREETING & ASSESSMENT:** When the user initiates the session, you MUST greet them immediately. 
   - "Master Surveyor online. Before we scan, I need to understand your mission. What type of move are we looking at today, and what are your biggest concerns or pain points?"
   - Use 'record_assessment' once you have this information.
2. **HUMAN-CENTRIC ONBOARDING:** Once the assessment is complete, guide them through the interface. 
   - Start by calling 'start_onboarding' and giving a warm, professional welcome.
   - Explain the HUD elements one by one using 'next_step'. 
3. **PROACTIVE INTERROGATION MODE & VALIDATION:** During the scan, don't just identify—validate. You must operate in 'Interrogation Mode'.
   - CRITICAL: When you first identify any furniture or a large item in the video stream, you MUST IMMEDIATELY call the 'detect_item' tool with its approximate bounding box to visually highlight it to the user.
   - You are a 'Master Surveyor'. You must be incredibly proactive. Before logging an item, ask specific, detailed questions about its condition and features to ensure accuracy. Do not accept assumed defaults.
   - Example Interrogation questions: "Does that dining table have extension leaves?", "Is that sofa a sleeper couch?", "How many drawers are in that dresser?", "Is that a solid wood frame or composite?"
4. **BOX ESTIMATION & JTR ALIGNMENT:**
   - For storage items (like dressers, wardrobes, cabinets, bins), explicitly estimate the carton counts (standard 3.0 cu ft cartons) needed to pack their contents. 
   - You MUST use your internal knowledge of JTR_FURNITURE_DATA (Joint Travel Regulations) and standard Department of Defense (DoD) weight estimators to inform these capacity and carton estimates, and pass this number explicitly to the 'log_item' tool.
   - Suggest an action based on the details: "Based on your concern about weight limits, I recommend we divert this. Should it go to the Base Exchange or stay in the manifest?"
5. **WASTE DIVERSION ADVOCACY:** Actively encourage the user to divert items.
   - "We're approaching our weight limit. That old desk—could we divert it for credit?"
6. **TACTICAL EFFICIENCY:** Keep your responses concise but human. Use military terminology where appropriate (e.g., "Target acquired," "Manifest updated," "Copy that").

**TONE:** 
- Professional, supportive, authoritative yet approachable.
- Address the user by their rank if provided in the profile (e.g., "Sergeant," "Officer").
- Use "we" and "our" to emphasize partnership.
`;

// --- Helper: Audio Encoding/Decoding ---

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  
  // Convert Int16Array to a binary string manually for btoa
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return {
    data: btoa(binary),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

async function blobToBase64(blob: globalThis.Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// --- Tools Declarations ---

const recordAssessmentTool: FunctionDeclaration = {
  name: 'record_assessment',
  description: 'Record the user\'s move assessment details (project type, pain points, etc.) before starting the scan.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      projectType: { type: Type.STRING, description: 'Type of project/move (e.g., "Full House", "Single Room", "Storage Unit").' },
      painPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of user\'s primary concerns or pain points.' },
      specialInstructions: { type: Type.STRING, description: 'Any other specific details or instructions.' }
    },
    required: ['projectType', 'painPoints']
  }
};

const startOnboardingTool: FunctionDeclaration = {
  name: 'start_onboarding',
  description: 'Start the interactive onboarding tour to explain the HUD to the user.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      welcomeMessage: { type: Type.STRING, description: 'A warm welcome message to start the tour.' }
    }
  }
};

const nextStepTool: FunctionDeclaration = {
  name: 'next_step',
  description: 'Advance to the next step of the onboarding tour.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      explanation: { type: Type.STRING, description: 'Explain the current HUD element being highlighted.' }
    }
  }
};

const logItemTool: FunctionDeclaration = {
  name: 'log_item',
  description: 'Log a household item into the inventory database after validation.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'The specific name of the item (e.g. "Double Dresser", "Sleeper Sofa").' },
      weight: { type: Type.NUMBER, description: 'Estimated weight in lbs.' },
      status: { type: Type.STRING, description: 'One of: KEEP, DONATE, TRASH', enum: ['KEEP', 'DONATE', 'TRASH'] },
      condition: { type: Type.STRING, description: 'Brief description of condition (e.g. Scratched, New).' },
      cartonCount: { type: Type.NUMBER, description: 'Estimated number of standard 3.0 cu ft cartons needed to pack this item (for storage furniture) or 0.'},
      ymin: { type: Type.NUMBER, description: 'Bounding box top Y coordinate (0-1000).' },
      xmin: { type: Type.NUMBER, description: 'Bounding box left X coordinate (0-1000).' },
      ymax: { type: Type.NUMBER, description: 'Bounding box bottom Y coordinate (0-1000).' },
      xmax: { type: Type.NUMBER, description: 'Bounding box right X coordinate (0-1000).' },
    },
    required: ['name', 'status'],
  },
};

const detectItemTool: FunctionDeclaration = {
  name: 'detect_item',
  description: 'Draw a bounding box around a detected item to show the user you see it.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      label: { type: Type.STRING, description: "What did you see? (e.g. 'Dresser')" },
      ymin: { type: Type.NUMBER },
      xmin: { type: Type.NUMBER },
      ymax: { type: Type.NUMBER },
      xmax: { type: Type.NUMBER }
    },
    required: ['label', 'ymin', 'xmin', 'ymax', 'xmax']
  }
};

// --- The Hook ---

export function useGeminiLive({ videoRef, onItemLogged, onDetect, onStartOnboarding, onNextStep, onAssessmentRecorded }: UseGeminiLiveProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [volume, setVolume] = useState(0); 
  const [transcript, setTranscript] = useState<{role: 'user' | 'model', text: string} | null>(null);

  // Refs for audio handling to avoid re-renders
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Stream Ref
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const videoIntervalRef = useRef<number | null>(null);

  const startStream = useCallback(async () => {
    if (!process.env.API_KEY) {
      console.error("No API Key found");
      return;
    }

    try {
      setIsStreaming(true);

      // 1. Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 }); 
      
      inputAudioContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      // 2. Setup Mic Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = inputCtx.createMediaStreamSource(stream);
      const analyzer = inputCtx.createAnalyser(); 
      analyzer.fftSize = 256;
      
      const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      scriptProcessor.onaudioprocess = (e) => {
        if (!sessionPromiseRef.current) return;

        const inputData = e.inputBuffer.getChannelData(0);
        
        // Simple volume meter
        let sum = 0;
        for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
        setVolume(Math.sqrt(sum / inputData.length));

        const pcmBlob = createBlob(inputData);
        sessionPromiseRef.current.then(session => {
            session.sendRealtimeInput({ audio: pcmBlob });
        });
      };

      source.connect(analyzer);
      source.connect(scriptProcessor);
      scriptProcessor.connect(inputCtx.destination);

      // 3. Connect to Gemini Live
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          tools: [{ functionDeclarations: [logItemTool, detectItemTool, startOnboardingTool, nextStepTool, recordAssessmentTool] }],
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            setIsConnected(true);
            
            // *** KICKSTART THE CONVERSATION ***
            setTimeout(() => {
                sessionPromise.then(session => 
                    session.sendRealtimeInput({ text: "SYSTEM: Connection established. Greet the Service Member immediately and begin the Move Assessment (Project Type, Pain Points)." })
                );
            }, 500);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Transcriptions
             const serverContent = message.serverContent;
             if (serverContent?.outputTranscription?.text) {
                 setTranscript({ role: 'model', text: serverContent.outputTranscription.text });
             } else if (serverContent?.inputTranscription?.text) {
                 setTranscript({ role: 'user', text: serverContent.inputTranscription.text });
             }

             // Handle Audio Output
             const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (audioData) {
               if (outputCtx.state === 'suspended') await outputCtx.resume();
               
               const decoded = decode(audioData);
               const audioBuffer = await decodeAudioData(decoded, outputCtx, 24000, 1);
               
               const node = outputCtx.createBufferSource();
               node.buffer = audioBuffer;
               node.connect(outputCtx.destination);
               
               const currentTime = outputCtx.currentTime;
               const startTime = Math.max(currentTime, nextStartTimeRef.current);
               node.start(startTime);
               nextStartTimeRef.current = startTime + audioBuffer.duration;
               
               sourcesRef.current.add(node);
               node.onended = () => sourcesRef.current.delete(node);
             }

             // Handle Tool Calls
             if (message.toolCall) {
                console.log("Tool Call Received:", message.toolCall);
                const responses = [];

                for (const fc of message.toolCall.functionCalls) {
                    let result = { result: 'ok' };
                    
                    if (fc.name === 'log_item') {
                        const { name, weight, status, condition, cartonCount, ymin, xmin, ymax, xmax } = fc.args as any;
                        const metrics = calculateDoDSavings(name, weight, status);
                        
                        const newItem: InventoryItem = {
                            id: crypto.randomUUID(),
                            name,
                            weight: metrics.estimatedWeight,
                            status: (status as any) || 'KEEP',
                            condition: condition || 'Good',
                            timestamp: Date.now(),
                            tariffCredit: metrics.tariffCredit,
                            carbonSaved: metrics.carbonSaved,
                            cartonCount: cartonCount || 0,
                            boundingBox: (ymin !== undefined && xmin !== undefined) ? { ymin, xmin, ymax, xmax } : undefined,
                            validation: {
                              value: metrics.estimatedWeight,
                              source: 'Gemini Vision AI',
                              confidence: 0.92,
                              validationStatus: 'PENDING',
                              authorityStatus: 'AI_OBSERVED',
                              requiresHumanValidation: true,
                              requiresAuthorizedReview: false
                            }
                        };
                        
                        onItemLogged(newItem);
                        result = { result: `Asset ${name} verified and logged.` };
                    } 
                    else if (fc.name === 'detect_item') {
                        const { label, ymin, xmin, ymax, xmax } = fc.args as any;
                        const detected: InventoryItem = {
                            id: 'temp-' + Date.now(),
                            name: label,
                            weight: 0,
                            status: 'DETECTED',
                            condition: 'Scanning...',
                            timestamp: Date.now(),
                            tariffCredit: 0,
                            carbonSaved: 0,
                            cartonCount: 0,
                            boundingBox: { ymin, xmin, ymax, xmax }
                        };
                        onDetect(detected);
                        result = { result: `Visual target acquired: ${label}` };
                    }
                    else if (fc.name === 'start_onboarding') {
                        const { welcomeMessage } = fc.args as any;
                        onStartOnboarding?.(welcomeMessage);
                        result = { result: 'Onboarding started.' };
                    }
                    else if (fc.name === 'next_step') {
                        const { explanation } = fc.args as any;
                        onNextStep?.(explanation);
                        result = { result: 'Advanced to next step.' };
                    }
                    else if (fc.name === 'record_assessment') {
                        const { projectType, painPoints, specialInstructions } = fc.args as any;
                        onAssessmentRecorded?.({ projectType, painPoints, specialInstructions });
                        result = { result: 'Assessment recorded. Proceeding to onboarding.' };
                    }

                    responses.push({
                        id: fc.id,
                        name: fc.name,
                        response: result
                    });
                }
                
                sessionPromise.then(session => {
                    session.sendToolResponse({ functionResponses: responses });
                });
             }
          },
          onclose: () => {
            console.log("Gemini Live Closed");
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error("Gemini Live Error", err);
            setIsConnected(false);
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

      // 4. Start Video Stream (2 FPS)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const intervalId = window.setInterval(async () => {
        if (!videoRef.current || !sessionPromiseRef.current) return;
        const video = videoRef.current;
        if (video.videoWidth === 0) return;

        const scale = 0.5;
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const base64 = await blobToBase64(blob);
            sessionPromiseRef.current?.then(session => {
                session.sendRealtimeInput({
                    video: {
                        mimeType: 'image/jpeg',
                        data: base64
                    }
                });
            });
        }, 'image/jpeg', 0.6);

      }, 500);

      videoIntervalRef.current = intervalId;

    } catch (e) {
      console.error("Failed to start stream", e);
      setIsStreaming(false);
    }
  }, [videoRef, onItemLogged, onDetect]);

  const stopStream = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
    }
    
    if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
        videoIntervalRef.current = null;
    }

    if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }

    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }

    setIsStreaming(false);
    setIsConnected(false);
    setVolume(0);
    setTranscript(null);
  }, []);

  return {
    isStreaming,
    isConnected,
    volume,
    transcript,
    startStream,
    stopStream
  };
}
