import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Home, Mail, Phone, Lock, Sparkles, Check, AlertCircle, X, ArrowRight, Shield } from 'lucide-react';
import { ShopOwner } from './LoginModal';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpSuccess: (ownerData: ShopOwner) => void;
}

const PLANS = [
  {
    id: 'Standard',
    name: 'Standard',
    desc: 'Basic loan tracking & ledger operations.',
    price: '₹1,499/mo',
    badge: 'Starter'
  },
  {
    id: 'Sovereign Pro',
    name: 'Sovereign Pro',
    desc: 'Advanced LTV triggers, analytics & custom SMS.',
    price: '₹2,999/mo',
    badge: 'Popular'
  },
  {
    id: 'Premium Enterprise',
    name: 'Premium Enterprise',
    desc: 'Multi-branch sync, premium backing & API access.',
    price: '₹4,999/mo',
    badge: 'Full Suite'
  }
];

export default function SignUpModal({ isOpen, onClose, onSignUpSuccess }: SignUpModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'Standard' | 'Premium Enterprise' | 'Sovereign Pro'>('Sovereign Pro');
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  if (!isOpen) return null;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const getShopOwners = (): ShopOwner[] => {
    const stored = localStorage.getItem('suvarna_shop_owners');
    if (!stored) {
      // Import the default list if empty
      const defaultOwners: ShopOwner[] = [
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
      localStorage.setItem('suvarna_shop_owners', JSON.stringify(defaultOwners));
      return defaultOwners;
    }
    return JSON.parse(stored);
  };

  const validateStep1 = () => {
    if (!ownerName.trim()) return 'Please enter your Full Name.';
    if (!shopName.trim()) return 'Please enter your Jewellery Shop Name.';
    if (!email.trim() || !email.includes('@')) return 'Please enter a valid Email Address.';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) return 'Please enter a valid 10-digit Phone Number.';
    return null;
  };

  const handleNextStep = () => {
    setError('');
    const step1Error = validateStep1();
    if (step1Error) {
      setError(step1Error);
      triggerShake();
      return;
    }

    // Check duplicate email or shop name
    const owners = getShopOwners();
    const duplicateEmail = owners.some(o => o.email.toLowerCase() === email.trim().toLowerCase());
    const duplicateShop = owners.some(o => o.shopName.toLowerCase() === shopName.trim().toLowerCase());

    if (duplicateEmail) {
      setError('A shop owner is already registered with this email address.');
      triggerShake();
      return;
    }

    if (duplicateShop) {
      setError('A jewelry shop is already registered with this name.');
      triggerShake();
      return;
    }

    setStep(2);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 4 || isNaN(Number(pin))) {
      setError('Please set a secure 4-digit security PIN.');
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      triggerShake();
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const owners = getShopOwners();
        
        // Double check pin unique
        if (owners.some(o => o.pin === pin)) {
          setError('This 4-digit PIN is already chosen. Please select a different PIN.');
          triggerShake();
          setIsSubmitting(false);
          return;
        }

        const date = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

        const newOwner: ShopOwner = {
          id: `owner-${Date.now()}`,
          ownerName: ownerName.trim(),
          shopName: shopName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          pin,
          password,
          plan: selectedPlan,
          status: 'Active',
          dateJoined: formattedDate,
          loansCount: 0,
          totalPledgedGold: '0.0 gm',
          outstandingAmount: 0
        };

        const updatedOwners = [...owners, newOwner];
        localStorage.setItem('suvarna_shop_owners', JSON.stringify(updatedOwners));

        onSignUpSuccess(newOwner);
        onClose();
        
        // Reset states
        setStep(1);
        setOwnerName('');
        setShopName('');
        setEmail('');
        setPhone('');
        setPin('');
        setPassword('');
        setSelectedPlan('Sovereign Pro');
      } catch (err) {
        setError('Failed to create account. Please try again.');
        triggerShake();
      } finally {
        setIsSubmitting(false);
      }
    }, 1200);
  };

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
          className="bg-white rounded-3xl max-w-lg w-full p-6 relative z-10 shadow-2xl border border-slate-200 text-left overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Secure Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5 shrink-0">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0A1A36] uppercase tracking-wide font-sans">Register Jewelry Business</h3>
              <p className="text-[10px] text-slate-400">Launch Your Suvarna ERP Active Instance</p>
            </div>
          </div>

          {/* Step Progress indicators */}
          <div className="flex items-center gap-2 mb-5 shrink-0 px-1">
            <div className="flex-1 flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 1 ? 'bg-[#0A1A36] text-white' : 'bg-emerald-500 text-white'
              }`}>
                {step === 1 ? '1' : <Check className="w-3 h-3 stroke-[2.5]" />}
              </span>
              <span className={`text-[10px] font-bold ${step === 1 ? 'text-[#0A1A36]' : 'text-slate-400'}`}>Business Profile</span>
            </div>
            <div className="w-8 h-px bg-slate-200" />
            <div className="flex-1 flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 2 ? 'bg-[#0A1A36] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                2
              </span>
              <span className={`text-[10px] font-bold ${step === 2 ? 'text-[#0A1A36]' : 'text-slate-400'}`}>Credentials & Licensing</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2.5 text-[11px] shrink-0"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form Content - Scrollable if screen is very small */}
          <div className="overflow-y-auto flex-1 pr-1 -mr-1 py-1">
            {step === 1 ? (
              /* STEP 1: BUSINESS PROFILE */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Shop Owner Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g. Rajesh Verma"
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A1A36] outline-none rounded-xl text-xs text-[#0A1A36] font-bold transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Jewelry Shop Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Home className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="e.g. Suvarna Gold Loan"
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A1A36] outline-none rounded-xl text-xs text-[#0A1A36] font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. owner@jewelstore.com"
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A1A36] outline-none rounded-xl text-xs text-[#0A1A36] font-bold transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Contact Number (Phone)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A1A36] outline-none rounded-xl text-xs text-[#0A1A36] font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-5 py-2.5 bg-[#0A1A36] hover:bg-[#1B2B4C] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Configure Access</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 2: CREDENTIALS & PLANS */
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">4-Digit Access PIN</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Shield className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 2468"
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A1A36] outline-none rounded-xl text-xs text-center tracking-widest text-[#0A1A36] font-black transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Web Portal Password</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A1A36] outline-none rounded-xl text-xs text-[#0A1A36] font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Plan Selection */}
                <div className="space-y-2 pt-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Select Business Licensing Tier</label>
                  <div className="grid grid-cols-1 gap-2">
                    {PLANS.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id as any)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          selectedPlan === p.id 
                            ? 'bg-[#0A1A36]/5 border-[#0A1A36] shadow-sm' 
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                            selectedPlan === p.id ? 'border-[#0A1A36] bg-[#0A1A36]' : 'border-slate-300'
                          }`}>
                            {selectedPlan === p.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-[#0A1A36]">{p.name}</p>
                              <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                                {p.badge}
                              </span>
                            </div>
                            <p className="text-[9.5px] text-slate-500 mt-0.5 leading-tight">{p.desc}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-[#0A1A36]">{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider px-2 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !pin || !password}
                    className="px-5 py-2.5 bg-[#0A1A36] hover:bg-[#1B2B4C] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Provisioning ERP...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <Check className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
