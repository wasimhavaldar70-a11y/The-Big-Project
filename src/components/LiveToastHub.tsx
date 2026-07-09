import { useState, useEffect, useRef } from 'react';
import { 
  Bell, BellOff, Volume2, VolumeX, Sparkles, X, 
  ShieldCheck, Landmark, Key, Users, CheckCircle, 
  HelpCircle, AlertTriangle, Play, Settings2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Define Toast Structure
export interface Toast {
  id: string;
  title: string;
  description: string;
  type: 'security' | 'financial' | 'auth' | 'vault' | 'system';
  timestamp: string;
}

// Preset types
export type SoundPreset = 'suvarna_chime' | 'digital_bell' | 'ambient_bloom' | 'soft_click';

export default function LiveToastHub() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.4);
  const [selectedPreset, setSelectedPreset] = useState<SoundPreset>('suvarna_chime');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);

  // AudioContext reference
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Function to initialize AudioContext lazily on user interaction
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      // @ts-ignore - Support older safari
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    return audioCtxRef.current;
  };

  // Dynamic Web Audio Synth sound generator
  const playSynthesizedSound = (preset: SoundPreset = selectedPreset) => {
    if (!soundEnabled || muted) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);

      if (preset === 'suvarna_chime') {
        // A luxurious rich gold bell sound (harmonic blend)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1046.50, now); // C6 (clean bell frequency)
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1318.51, now); // E6 (harmonic major third)

        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(1567.98, now); // G6 (harmonic perfect fifth)

        // Envelope decay
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc3.connect(gainNode);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        osc1.stop(now + 1.2);
        osc2.stop(now + 1.2);
        osc3.stop(now + 1.2);

      } else if (preset === 'digital_bell') {
        // High-pitched crystal clear digital chime
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now); // A6 (high crystal chime)
        
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.6);

      } else if (preset === 'ambient_bloom') {
        // Soft cinematic rising sweep
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, now); // E4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.5); // Sweeps up to A5

        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.8);

      } else if (preset === 'soft_click') {
        // Tactile organic wooden pop
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      console.warn('AudioContext not supported or gesture needed: ', e);
    }
  };

  // Programmatic function to add a Toast
  const addToast = (title: string, description: string, type: Toast['type']) => {
    const newToast: Toast = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setToasts(prev => [newToast, ...prev].slice(0, 4)); // Maintain maximum 4 concurrent toasts
    playSynthesizedSound();
  };

  // Expose toast triggering dynamically via standard window custom events
  useEffect(() => {
    const handleTriggerToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; description: string; type: Toast['type'] }>;
      if (customEvent.detail) {
        addToast(customEvent.detail.title, customEvent.detail.description, customEvent.detail.type);
      }
    };

    window.addEventListener('triggerSuvarnaToast', handleTriggerToast);
    return () => {
      window.removeEventListener('triggerSuvarnaToast', handleTriggerToast);
    };
  }, [soundEnabled, volume, selectedPreset, muted]);

  // Periodic random background simulated events to showcase the Live Toast Engine
  useEffect(() => {
    const events: Omit<Toast, 'id' | 'timestamp'>[] = [
      {
        title: '🔒 Secure Packet Sealed',
        description: 'Gold Packet SV-4092 securely sealed and logged in Vault Lock B2.',
        type: 'vault'
      },
      {
        title: '💰 Principal Interest Accrued',
        description: 'Auto-ledger posted ₹12,450 interest accruals under Sovereign low-rate compliance.',
        type: 'financial'
      },
      {
        title: '🔑 Multi-Factor Key Rotated',
        description: 'Vault gatekeeper rotative encryption keys updated successfully.',
        type: 'security'
      },
      {
        title: '📈 Gold Market Pulse Update',
        description: 'Live 22K spot gold rates gained +0.45% in domestic market ticker.',
        type: 'system'
      },
      {
        title: '👤 New Appraisal Issued',
        description: 'Customer Ramesh S. received digital gold weight cert for 52.5g (22K).',
        type: 'auth'
      }
    ];

    const interval = setInterval(() => {
      // Pick a random event
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      addToast(randomEvent.title, randomEvent.description, randomEvent.type);
    }, 45000); // Trigger a demo toast every 45 seconds

    // Add an initial toast after 5 seconds to greet the user
    const firstTimeout = setTimeout(() => {
      addToast(
        '🔔 Live Toast Hub Active',
        'Pristine Web Audio API chimes and live activity tickers are fully operational!',
        'system'
      );
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(firstTimeout);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Get icon based on notification type
  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'security':
        return <Key className="w-4 h-4 text-rose-500" />;
      case 'financial':
        return <Landmark className="w-4 h-4 text-emerald-500" />;
      case 'vault':
        return <ShieldCheck className="w-4 h-4 text-amber-500" />;
      case 'auth':
        return <Users className="w-4 h-4 text-sky-500" />;
      case 'system':
      default:
        return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  // Get border-left color depending on type
  const getTypeBorderColor = (type: Toast['type']) => {
    switch (type) {
      case 'security':
        return 'border-l-rose-500';
      case 'financial':
        return 'border-l-emerald-500';
      case 'vault':
        return 'border-l-[#DF9F28]';
      case 'auth':
        return 'border-l-sky-500';
      case 'system':
      default:
        return 'border-l-purple-500';
    }
  };

  return (
    <>
      {/* Floating Toggle Controls Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-3.5 bg-[#0A1A36] text-white border border-[#DF9F28]/30 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:border-[#DF9F28] transition-all relative"
            id="toast-control-trigger"
          >
            {soundEnabled && !muted ? (
              <Bell className="w-5 h-5 text-amber-400 animate-pulse" />
            ) : (
              <BellOff className="w-5 h-5 text-slate-400" />
            )}
            
            {toasts.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white">
                {toasts.length}
              </span>
            )}
            <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Sound & Alert Hub</span>
          </motion.button>
        </div>

        {/* Configuration Floating Panel */}
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="absolute bottom-16 left-0 w-80 bg-white border border-slate-200 text-slate-800 rounded-2xl p-4 shadow-2xl space-y-4 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-[#D28F1B]" />
                  <span className="text-xs font-black text-[#0A1A36] uppercase tracking-wider">Acoustic & Alert Suite</span>
                </div>
                <button 
                  onClick={() => setIsPanelOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sound toggle switches */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-extrabold text-slate-700 block">Audible Sound Alerts</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Synthesize chimes on live activities</span>
                  </div>
                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      // Trigger a soft sound if turning on
                      if (!soundEnabled) {
                        setTimeout(() => playSynthesizedSound('soft_click'), 50);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                      soundEnabled 
                        ? 'bg-[#DF9F28] border-amber-500 text-[#0A1A36]' 
                        : 'bg-slate-150 border-slate-250 text-slate-500'
                    }`}
                  >
                    {soundEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                {soundEnabled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {/* Volume Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                        <span>Chime Volume</span>
                        <span>{Math.round(volume * 100)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setMuted(!muted)}
                          className="text-slate-500 hover:text-[#0A1A36] transition-colors"
                        >
                          {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={muted ? 0 : volume}
                          onChange={(e) => {
                            setVolume(Number(e.target.value));
                            if (muted) setMuted(false);
                          }}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </div>

                    {/* Sound Preset Picker */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Sound Preset</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: 'suvarna_chime', label: 'Suvarna Bowl' },
                          { id: 'digital_bell', label: 'Crystal Bell' },
                          { id: 'ambient_bloom', label: 'Ambient Bloom' },
                          { id: 'soft_click', label: 'Natural Pop' }
                        ].map((pr) => (
                          <button
                            key={pr.id}
                            onClick={() => {
                              setSelectedPreset(pr.id as SoundPreset);
                              playSynthesizedSound(pr.id as SoundPreset);
                            }}
                            className={`py-2 px-2.5 rounded-xl border text-left transition-all ${
                              selectedPreset === pr.id
                                ? 'border-amber-500 bg-amber-50 text-[#0A1A36] font-bold'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold'
                            }`}
                          >
                            <span className="text-[10px] flex items-center justify-between">
                              {pr.label}
                              <Play className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Instant Trigger Test Button */}
                <button
                  onClick={() => {
                    const testEvents = [
                      { title: '🔒 Vault Audit Active', desc: 'Real-time gold packet scan completed with zero non-conformances.', type: 'vault' as const },
                      { title: '💰 Ledger Posted', desc: 'Accrued ₹4,500 interest collection recorded for Customer Alok.', type: 'financial' as const },
                      { title: '🔑 Guard Checkpoint Passed', desc: 'Security guards rotative audit successfully committed to cloud.', type: 'security' as const }
                    ];
                    const randomTest = testEvents[Math.floor(Math.random() * testEvents.length)];
                    addToast(randomTest.title, randomTest.desc, randomTest.type);
                  }}
                  className="w-full bg-[#0A1A36] text-white hover:bg-[#0A1A36]/90 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  Test Fire Event Alert
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-time Toast List Overlay (Bottom Right Side) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto bg-white/95 backdrop-blur-md text-slate-800 rounded-2xl shadow-xl border-l-4 ${getTypeBorderColor(
                toast.type
              )} border-y border-r border-slate-100 flex items-start gap-3 p-4 overflow-hidden relative`}
              style={{ boxShadow: '0 10px 30px -10px rgba(10, 26, 54, 0.15)' }}
            >
              {/* Icon */}
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                {getIcon(toast.type)}
              </div>

              {/* Text Context */}
              <div className="flex-1 text-left min-w-0 pr-4">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="text-xs font-black text-[#0A1A36] truncate">{toast.title}</h4>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">{toast.timestamp}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">{toast.description}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-3 right-3 p-0.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
