import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Shield, Eye, EyeOff, Check, AlertCircle, X, Terminal, ArrowRight } from 'lucide-react';

export interface ShopOwner {
  id: string;
  ownerName: string;
  shopName: string;
  email: string;
  phone: string;
  pin: string;
  password?: string;
  plan: 'Standard' | 'Premium Enterprise' | 'Sovereign Pro';
  status: 'Active' | 'Suspended';
  dateJoined: string;
  loansCount?: number;
  totalPledgedGold?: string;
  outstandingAmount?: number;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: 'superadmin' | 'owner', ownerData?: ShopOwner) => void;
  onToggleSignUp?: () => void;
}

const DEFAULT_SHOP_OWNERS: ShopOwner[] = [
  {
    id: 'owner-1',
    ownerName: 'Rajesh Verma',
    shopName: 'Suvarna Gold Loan & Jewellery Co.',
    email: 'rajesh@suvarnaloan.com',
    phone: '+91 70585 36371',
    pin: '1234',
    password: 'owner123',
    plan: 'Sovereign Pro',
    status: 'Active',
    dateJoined: '12 Jan 2026',
    loansCount: 12,
    totalPledgedGold: '284.5 gm',
    outstandingAmount: 1450000
  },
  {
    id: 'owner-2',
    ownerName: 'Priya Sharma',
    shopName: 'Sharma Bullion & Gold Loans',
    email: 'priya@sharmabullion.com',
    phone: '+91 98765 43210',
    pin: '5678',
    password: 'priya123',
    plan: 'Standard',
    status: 'Active',
    dateJoined: '04 Mar 2026',
    loansCount: 4,
    totalPledgedGold: '92.3 gm',
    outstandingAmount: 480000
  }
];

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onToggleSignUp }: LoginModalProps) {
  const [loginMethod, setLoginMethod] = useState<'pin' | 'password'>('pin');
  const [pin, setPin] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  // Get active list from local storage
  const getShopOwners = (): ShopOwner[] => {
    const stored = localStorage.getItem('suvarna_shop_owners');
    if (!stored) {
      localStorage.setItem('suvarna_shop_owners', JSON.stringify(DEFAULT_SHOP_OWNERS));
      return DEFAULT_SHOP_OWNERS;
    }
    return JSON.parse(stored);
  };

  const handlePinClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const owners = getShopOwners();

    // Simulate API authorization delay
    setTimeout(() => {
      if (loginMethod === 'pin') {
        // Super Admin PIN check
        if (pin === '9999') {
          onLoginSuccess('superadmin');
          onClose();
          setPin('');
        } else {
          // Check regular shop owners
          const matchedOwner = owners.find(o => o.pin === pin);
          if (matchedOwner) {
            if (matchedOwner.status === 'Suspended') {
              setError('This Shop Owner account has been suspended by Super Admin.');
              triggerShake();
              setPin('');
            } else {
              onLoginSuccess('owner', matchedOwner);
              onClose();
              setPin('');
            }
          } else {
            setError('Invalid Security PIN. Please try again.');
            triggerShake();
            setPin('');
          }
        }
      } else {
        const inputUser = username.trim().toLowerCase();
        // Super Admin credentials
        if (inputUser === 'superadmin' && password === 'superadmin123') {
          onLoginSuccess('superadmin');
          onClose();
          setPassword('');
        } else {
          // Check shop owners credentials
          const matchedOwner = owners.find(o => 
            (o.email.toLowerCase() === inputUser || o.ownerName.toLowerCase() === inputUser) && 
            o.password === password
          );

          if (matchedOwner) {
            if (matchedOwner.status === 'Suspended') {
              setError('This Shop Owner account has been suspended by Super Admin.');
              triggerShake();
            } else {
              onLoginSuccess('owner', matchedOwner);
              onClose();
              setPassword('');
            }
          } else {
            setError('Incorrect Username/Email or Password.');
            triggerShake();
          }
        }
      }
      setIsSubmitting(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0A1A36]/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{ x: shake ? [0, -10, 10, -10, 10, 0] : 0 }}
          transition={shake ? { duration: 0.5 } : { type: "spring", duration: 0.5 }}
          className="bg-white rounded-3xl max-w-md w-full p-6 relative z-10 shadow-2xl border border-slate-200 text-left overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Secure Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shrink-0">
              <Lock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0A1A36] uppercase tracking-wide font-sans">Multi-Tenant Gateway</h3>
              <p className="text-[10px] text-slate-400">Owner & Super Admin Session Authentication</p>
            </div>
          </div>

          {/* Toggle Login Method */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
            <button
              onClick={() => { setLoginMethod('pin'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                loginMethod === 'pin' ? 'bg-white text-[#0A1A36] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Secure PIN Entry
            </button>
            <button
              onClick={() => { setLoginMethod('password'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                loginMethod === 'password' ? 'bg-white text-[#0A1A36] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Password Credentials
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2.5 text-[11px]"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* PIN METHOD UI */}
          {loginMethod === 'pin' ? (
            <div className="space-y-5">
              <div className="space-y-1.5 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enter 4-Digit Passcode</span>
                
                {/* Dots indicator */}
                <div className="flex justify-center gap-3.5 py-2.5">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${
                        idx < pin.length
                          ? 'bg-[#0A1A36] border-[#0A1A36] scale-110 shadow-xs'
                          : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Pad Grid */}
              <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePinClick(num)}
                    disabled={isSubmitting || pin.length >= 4}
                    className="h-12 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 active:scale-95 font-black text-sm text-[#0A1A36] transition-all disabled:opacity-50"
                  >
                    {num}
                  </button>
                ))}
                
                {/* Clear */}
                <button
                  type="button"
                  onClick={handlePinDelete}
                  disabled={isSubmitting || pin.length === 0}
                  className="h-12 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-100 border border-transparent active:scale-95 transition-all"
                >
                  Delete
                </button>

                {/* 0 */}
                <button
                  type="button"
                  onClick={() => handlePinClick('0')}
                  disabled={isSubmitting || pin.length >= 4}
                  className="h-12 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 active:scale-95 font-black text-sm text-[#0A1A36] transition-all disabled:opacity-50"
                >
                  0
                </button>

                {/* Submit PIN */}
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting || pin.length < 4}
                  className="h-12 rounded-xl bg-[#0A1A36] hover:bg-[#1B2B4C] text-amber-400 active:scale-95 flex items-center justify-center transition-all disabled:opacity-40"
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Tech Spec Helper */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-[9.5px] text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 font-bold">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    Demo Owner PIN: <code className="bg-slate-100 text-[#0A1A36] font-black px-1.5 py-0.5 rounded">1234</code>
                  </span>
                  <span className="font-bold">
                    Super Admin PIN: <code className="bg-slate-100 text-[#0A1A36] font-black px-1.5 py-0.5 rounded">9999</code>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* PASSWORD METHOD UI */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Username / Email</label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. rajesh@suvarnaloan.com or superadmin"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A1A36] outline-none rounded-xl text-xs text-[#0A1A36] font-bold transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isSubmitting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A1A36] outline-none rounded-xl text-xs text-[#0A1A36] font-bold transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !username || !password}
                className="w-full py-3 mt-2 bg-[#0A1A36] text-white hover:bg-[#1B2B4C] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Validating Session...</span>
                  </span>
                ) : (
                  <>
                    <span>Authenticate Account</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </>
                )}
              </button>

              {/* Demo Password Hint */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-[9.5px] text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Owner: <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono">rajesh@suvarnaloan.com</code> / <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono">owner123</code></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Super Admin: <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono">superadmin</code> / <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono">superadmin123</code></span>
                </div>
              </div>
            </form>
          )}

          {onToggleSignUp && (
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onToggleSignUp}
                className="text-[11px] font-bold text-slate-500 hover:text-[#0A1A36] transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                Don't have an account? <span className="text-amber-600 hover:text-amber-700 underline">Register your business</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

