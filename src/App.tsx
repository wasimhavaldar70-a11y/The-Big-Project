import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, Phone, Play, Calendar, ChevronDown, Award, Users, 
  Scale, Database, Lock, Clock, FileText, BarChart2, CheckCircle2,
  ChevronRight, Info, Heart, ArrowRight, ArrowLeft, Sparkles, Building, Check, X,
  Calculator, UserCheck, CheckCircle, Zap
} from 'lucide-react';
import GoldLoanCalculator from './components/GoldLoanCalculator';
// import InteractiveDevicesMockup from './components/InteractiveDevicesMockup';
import BookDemoModal from './components/BookDemoModal';
import InteractiveChatSupport from './components/InteractiveChatSupport';
import Dashboard from './components/Dashboard';
import LoginModal, { ShopOwner } from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import LiveToastHub from './components/LiveToastHub';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import { FAQ_ITEMS } from './data';

export default function App() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  
  // Authentication & Session States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('suvarna_logged_in') === 'true';
  });
  const [userRole, setUserRole] = useState<'superadmin' | 'owner' | null>(() => {
    return localStorage.getItem('suvarna_user_role') as 'superadmin' | 'owner' | null;
  });
  const [currentOwner, setCurrentOwner] = useState<ShopOwner | null>(() => {
    const stored = localStorage.getItem('suvarna_current_owner');
    return stored ? JSON.parse(stored) : null;
  });
  const [isImpersonating, setIsImpersonating] = useState<boolean>(() => {
    return localStorage.getItem('suvarna_is_impersonating') === 'true';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  // Listen to custom event to open Book Demo Modal from subcomponents
  React.useEffect(() => {
    const handleOpenDemo = () => {
      setIsDemoModalOpen(true);
    };
    window.addEventListener('openBookDemoModal', handleOpenDemo);
    return () => {
      window.removeEventListener('openBookDemoModal', handleOpenDemo);
    };
  }, []);

  if (view === 'dashboard') {
    if (isLoggedIn) {
      if (userRole === 'superadmin') {
        return (
          <SuperAdminDashboard 
            onLogout={() => {
              setIsLoggedIn(false);
              localStorage.removeItem('suvarna_logged_in');
              setUserRole(null);
              localStorage.removeItem('suvarna_user_role');
              setCurrentOwner(null);
              localStorage.removeItem('suvarna_current_owner');
              setIsImpersonating(false);
              localStorage.removeItem('suvarna_is_impersonating');
              setView('landing');
            }}
            onImpersonateOwner={(owner) => {
              setCurrentOwner(owner);
              localStorage.setItem('suvarna_current_owner', JSON.stringify(owner));
              setUserRole('owner');
              localStorage.setItem('suvarna_user_role', 'owner');
              setIsImpersonating(true);
              localStorage.setItem('suvarna_is_impersonating', 'true');
              setView('dashboard');
            }}
          />
        );
      } else {
        return (
          <div className="flex flex-col min-h-screen bg-slate-900">
            {isImpersonating && (
              <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 text-white px-4 py-2 text-xs font-black flex items-center justify-between gap-4 shadow-xl relative z-50 shrink-0 font-sans border-b border-amber-600/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
                  <span className="tracking-wide uppercase text-[10px]">Super Admin Active Workspace: Viewing <strong>{currentOwner?.shopName}</strong> ({currentOwner?.ownerName})</span>
                </div>
                <button
                  onClick={() => {
                    setIsImpersonating(false);
                    localStorage.removeItem('suvarna_is_impersonating');
                    setUserRole('superadmin');
                    localStorage.setItem('suvarna_user_role', 'superadmin');
                    setCurrentOwner(null);
                    localStorage.removeItem('suvarna_current_owner');
                  }}
                  className="bg-white hover:bg-slate-100 text-slate-950 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Exit Portal Access
                </button>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <Dashboard 
                currentOwner={currentOwner}
                onBackToLanding={() => setView('landing')} 
                onLogout={() => {
                  setIsLoggedIn(false);
                  localStorage.removeItem('suvarna_logged_in');
                  setUserRole(null);
                  localStorage.removeItem('suvarna_user_role');
                  setCurrentOwner(null);
                  localStorage.removeItem('suvarna_current_owner');
                  setIsImpersonating(false);
                  localStorage.removeItem('suvarna_is_impersonating');
                  setView('landing');
                }}
              />
            </div>
          </div>
        );
      }
    } else {
      // Unauthenticated fallback
      setTimeout(() => {
        setView('landing');
        setIsLoginModalOpen(true);
      }, 0);
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Guided Product Tour Slides
  const tourSlides = [
    {
      title: "1. Smart KYC & Customer Registration",
      description: "Instantly register customers, capture photo IDs, and verify Aadhaar/PAN details with automated KYC checks directly from the mobile scanner or desktop cam.",
      badge: "Compliance",
      metric: "Avg. onboarding: < 2 mins"
    },
    {
      title: "2. Precision Weight & Purity Pledge",
      description: "Pledge gold items with granular records: purity (18K to 24K), weight in grams, gross/net weight calculation, and automatic market valuation sync.",
      badge: "Valuation",
      metric: "Direct weighing scale sync supported"
    },
    {
      title: "3. Automated Interest Disbursal Cycles",
      description: "Select monthly interest rates (0.8% to 2.5%), set custom repayment schedules, grace periods, slab interest, or penalty rates. It automatically computes totals daily.",
      badge: "Ledger Automation",
      metric: "Eliminates calculations errors"
    },
    {
      title: "4. Multi-Branch Operations & Vault Auditing",
      description: "Manage physical vaults, branch vaults, cash ledgers, employee logs, and print itemized barcode receipts and invoices for your clients.",
      badge: "Enterprise Vaulting",
      metric: "Real-time auditing & daily backups"
    }
  ];

  return (
    <div className="min-h-screen bg-modern-gradient text-slate-800 flex flex-col font-sans antialiased relative overflow-x-hidden">
      
      {/* EXQUISITE GRADIENT BACKGROUND GLOWS (As seen in Creatika mockup) */}
      <div className="absolute top-0 left-0 right-0 h-full w-full pointer-events-none overflow-hidden -z-20">
        {/* Soft Peach Sunset Glow top-right */}
        <div className="absolute top-[-10%] right-[-10%] w-[90vw] h-[90vw] max-w-[1200px] rounded-full bg-gradient-to-br from-orange-400/20 via-pink-400/15 to-transparent blur-[150px]" />
        
        {/* Magic Purple Glow top-left */}
        <div className="absolute top-[10%] left-[-15%] w-[80vw] h-[80vw] max-w-[1000px] rounded-full bg-gradient-to-tr from-purple-400/20 via-indigo-400/15 to-transparent blur-[140px]" />
        
        {/* Glowing Amber Glow center-right */}
        <div className="absolute top-[35%] right-[-5%] w-[75vw] h-[75vw] max-w-[1000px] rounded-full bg-gradient-to-tr from-amber-400/15 via-orange-300/10 to-transparent blur-[130px]" />
        
        {/* Mint & Emerald Glow center-left */}
        <div className="absolute top-[55%] left-[-10%] w-[85vw] h-[85vw] max-w-[1100px] rounded-full bg-gradient-to-br from-emerald-300/15 via-teal-300/15 to-transparent blur-[150px]" />
        
        {/* Hot Fuchsia Glow bottom-right */}
        <div className="absolute top-[78%] right-[-10%] w-[90vw] h-[90vw] max-w-[1200px] rounded-full bg-gradient-to-tr from-rose-400/20 via-purple-300/15 to-transparent blur-[140px]" />
        
        {/* Calm Indigo Glow bottom-left */}
        <div className="absolute bottom-[1%] left-[-5%] w-[80vw] h-[80vw] max-w-[1000px] rounded-full bg-gradient-to-br from-indigo-300/20 via-sky-300/15 to-transparent blur-[130px]" />
      </div>

      {/* GLOBAL BANNER */}
      <div className="bg-gradient-to-r from-orange-600 via-rose-700 to-amber-500 text-white text-[11px] font-bold py-2 px-4 flex items-center justify-center gap-1.5 border-b border-amber-500/20 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
        <span className="tracking-wide">SuvarnaLoan ERP v2.4 Festive Release: Try the interactive Gold Calculator & live client mockups below!</span>
      </div>

      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 bg-white/70 backdrop-blur-lg border-b border-slate-100/50 z-40 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2">
            {/* Elegant Crown & Diamond Monogram S SVG Logo */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gold-crown-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DF9F28" />
                    <stop offset="30%" stopColor="#FFF2B2" />
                    <stop offset="70%" stopColor="#D28F1B" />
                    <stop offset="100%" stopColor="#875005" />
                  </linearGradient>
                </defs>
                
                {/* Crown on top of Diamond */}
                <path d="M 32 30 L 28 14 L 38 23 L 50 8 L 62 23 L 72 14 L 68 30 Z" fill="url(#gold-crown-grad)" />
                <circle cx="28" cy="13" r="1.5" fill="#FFF2B2" />
                <circle cx="38" cy="22" r="1.5" fill="#FFF2B2" />
                <circle cx="50" cy="7" r="1.8" fill="#FFF2B2" />
                <circle cx="62" cy="22" r="1.5" fill="#FFF2B2" />
                <circle cx="72" cy="13" r="1.5" fill="#FFF2B2" />

                {/* Diamond Outer Frame */}
                <path d="M 18 48 L 82 48 L 94 60 L 50 95 L 6 60 Z" stroke="url(#gold-crown-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Facets inside Diamond */}
                <path d="M 18 48 L 34 60 L 66 60 L 82 48" stroke="url(#gold-crown-grad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                <path d="M 34 60 L 50 95 L 66 60" stroke="url(#gold-crown-grad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                <path d="M 6 60 L 34 60" stroke="url(#gold-crown-grad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                <path d="M 94 60 L 66 60" stroke="url(#gold-crown-grad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

                {/* Elegant S inside the diamond frame */}
                <path d="M 58 42 C 58 42, 53 38, 46 40 C 40 42, 38 46, 40 52 C 42 58, 48 60, 53 62 C 59 64, 63 67, 61 75 C 59 83, 50 86, 43 83 C 37 80, 36 75, 36 75" stroke="url(#gold-crown-grad)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="58" cy="42" r="1.5" fill="#FFF2B2" />
                <circle cx="36" cy="75" r="1.5" fill="#FFF2B2" />
              </svg>
            </div>
            
            {/* Elegant Serif Text Representation to match the image */}
            <div className="flex flex-col text-left animate-fade-in">
              <div className="flex items-baseline font-serif">
                <span className="font-extrabold text-[#0B1E43] text-xl sm:text-2xl tracking-tight">Suvarna</span>
                <span className="font-extrabold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent text-xl sm:text-2xl tracking-tight ml-0.5">Loan</span>
                <span className="font-semibold text-[#0B1E43] text-xl sm:text-2xl tracking-tight ml-1.5">ERP</span>
              </div>
              <span className="text-[7.5px] font-bold text-slate-400 tracking-[0.25em] uppercase block leading-none mt-1">Gold Loan ERP Software</span>
            </div>
          </div>

          {/* Center Links (Desktop only) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#" className="text-gold-600 font-bold border-b-2 border-gold-500 pb-0.5">Home</a>
            <div className="group relative cursor-pointer flex items-center gap-1 hover:text-slate-900 py-1">
              <span>Solutions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
              {/* Dropdown Box */}
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                <div className="space-y-2.5">
                  <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">Shop Categories</span>
                  <a href="#calculator" className="text-xs font-medium text-slate-600 hover:text-gold-600 block">Single Showroom</a>
                  <a href="#" className="text-xs font-medium text-slate-600 hover:text-gold-600 block">Multi-Branch Chain</a>
                  <a href="#" className="text-xs font-medium text-slate-600 hover:text-gold-600 block">Co-operative Societies</a>
                </div>
              </div>
            </div>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#calculator" className="hover:text-slate-900 transition-colors">Pricing</a>
            <div className="group relative cursor-pointer flex items-center gap-1 hover:text-slate-900 py-1">
              <span>Resources</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                <div className="space-y-2">
                  <a href="#" className="text-xs font-medium text-slate-600 hover:text-gold-600 block">RBI Gold Guidelines</a>
                  <a href="#" className="text-xs font-medium text-slate-600 hover:text-gold-600 block">Technical Security</a>
                  <a href="#faq" className="text-xs font-medium text-slate-600 hover:text-gold-600 block">User FAQ</a>
                </div>
              </div>
            </div>
            <a href="#faq" className="hover:text-slate-900 transition-colors">About Us</a>
            <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Phone Pill */}
            <a 
              href="tel:+917058536371" 
              className="hidden md:flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-gold-300 transition-colors shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-gold-500" />
              <span>+91 70585 36371</span>
            </a>

            {/* Login / Auth Button Control */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 pr-3 shadow-2xs">
                <button 
                  onClick={() => setView('dashboard')}
                  className="bg-[#0A1A36] hover:bg-[#152747] text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>{userRole === 'superadmin' ? 'Admin Portal' : 'Owner Portal'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    localStorage.removeItem('suvarna_logged_in');
                    setUserRole(null);
                    localStorage.removeItem('suvarna_user_role');
                    setCurrentOwner(null);
                    localStorage.removeItem('suvarna_current_owner');
                    setIsImpersonating(false);
                    localStorage.removeItem('suvarna_is_impersonating');
                    setView('landing');
                  }}
                  className="text-rose-600 hover:text-rose-800 font-extrabold text-[10px] pl-1.5 border-l border-slate-200 transition-colors uppercase tracking-wider"
                  title="Log Out Session"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#DF9F28] hover:text-[#0A1A36] font-bold text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer hover:bg-slate-100 shadow-2xs flex items-center gap-1.5 shrink-0"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Owner Log In</span>
                </button>
                <button 
                  onClick={() => setIsSignUpModalOpen(true)}
                  className="border border-amber-500/30 bg-amber-50 text-amber-950 hover:bg-amber-100 hover:border-amber-500/60 font-bold text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-4 pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        {/* Abstract Gold Background Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-amber-100 rounded-full blur-[120px] opacity-40 -z-10"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[150px] opacity-35 -z-10"></div>

        {/* Intricate slow-spinning Indian Mandala Backdrop (Auspicious & Majestic) */}
        <div className="absolute right-[5%] top-[10%] w-[550px] h-[550px] text-amber-500/10 pointer-events-none -z-10 animate-[spin_240s_linear_infinite] hidden lg:block">
          <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.4">
            <circle cx="100" cy="100" r="95" strokeDasharray="2,2" />
            <circle cx="100" cy="100" r="88" />
            <circle cx="100" cy="100" r="78" strokeDasharray="4,3" />
            <circle cx="100" cy="100" r="54" />
            <circle cx="100" cy="100" r="32" />
            {/* Mandala rays & floral geometric symmetry */}
            {[...Array(24)].map((_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              const x1 = 100 + Math.cos(angle) * 32;
              const y1 = 100 + Math.sin(angle) * 32;
              const x2 = 100 + Math.cos(angle) * 88;
              const y2 = 100 + Math.sin(angle) * 88;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
            {[...Array(16)].map((_, i) => {
              const angle = (i * 22.5 * Math.PI) / 180;
              const cx = 100 + Math.cos(angle) * 66;
              const cy = 100 + Math.sin(angle) * 66;
              return <circle key={i} cx={cx} cy={cy} r="10" strokeDasharray="1,1" />;
            })}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content Column */}
          <div className="lg:col-span-5 text-left space-y-6">
            
            {/* Tricolor Premium Checked Pill */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/5 via-white to-emerald-500/5 px-4.5 py-2.5 rounded-full border border-orange-500/20 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-800 tracking-wider flex items-center gap-1.5 uppercase">
                <span className="text-orange-500">🇮🇳</span> India's Trusted <span className="text-emerald-600">Gold Loan ERP</span>
              </span>
            </div>

            {/* Main Premium Typography Header */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Transform Your <br />
              <span className="text-slate-800">Jewellery Shop Into</span> <br />
              <span className="text-amber-500 block mt-1.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-2xs">
                A Smart Gold Loan <br />
                Business
              </span>
            </h1>

            {/* Support Paragraph */}
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
              Manage customers, gold loans, KYC, payments, monthly interest, invoices and reports – all from one secure platform built for Indian jewellers.
            </p>

            {/* CTA Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-3 px-6 rounded-full flex items-center gap-2 shadow-xl shadow-amber-500/15 transition-all group cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-100" />
                <span>Book Free Demo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => setIsTourOpen(true)}
                className="bg-white hover:bg-slate-50 border border-amber-500/30 text-amber-600 font-bold text-xs py-3 px-6 rounded-full flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Watch Product Tour</span>
              </button>
            </div>

          </div>

          {/* Hero Right Device Mockups Column - Clean, Premium Placeholder for Future Image */}
          <div className="lg:col-span-7 mt-12 lg:mt-0 flex items-center justify-center">
            <div className="w-full max-w-xl bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center shadow-lg relative overflow-hidden group hover:border-amber-400/60 transition-all duration-300">
              
              {/* Abstract decorative ambient gradients */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400/5 rounded-full blur-xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                
                {/* Visual Icon Stack */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-tr from-amber-100 to-orange-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                    </svg>
                  </div>
                  {/* Plus Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 border-2 border-white shadow-sm flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                </div>

                {/* Main Labeling */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800">SuvarnaLoan Hero Graphic</h3>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                    This space is reserved for your custom high-quality product illustration, dashboard screenshot, or promotional device mockup.
                  </p>
                </div>

                {/* Interactive Developer / Admin Hint Badge */}
                <div className="inline-flex items-center gap-2 bg-amber-50/80 border border-amber-200/50 text-amber-700 text-[11px] font-semibold px-4 py-2 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Placeholder Active • Ready to receive your image file</span>
                </div>

                {/* Modern visual grid preview overlay to look exceptionally elegant */}
                <div className="w-full grid grid-cols-3 gap-3 pt-4 opacity-40">
                  <div className="h-2 bg-slate-200 rounded-full"></div>
                  <div className="h-2 bg-slate-200 rounded-full col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded-full col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded-full"></div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FLOATING STATISTICS BAR */}
      <section className="relative px-4 z-25 mt-[-45px]">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-700 via-[#091d7c] to-[#020521] rounded-3xl shadow-2xl border border-blue-500/30 p-6 md:p-8 flex flex-wrap justify-between items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10 relative overflow-hidden">
          {/* Traditional design ambient background glows */}
          <div className="absolute top-0 left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
          
          {/* Stat 1: Shops (Auspicious Kesar Saffron Glow) */}
          <div className="flex items-center gap-4 py-2 md:py-0 flex-1 min-w-[200px] justify-center md:justify-start relative z-10">
            <div className="p-3 bg-gradient-to-br from-orange-400 via-amber-500 to-red-500 text-white rounded-2xl shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-110 transition-all duration-300 ring-2 ring-white/10 shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-black text-white text-lg sm:text-xl font-mono leading-none">500+</span>
              <span className="text-[11px] font-bold text-slate-300 block mt-1">Jewellery Shops Trust Us</span>
            </div>
          </div>

          {/* Stat 2: Portfolio (Wealth Emerald Glow) */}
          <div className="flex items-center gap-4 py-4 md:py-0 md:pl-6 flex-1 min-w-[200px] justify-center md:justify-start relative z-10">
            <div className="p-3 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-white rounded-2xl shadow-xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-110 transition-all duration-300 ring-2 ring-white/10 shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-black text-white text-lg sm:text-xl font-mono leading-none">₹500+ Crore</span>
              <span className="text-[11px] font-bold text-slate-300 block mt-1">Loan Portfolio Managed</span>
            </div>
          </div>

          {/* Stat 3: Customers (Celebration Ruby Glow) */}
          <div className="flex items-center gap-4 py-4 md:py-0 md:pl-6 flex-1 min-w-[200px] justify-center md:justify-start relative z-10">
            <div className="p-3 bg-gradient-to-br from-rose-400 via-red-500 to-pink-500 text-white rounded-2xl shadow-xl shadow-rose-500/40 hover:shadow-rose-500/60 hover:scale-110 transition-all duration-300 ring-2 ring-white/10 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-black text-white text-lg sm:text-xl font-mono leading-none">50,000+</span>
              <span className="text-[11px] font-bold text-slate-300 block mt-1">Happy Customers</span>
            </div>
          </div>

          {/* Stat 4: Security (Royal Sapphire Glow) */}
          <div className="flex items-center gap-4 py-4 md:py-0 md:pl-6 flex-1 min-w-[200px] justify-center md:justify-start relative z-10">
            <div className="p-3 bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-600 text-white rounded-2xl shadow-xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-110 transition-all duration-300 ring-2 ring-white/10 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-black text-white text-lg sm:text-xl font-mono leading-none">99.99%</span>
              <span className="text-[11px] font-bold text-slate-300 block mt-1">Secure Cloud Uptime</span>
            </div>
          </div>

          {/* Stat 5: Backup (Pure Shudh Gold Glow) */}
          <div className="flex items-center gap-4 py-4 md:py-0 md:pl-6 flex-1 min-w-[200px] justify-center md:justify-start relative z-10">
            <div className="p-3 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white rounded-2xl shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-110 transition-all duration-300 ring-2 ring-white/10 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-black text-white text-lg sm:text-xl font-mono leading-none">Daily</span>
              <span className="text-[11px] font-bold text-slate-300 block mt-1">Automated Backups</span>
            </div>
          </div>

        </div>
      </section>

      {/* MODULE EXPLORER SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-24 text-center space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase block mb-2">
            🇮🇳 ALL-IN-ONE POWERHOUSE ERP 🇮🇳
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Everything You Need to Run Your <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Gold Loan Business</span> Smoothly
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Eliminate manual registers and computational errors. Scale your business with the most robust interest calculations and digital account ledger systems.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Customer Management (Saffron) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-orange-200 hover:-translate-y-1.5 transition-all duration-300 group text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Customer Management</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Store & manage customer details with KYC. Attach photo verification, check credit limits, and sync multiple pledged loans instantly.
            </p>
          </div>

          {/* Card 2: Gold Loan Management (Amber) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-amber-200 hover:-translate-y-1.5 transition-all duration-300 group text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform mb-6">
              <Scale className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Gold Loan Management</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Track loans, gold items, purity, weight & value. Input stone-weight deductions and calculate standard net ornaments values dynamically.
            </p>
          </div>

          {/* Card 3: Interest Calculation (Rose) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-rose-200 hover:-translate-y-1.5 transition-all duration-300 group text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 group-hover:scale-110 transition-transform mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Interest Calculation</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Automatic monthly interest & penalty calculation. Set up customized slab schemes, compounding settings, or grace-days parameters.
            </p>
          </div>

          {/* Card 4: Payment Tracking (Emerald) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1.5 transition-all duration-300 group text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Payment Tracking</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Record payments, due, outstanding & history. Handle partial interest releases, cash reconciliations, and vault tracking.
            </p>
          </div>

          {/* Card 5: Invoices & Reminders (Indigo) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1.5 transition-all duration-300 group text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Invoices & Reminders</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Send monthly invoices & payment reminders. Automated notification dispatches via SMS, WhatsApp, and integrated print layouts.
            </p>
          </div>

          {/* Card 6: Reports & Analytics (Purple) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-purple-200 hover:-translate-y-1.5 transition-all duration-300 group text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform mb-6">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Reports & Analytics</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Powerful reports & insights to grow your business. Generate dynamic ledger files, audit summaries, and P&L balances.
            </p>
          </div>

        </div>
      </section>

      {/* PERFORMANCE BOOST CALLOUT BANNER (GRADIENT TRANSITION) */}
      <section className="px-4 py-8 max-w-6xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="relative py-10 px-6 sm:px-10 w-full bg-gradient-to-r from-[#81541c] via-[#DF9F28] to-[#9e6f28] bg-moving-gradient text-white overflow-hidden text-center flex flex-col items-center justify-center rounded-3xl border border-amber-500/30 shadow-2xl"
        >
          {/* Soft background glow circles */}
          <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Diamond backdrop accent */}
          <div className="absolute left-12 top-8 w-12 h-12 border border-white/10 rounded-xl rotate-45 pointer-events-none hidden md:block opacity-40"></div>
          <div className="absolute right-12 bottom-8 w-14 h-14 bg-white/5 rounded-full pointer-events-none hidden md:block opacity-40"></div>
          
          <div className="max-w-2xl mx-auto space-y-5 relative z-10 flex flex-col items-center">
            {/* Top Pill */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider text-yellow-100 shadow-xs uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping"></span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
              <span>Easiest To Use • Most Modern Software</span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping"></span>
            </motion.div>

            {/* Heavy Bold Title */}
            <motion.h3 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight"
            >
              Performance Boost for Jewellers<br />
              <span className="text-yellow-200">With 100% Accurate Calculations</span>
            </motion.h3>

            {/* Subparagraph */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-amber-50 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed opacity-95"
            >
              Join thousands of jewellers who've transformed their business operations with our cutting-edge technology. Experience the easiest, fastest, and most accurate calculations ever made.
            </motion.p>

            {/* Bottom Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-2 pt-1"
            >
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl text-white text-[11px] font-bold shadow-xs">
                <CheckCircle className="w-3.5 h-3.5 text-yellow-300" />
                <span>100% Accuracy</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl text-white text-[11px] font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Most Modern</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl text-white text-[11px] font-bold shadow-xs">
                <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300/20" />
                <span>Fastest Disbursal</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ESTIMATOR SEGMENT WITH METRIC VALUATION */}
      <section className="bg-gradient-to-b from-slate-50/50 to-white py-24 px-4 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase block mb-2">
              ⚖️ LOAN ESTIMATION ENGINE ⚖️
            </span>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Calculate Customer <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Loan Potential Live</span>
            </h3>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
              Test how custom valuation ratios and interest parameters adapt to market rates seamlessly.
            </p>
          </div>

          <GoldLoanCalculator />
        </div>
      </section>

      {/* PERFECT BUSINESS SOLUTIONS SEGMENT (Tailored for Indian Jewellers & Money Lenders) */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-24 px-4 relative overflow-hidden border-t border-b border-slate-100">
        {/* Artistic traditional background glows */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Centered Badging & Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase block mb-2">
              🇮🇳 BUILT FOR EVERY INDIAN JEWELLERY BUSINESS 🇮🇳
            </span>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Perfect Solution for <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">Every Jewellery Business</span>
            </h3>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
              No matter if you are a local Retailer, B2B Wholesaler, or Mortgage Money Lender (Girvi Business) — SuvarnaLoan ERP fits your daily workflow perfectly with customized features.
            </p>
          </div>

          {/* Three Custom Business Type Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CARD 1: Retail Showrooms */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl hover:border-emerald-500/20 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div className="p-8 space-y-6">
                
                {/* Visual Top Accent */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
                    <Building className="w-7 h-7" />
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Showroom Favourite
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <h4 className="text-2xl font-extrabold text-slate-900">Modern Retailer</h4>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                    Built for Retail Jewellery Stores
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Simplify your retail business with advanced billing, customer accounting, digital estimates, and instant WhatsApp communication. Designed to serve walk-in clients 10x faster.
                  </p>
                </div>

                {/* Bullet Points with emerald green checks */}
                <div className="border-t border-slate-50 pt-6 space-y-3.5 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">GST & Estimate Billing</h5>
                      <p className="text-[10px] text-slate-400">Generate Pakka (Tax Invoice) or Kaccha bill in seconds</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">RFID, Tagging & Barcodes</h5>
                      <p className="text-[10px] text-slate-400">Scan tags at billing counter to load weight and purity automatically</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">URD Purchase (Old Gold)</h5>
                      <p className="text-[10px] text-slate-400">Track and log old gold purchases with customer signature and proof</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Instant Estimate Estimations</h5>
                      <p className="text-[10px] text-slate-400">Auto-calculate gold value, making charges, and taxes to close sales</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Purity-Wise Live Stock</h5>
                      <p className="text-[10px] text-slate-400">Live counts of 22K, 18K, and 24K gold ornaments in your display</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Automated WhatsApp Billing</h5>
                      <p className="text-[10px] text-slate-400">Send PDF invoices directly to customer's WhatsApp instantly</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Custom Tags & Prints</h5>
                      <p className="text-[10px] text-slate-400">Works with all normal computer printers, thermal paper, & tag printers</p>
                    </div>
                  </div>
                </div>

              </div>
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all duration-200"
                >
                  Setup Retail Billing Demo
                </button>
              </div>
            </div>

            {/* CARD 2: B2B Wholesalers & Manufacturers */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl hover:border-amber-500/20 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div className="p-8 space-y-6">
                
                {/* Visual Top Accent */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform duration-300">
                    <Scale className="w-7 h-7" />
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Precision Metal Account
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <h4 className="text-2xl font-extrabold text-slate-900">Wholesaler & B2B</h4>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                    For Manufacturers & Stockists
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Stop calculating gold outstanding in paper books. Manage bulk dealer accounts, record metal-to-metal exchanges, book live bhav cuts, and control Karigar wastage.
                  </p>
                </div>

                {/* Bullet Points with amber/orange checks */}
                <div className="border-t border-slate-50 pt-6 space-y-3.5 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Metal-to-Metal Payments</h5>
                      <p className="text-[10px] text-slate-400">Settle your bills directly with pure gold grams or cash</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Live Bhav Cuts & Booking</h5>
                      <p className="text-[10px] text-slate-400">Lock gold rates for future bookings to safeguard against price spikes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Party-Wise Metal Ledger</h5>
                      <p className="text-[10px] text-slate-400">Consolidated accounts tracking both Gold weight and Cash balances</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Auto Tunch & Wastage (Ghaat)</h5>
                      <p className="text-[10px] text-slate-400">Zero errors in purity weight calculations with auto-wastage formula</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Karigar Issue & Receipt</h5>
                      <p className="text-[10px] text-slate-400">Record gold issued to artisan vs received finished jewellery weight</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Live Fine Weight Books</h5>
                      <p className="text-[10px] text-slate-400">Dynamic reports displaying exact Net, Gross, and Fine pure weights</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Metal Outstanding Reports</h5>
                      <p className="text-[10px] text-slate-400">One-click visual check of which dealer owes how much pure gold</p>
                    </div>
                  </div>
                </div>

              </div>
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all duration-200"
                >
                  Setup Wholesaler Demo
                </button>
              </div>
            </div>

            {/* CARD 3: Girvi / Money Lending */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-300 overflow-hidden flex flex-col justify-between group relative">
              
              {/* Saffron Popular Badge on top right of Girvi section (Since Girvi is extremely popular in India) */}
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider animate-bounce shadow-xs">
                  ★ MOST POPULAR IN INDIA
                </span>
              </div>

              <div className="p-8 space-y-6">
                
                {/* Visual Top Accent */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <h4 className="text-2xl font-extrabold text-slate-900">Money Lending (Girvi)</h4>
                  <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                    Safe & Simple Gold Mortgage
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    100% reliable system for pawn brokers and Girvi shops. Never make a manual error in compound interest calculations again. Send automated friendly SMS and WhatsApp alerts.
                  </p>
                </div>

                {/* Bullet Points with indigo/purple checks */}
                <div className="border-t border-slate-50 pt-6 space-y-3.5 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Instant KYC with Photo & Signature</h5>
                      <p className="text-[10px] text-slate-400">Verify customer identity with Aadhaar, upload gold pictures directly</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">1-Minute Girvi Booking</h5>
                      <p className="text-[10px] text-slate-400">Fast entry screen designed specifically for quick local mortgage approvals</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Simple & Compound Interest Engine</h5>
                      <p className="text-[10px] text-slate-400">Monthly, weekly, daily, custom interest slabs or penalty rate structures</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Safe Vault & Box Location</h5>
                      <p className="text-[10px] text-slate-400">Map mortgaged gold items to exact physical cupboard and safe box number</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Loss-Making Girvi Alerts</h5>
                      <p className="text-[10px] text-slate-400">Auto-alerts when accumulated interest crosses current gold valuation</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Friendly Interest Reminders</h5>
                      <p className="text-[10px] text-slate-400">Send direct friendly alerts for due interest payments on WhatsApp/SMS</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">✓</div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Professional Girvi Receipts</h5>
                      <p className="text-[10px] text-slate-400">Print dynamic pawn tickets with item image, weight, and terms</p>
                    </div>
                  </div>
                </div>

              </div>
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all duration-200"
                >
                  Setup Girvi Mortgage Demo
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* SUBSCRIPTION PLAN SECTION (Styled EXACTLY like the 1st image with the data of the 2nd image) */}
      <section 
        id="pricing" 
        onMouseMove={handleMouseMove}
        className="bg-slate-50/50 py-24 px-4 relative overflow-hidden border-t border-b border-slate-200/50 group/pricing"
      >
        {/* Interactive Spotlights & Moving Gradients */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-300 opacity-100 z-0"
          style={{
            background: `
              radial-gradient(circle 600px at ${mousePos.x}% ${mousePos.y}%, rgba(249, 115, 22, 0.09), rgba(245, 158, 11, 0.04), transparent 80%),
              radial-gradient(circle 400px at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(16, 185, 129, 0.06), rgba(59, 130, 246, 0.03), transparent 80%)
            `
          }}
        ></div>
        
        {/* Dynamic Slow-Moving Ambient Gradient */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-gradient-to-tr from-orange-500 via-amber-500 to-emerald-500 animate-[pulse_8s_ease-in-out_infinite] z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Floating Badges */}
          <div className="absolute -top-12 left-4 md:left-12 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 p-3 shadow-lg shadow-slate-100/50 flex items-center gap-2.5 z-20 animate-bounce [animation-duration:4s] hidden sm:flex">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="text-base font-semibold">👍</span>
            </div>
            <div className="text-left select-none">
              <p className="text-slate-900 font-bold text-xs leading-none">1,312 jewellers</p>
              <p className="text-slate-400 text-[9px] mt-0.5">bought a subscription</p>
            </div>
          </div>

          <div className="absolute -top-12 right-4 md:right-12 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 p-3 shadow-lg shadow-slate-100/50 flex items-center gap-2.5 z-20 animate-bounce [animation-duration:5s] hidden sm:flex">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <span className="text-base font-semibold">⭐</span>
            </div>
            <div className="text-left select-none">
              <p className="text-slate-900 font-bold text-xs leading-none">₹4,500Cr+</p>
              <p className="text-slate-400 text-[9px] mt-0.5">Help our clients</p>
            </div>
          </div>

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase block mb-2">
              💎 PRICING PLANS 💎
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Choose your plan that <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">suits your business</span>
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
              Simple, transparent pricing. No hidden surprises. Choose the package that scales with your growth.
            </p>
          </div>

          {/* 3-Column Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: Save Money Blue Card */}
            <div className="bg-gradient-to-b from-blue-600 to-indigo-800 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-xl shadow-blue-900/10 min-h-[500px]">
              
              {/* Decorative background grid and spheres */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/30 rounded-full blur-3xl pointer-events-none"></div>

              <div className="space-y-6 relative z-10 text-left">
                {/* Yellow/Saffron Badge */}
                <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-amber-300 text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> We help our clients save money
                </div>

                <h3 className="text-2xl sm:text-3xl font-black leading-snug">
                  We help our clients save money and earn more
                </h3>

                <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-normal">
                  Our plans will suit anyone. Big business or individual entrepreneur. We are very flexible and by purchasing a plan you can count on our help.
                </p>
              </div>

              {/* Pointing professional image - masked at the bottom */}
              <div className="relative mt-8 -mx-8 -mb-10 flex justify-center items-end select-none pointer-events-none z-10">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent z-10"></div>
                
                {/* Visual shape cutout to hold the picture perfectly */}
                <div className="w-[280px] h-[280px] rounded-full overflow-hidden border-4 border-white/10 shadow-2xl relative bg-indigo-700/50 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=350&h=350" 
                    alt="Success Representative" 
                    className="w-full h-full object-cover object-top scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

            </div>

            {/* Card 2: Professional Plan (Orange Badge) */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative flex flex-col justify-between group hover:border-orange-400/50 transition-all duration-300">
              
              {/* Premium Pricing Ribbon tag (Top Right) */}
              <div className="absolute top-0 right-8 transform -translate-y-4">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold px-5 py-3 rounded-2xl shadow-md shadow-orange-500/20 text-center min-w-[120px]">
                  <div className="text-xs uppercase tracking-wider opacity-90 leading-none">Monthly</div>
                  <div className="text-xl font-black mt-0.5">₹999</div>
                </div>
              </div>

              <div className="space-y-6 text-left">
                
                {/* Medallion icon */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-inner">
                    {/* Gold medallion SVG icon */}
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800 leading-none">Professional</h4>
                    <span className="inline-block bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">
                      Most Popular Plan
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  For growing and established gold loan businesses seeking robust automated interest engines & ledger books.
                </p>

                {/* Yearly variant note */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-slate-600">Yearly Option:</span>
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    ₹9,999/yr (2 Months Free!)
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">What you'll get</p>
                  <ul className="space-y-3">
                    {[
                      "Up to 2,000 customers database",
                      "Single user login (No staff accounts)",
                      "Single branch store operations",
                      "Full gold loan lifecycle management",
                      "Automated WhatsApp & SMS alerts",
                      "Advanced ledger & account reports",
                      "Excel/PDF export & continuous backups",
                      "Priority 24/7 technical support"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black shadow-xs">
                          ✓
                        </div>
                        <span className="text-slate-700 text-xs font-medium leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-600/10 hover:shadow-xl hover:shadow-blue-600/20 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
                </button>
              </div>

            </div>

            {/* Card 3: Enterprise Plan (Purple Badge) */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative flex flex-col justify-between group hover:border-indigo-400/50 transition-all duration-300">
              
              {/* Premium Pricing Ribbon tag (Top Right) */}
              <div className="absolute top-0 right-8 transform -translate-y-4">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-extrabold px-5 py-3 rounded-2xl shadow-md shadow-indigo-600/20 text-center min-w-[120px]">
                  <div className="text-xs uppercase tracking-wider opacity-90 leading-none">Monthly</div>
                  <div className="text-xl font-black mt-0.5">₹2,499</div>
                </div>
              </div>

              <div className="space-y-6 text-left">
                
                {/* Medallion icon */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shadow-inner">
                    {/* Platinum medallion SVG icon */}
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                      <polygon points="12 6 18 10 18 14 12 18 6 14 6 10 12 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800 leading-none">Enterprise</h4>
                    <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">
                      Multi-Branch Suite
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  For NBFCs and multi-branch operations requiring custom integrations, unlimited customers & staff roles.
                </p>

                {/* Yearly variant note */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-slate-600">Yearly Option:</span>
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    ₹24,999/yr (2 Months Free!)
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">What you'll get</p>
                  <ul className="space-y-3">
                    {[
                      "Unlimited customer database",
                      "Up to 10 staff members login",
                      "Up to 10 independent branches",
                      "Full premium enterprise ERP suite",
                      "Custom integrations & API access",
                      "Dedicated account success manager",
                      "White-label portal with custom branding",
                      "99.9% uptime SLA & custom terms"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black shadow-xs">
                          ✓
                        </div>
                        <span className="text-slate-700 text-xs font-medium leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="w-full py-4 px-6 bg-slate-100 hover:bg-slate-200 text-indigo-950 font-extrabold text-sm rounded-2xl active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5px] text-indigo-600" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* CUSTOMER TESTIMONIALS (Styled EXACTLY like the premium mockup image) */}
      <section className="bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] py-24 px-4 relative overflow-hidden border-t border-b border-slate-200/60">
        
        {/* PARALLEL SINE WAVE CONTOUR LINES BACKDROP (ELEGANT & PREMIUM GRID PATTERN) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <svg className="absolute w-full h-full stroke-indigo-400/[0.07] fill-none" xmlns="http://www.w3.org/2000/svg">
            {[...Array(14)].map((_, i) => (
              <path
                key={i}
                d={`M -200 ${100 + i * 22} C 300 ${20 + i * 22}, 700 ${380 + i * 22}, 1200 ${80 + i * 22} T 2400 ${100 + i * 22}`}
                strokeWidth="1.2"
              />
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          {/* Mockup Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase block mb-2">
              ⭐ CUSTOMER STORIES ⭐
            </span>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Real Reviews From <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 bg-clip-text text-transparent">Trusted Jewellers</span>
            </h3>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
              Discover how showroom owners and money lenders across the nation leverage SuvarnaLoan ERP to grow interest yields and protect customer pledges.
            </p>
          </div>

          {/* Testimonial Cards Layout - Carousel responsive engine */}
          {(() => {
            const list = [
              {
                id: 1,
                name: "Karthik Suriya",
                role: "Founder, Suriya Swarna Mahal",
                location: "Coimbatore, Tamil Nadu",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
                quote: "Replacing manual ledger registers with SuvarnaLoan ERP was the best decision for our showroom. Automated WhatsApp interest reminders are magical – our recovery rates jumped by 42% in just two months!"
              },
              {
                id: 2,
                name: "Ankit Jain",
                role: "Director, Vardhaman Jewellers",
                location: "Karol Bagh, New Delhi",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
                quote: "Interest calculation on partial payments was always a complex dispute. SuvarnaLoan handles multiple schemes, monthly interest compoundings, and generates professional printable receipts with ease!"
              },
              {
                id: 3,
                name: "Bipro Sen",
                role: "Owner, Sen & Sons Jewellers",
                location: "Bowbazar, Kolkata",
                avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120",
                quote: "Auditing raw ornaments, carat calculations, and gross-to-net weight evaluations has never been so seamless. The double-vault tracking gives us ultimate security and absolute business transparency."
              },
              {
                id: 4,
                name: "Meenakshi Amma",
                role: "Partner, Meenakshi Gold Finance",
                location: "Thrissur, Kerala",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
                quote: "Managing thousands of pawns and calculating compound gold interest with daily slabs was a nightmare. SuvarnaLoan simplified our audits and made our pledge accounts 100% transparent and compliant!"
              },
              {
                id: 5,
                name: "Rajesh Sawant",
                role: "MD, Sawant & Sons Alankar",
                location: "Kolhapur, Maharashtra",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120",
                quote: "The physical vault location tracker changed our business. We can locate any mortgaged necklace in under 10 seconds. Best software for Indian pawn brokers!"
              }
            ];

            // Render indices
            const firstIdx = testimonialIndex % list.length;
            const secondIdx = (testimonialIndex + 1) % list.length;
            const thirdIdx = (testimonialIndex + 2) % list.length;

            const visibleItems = [list[firstIdx], list[secondIdx], list[thirdIdx]];

            return (
              <div className="space-y-12">
                {/* Responsive Testimonial Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* On Mobile, we can show only the first visible item, on desktop we show all 3 */}
                  {visibleItems.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className={`bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-lg shadow-slate-200/30 flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                        idx > 0 ? "hidden md:flex" : "flex"
                      }`}
                    >
                      {/* Top profile header layout precisely matching mockup image */}
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <img 
                            src={item.avatar} 
                            alt={item.name} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md shadow-slate-200/50 shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left">
                            <h4 className="font-bold text-slate-800 text-base tracking-tight leading-tight flex items-center gap-1.5">
                              {item.name}
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            </h4>
                            <p className="text-slate-400 text-xs font-medium tracking-wide mt-0.5 leading-none">
                              {item.role}
                            </p>
                            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1.5">
                              {item.location}
                            </span>
                          </div>
                        </div>

                        {/* Testimonial Quote */}
                        <div className="text-left">
                          <p className="text-slate-600 text-sm leading-relaxed font-normal italic">
                            "{item.quote}"
                          </p>
                        </div>
                      </div>

                      {/* Accent Star Rating inside cards for professional touch */}
                      <div className="flex gap-1 text-amber-400 mt-6 pt-4 border-t border-slate-50">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

                {/* Elegant Slider Control Buttons (<- & ->) EXACTLY centered & matching mockup */}
                <div className="flex justify-center items-center gap-4 pt-4">
                  <button 
                    onClick={() => setTestimonialIndex((prev) => (prev - 1 + list.length) % list.length)}
                    aria-label="Previous Testimonial"
                    className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[2px]" />
                  </button>
                  <button 
                    onClick={() => setTestimonialIndex((prev) => (prev + 1) % list.length)}
                    aria-label="Next Testimonial"
                    className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5 stroke-[2px]" />
                  </button>
                </div>
              </div>
            );
          })()}

        </div>
      </section>
      {/* FAQ SECTION */}
      <section id="faq" className="relative px-4 py-24 overflow-hidden border-t border-slate-100">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase block mb-2">
              💬 USER GUIDES & HELP 💬
            </span>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Frequently Asked <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Questions</span>
            </h3>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
              Got questions about setup, safety, or branch integrations? We have answered everything below.
            </p>
          </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-slate-800 flex justify-between items-center hover:bg-slate-50/50 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-gold-500' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-slate-900 pb-12 mb-8 text-left">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Crown on top of Diamond */}
                  <path d="M 32 30 L 28 14 L 38 23 L 50 8 L 62 23 L 72 14 L 68 30 Z" fill="url(#gold-crown-grad)" />
                  <circle cx="28" cy="13" r="1.5" fill="#FFF2B2" />
                  <circle cx="38" cy="22" r="1.5" fill="#FFF2B2" />
                  <circle cx="50" cy="7" r="1.8" fill="#FFF2B2" />
                  <circle cx="62" cy="22" r="1.5" fill="#FFF2B2" />
                  <circle cx="72" cy="13" r="1.5" fill="#FFF2B2" />

                  {/* Diamond Outer Frame */}
                  <path d="M 18 48 L 82 48 L 94 60 L 50 95 L 6 60 Z" stroke="url(#gold-crown-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Facets inside Diamond */}
                  <path d="M 18 48 L 34 60 L 66 60 L 82 48" stroke="url(#gold-crown-grad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                  <path d="M 34 60 L 50 95 L 66 60" stroke="url(#gold-crown-grad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />

                  {/* Elegant S inside the diamond frame */}
                  <path d="M 58 42 C 58 42, 53 38, 46 40 C 40 42, 38 46, 40 52 C 42 58, 48 60, 53 62 C 59 64, 63 67, 61 75 C 59 83, 50 86, 43 83 C 37 80, 36 75, 36 75" stroke="url(#gold-crown-grad)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <div className="flex items-baseline font-serif">
                <span className="font-extrabold text-white text-lg tracking-tight">Suvarna</span>
                <span className="font-extrabold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent text-lg tracking-tight ml-0.5">Loan</span>
                <span className="font-semibold text-slate-200 text-lg tracking-tight ml-1.5">ERP</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Empowering jewellers across India with streamlined technology to run secure, transparent, and high-yielding gold finance operations.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h5 className="font-bold text-sm text-gold-400">Core Software Features</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Instant KYC Check</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Gold Appraisal Ledger</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Automated Interest Engine</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">WhatsApp Invoicing SMS</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Vault Audit Analytics</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <h5 className="font-bold text-sm text-gold-400">Security & Compliance</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-slate-300 font-medium">ISO 27001 Certified Data Storage</span></li>
              <li><span className="text-slate-300 font-medium">End-to-end SSL/TLS Encryption</span></li>
              <li><span className="text-slate-300 font-medium">RBI Regulatory Standards Ready</span></li>
              <li><span className="text-slate-300 font-medium">Daily Hourly Encrypted Backup</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h5 className="font-bold text-sm text-gold-400">Branch Support Desk</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our service desk operates Monday to Saturday, 9 AM to 7 PM. Feel free to contact our technical advisors.
            </p>
            <div className="text-xs text-slate-300 font-semibold space-y-1">
              <p>Email: support@suvarnaloan.com</p>
              <p>Tel: +91 70585 36371</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-left">
          <p>© 2026 SuvarnaLoan ERP. All rights reserved. Crafted for premium gold jewellers.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE CHAT ADVISOR BUBBLE */}
      <InteractiveChatSupport />

      {/* BOOK DEMO MODAL */}
      <BookDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />

      {/* SECURE OWNER PORTAL LOGIN MODAL */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onToggleSignUp={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
        onLoginSuccess={(role, ownerData) => {
          setIsLoggedIn(true);
          localStorage.setItem('suvarna_logged_in', 'true');
          setUserRole(role);
          localStorage.setItem('suvarna_user_role', role);
          if (ownerData) {
            setCurrentOwner(ownerData);
            localStorage.setItem('suvarna_current_owner', JSON.stringify(ownerData));
          } else {
            setCurrentOwner(null);
            localStorage.removeItem('suvarna_current_owner');
          }
          setIsImpersonating(false);
          localStorage.removeItem('suvarna_is_impersonating');
          setView('dashboard');
        }}
      />

      {/* JEWELRY BUSINESS SIGN UP MODAL */}
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)} 
        onSignUpSuccess={(ownerData) => {
          setIsLoggedIn(true);
          localStorage.setItem('suvarna_logged_in', 'true');
          setUserRole('owner');
          localStorage.setItem('suvarna_user_role', 'owner');
          setCurrentOwner(ownerData);
          localStorage.setItem('suvarna_current_owner', JSON.stringify(ownerData));
          setIsImpersonating(false);
          localStorage.removeItem('suvarna_is_impersonating');
          setView('dashboard');
        }}
      />

      {/* PRODUCT TOUR MODAL */}
      {isTourOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gold-100 text-left relative overflow-hidden">
            <button 
              onClick={() => setIsTourOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-flex items-center gap-1 bg-gold-50 border border-gold-200 text-gold-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-4">
              <Play className="w-3.5 h-3.5 fill-gold-500 text-gold-500" /> Guided Software Tour
            </span>

            <h4 className="text-xl font-bold text-slate-800 mb-2">
              {tourSlides[tourStep].title}
            </h4>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded mr-2">
              {tourSlides[tourStep].badge}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold font-mono">
              {tourSlides[tourStep].metric}
            </span>

            <p className="text-xs text-slate-500 leading-relaxed my-5 min-h-[70px]">
              {tourSlides[tourStep].description}
            </p>

            {/* Stepper progress dots */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex gap-1.5">
                {tourSlides.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setTourStep(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      tourStep === idx ? 'bg-gold-500 w-6' : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                  ></button>
                ))}
              </div>

              <div className="flex gap-2">
                {tourStep > 0 && (
                  <button 
                    onClick={() => setTourStep(tourStep - 1)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold px-3 py-2"
                  >
                    Back
                  </button>
                )}
                {tourStep < tourSlides.length - 1 ? (
                  <button 
                    onClick={() => setTourStep(tourStep + 1)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    Next Slide
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setIsTourOpen(false);
                      setIsDemoModalOpen(true);
                    }}
                    className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs px-5 py-2 rounded-xl shadow shadow-gold-500/10 transition-colors"
                  >
                    Book Full Demo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOVEREIGN ACOUSTIC & LIVE TOAST HUB */}
      <LiveToastHub />

    </div>
  );
}
