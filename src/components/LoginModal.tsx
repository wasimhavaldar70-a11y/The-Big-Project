import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Eye, EyeOff, AlertCircle, X, ArrowRight } from 'lucide-react';

export interface ShopOwner {
  id: string;
  ownerName: string;
  shopName: string;
  email: string;
  phone: string;
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
}

const DEFAULT_SHOP_OWNERS: ShopOwner[] = [];

import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
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

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let owners: ShopOwner[] = [];
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error: dbError } = await supabase.from('shop_owners').select('*');
          if (!dbError && data && data.length > 0) {
            owners = data.map((o: any) => ({
              id: o.id,
              ownerName: o.owner_name,
              shopName: o.shop_name,
              email: o.email,
              phone: o.phone,
              password: o.password || undefined,
              plan: o.plan,
              status: o.status,
              dateJoined: o.date_joined,
              loansCount: o.loans_count || 0,
              totalPledgedGold: o.total_pledged_gold || '0 gm',
              outstandingAmount: o.outstanding_amount || 0,
            }));
          } else {
            // Seed the empty database table with defaults
            const defaultMapped = DEFAULT_SHOP_OWNERS.map(o => ({
              id: o.id,
              owner_name: o.ownerName,
              shop_name: o.shopName,
              email: o.email,
              phone: o.phone,
              password: o.password,
              plan: o.plan,
              status: o.status,
              date_joined: o.dateJoined,
              loans_count: o.loansCount || 0,
              total_pledged_gold: o.totalPledgedGold || '0 gm',
              outstanding_amount: o.outstandingAmount || 0,
            }));
            await supabase.from('shop_owners').insert(defaultMapped);
            owners = DEFAULT_SHOP_OWNERS;
          }
        } catch (dbErr) {
          console.error("Supabase load failed, falling back to local storage:", dbErr);
          owners = getShopOwners();
        }
      } else {
        owners = getShopOwners();
      }
    } else {
      owners = getShopOwners();
    }

    // Simulate API authorization delay for authentic feel
    setTimeout(() => {
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
      setIsSubmitting(false);
    }, 600);
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

          {/* Title */}
          <div className="mb-5">
            <h3 className="text-base font-black text-[#0A1A36] uppercase tracking-wide font-sans">Authorized Access</h3>
            <p className="text-[10px] text-slate-400">Please enter your credentials to authenticate</p>
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

          {/* PASSWORD METHOD UI */}
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
