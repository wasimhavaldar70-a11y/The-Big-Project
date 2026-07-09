import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Users, Scale, AlertTriangle, Search, Plus, Bell, ShieldCheck,
  ChevronDown, Settings, Calendar, LogOut, CheckCircle, HelpCircle, Phone, 
  Layers, CreditCard, Landmark, DollarSign, Eye, MoreVertical, X, Sparkles,
  Award, Briefcase, FileText, CheckCircle2, RefreshCw, Smartphone, ArrowRight,
  Pencil, Camera, Upload, User
} from 'lucide-react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { ShopOwner } from './LoginModal';

// Helper for formatting Indian Currency (INR)
const formatINR = (num: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export default function Dashboard({ 
  onBackToLanding,
  onLogout,
  currentOwner
}: { 
  onBackToLanding: () => void;
  onLogout?: () => void;
  currentOwner?: ShopOwner | null;
}) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      onBackToLanding();
    }
  };

  // Navigation tabs in sidebar
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [portfolioTab, setPortfolioTab] = useState<'disbursed' | 'outstanding' | 'interest'>('disbursed');
  const [calcWeight, setCalcWeight] = useState('10');
  const [calcPurity, setCalcPurity] = useState<'24K' | '22K' | '20K' | '18K'>('22K');
  const [calcLtv, setCalcLtv] = useState('75');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Shop Owner Profile Customization States
  const [ownerAvatar, setOwnerAvatar] = useState<string>(() => {
    const stored = localStorage.getItem(`suvarna_owner_avatar_${currentOwner?.id || 'default'}`);
    return stored || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
  });
  const [ownerName, setOwnerName] = useState<string>(() => {
    return currentOwner?.ownerName || "Rajesh Verma";
  });
  const [isEditOwnerProfileOpen, setIsEditOwnerProfileOpen] = useState(false);

  useEffect(() => {
    if (currentOwner) {
      setOwnerName(currentOwner.ownerName || "Rajesh Verma");
      const stored = localStorage.getItem(`suvarna_owner_avatar_${currentOwner.id}`);
      if (stored) {
        setOwnerAvatar(stored);
      } else {
        setOwnerAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80");
      }
    }
  }, [currentOwner]);

  // Supabase Auth and State Status
  const [dbStatus, setDbStatus] = useState<'unconfigured' | 'connecting' | 'connected' | 'error'>('unconfigured');
  const [usingDemo, setUsingDemo] = useState(true);

  // Automated Interest Disbursal & Ledger States
  const [interestSubTab, setInterestSubTab] = useState<'calculator' | 'slabs' | 'batch'>('calculator');
  const [slabs, setSlabs] = useState([
    { id: 1, name: 'Sovereign Low Rate', minAmount: 0, maxAmount: 100000, rate: 0.9, description: 'Premium tier for standard pledges' },
    { id: 2, name: 'Standard Liquidity', minAmount: 100001, maxAmount: 300000, rate: 1.2, description: 'Optimized standard RBI regulatory compliance tier' },
    { id: 3, name: 'Bullet Repayment', minAmount: 300001, maxAmount: 10000000, rate: 1.5, description: 'High-liquidity bullet interest premium rate tier' }
  ]);
  const [isAccruingLedger, setIsAccruingLedger] = useState(false);
  const [accrualLog, setAccrualLog] = useState<string[]>([]);
  const [accrualProgress, setAccrualProgress] = useState(0);

  // Live gold rates state
  const [goldRates, setGoldRates] = useState({
    '24K': 7350,
    '22K': 6735,
    '20K': 6120,
    '18K': 5510
  });

  // Main list of loans
  const [loans, setLoans] = useState<any[]>([]);

  // Recent Activity State
  const [activities, setActivities] = useState<any[]>([]);

  // Form states for creating a new loan
  const [newLoanForm, setNewLoanForm] = useState({
    customerName: '',
    phone: '',
    aadhaar: '',
    pan: '',
    amount: '',
    weight: '',
    purity: '22K' as '24K' | '22K' | '18K',
    pledgedItem: '',
    interestRate: '1.2'
  });

  // ERP Settings & Configuration State (Linked dynamically)
  const [settings, setSettings] = useState(() => {
    return {
      shopName: currentOwner?.shopName || 'Suvarna Gold Loan & Jewellery Co.',
      defaultInterestRate: '1.2',
      maxLtvRatio: '85',
      gracePeriodDays: '7',
      autoSmsAlerts: true,
      secureBackup: true
    };
  });

  useEffect(() => {
    if (currentOwner) {
      setSettings(prev => ({
        ...prev,
        shopName: currentOwner.shopName
      }));
    }
  }, [currentOwner]);

  // Active Customers State
  const [customers, setCustomers] = useState<any[]>([]);

  const [isAddCustOpen, setIsAddCustOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    aadhaar: '',
    pan: '',
    avatar: '',
    kycStatus: 'Pending'
  });

  // Payments Ledger State
  const [payments, setPayments] = useState<any[]>([]);

  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [newPaymentForm, setNewPaymentForm] = useState({
    loanId: '',
    amount: '',
    type: 'Interest',
    mode: 'UPI'
  });

  // Pledged Items / Locker Vault State
  const [pledgedItems, setPledgedItems] = useState<any[]>([]);

  // Employees Roster State
  const [employees, setEmployees] = useState<any[]>([]);

  const [isAddEmpOpen, setIsAddEmpOpen] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState({
    name: '',
    role: 'Loan Officer',
    phone: '',
    branch: 'Mumbai Main Branch'
  });

  // Branches State
  const [branches, setBranches] = useState<any[]>([]);

  // Notifications Log State
  const [notifications, setNotifications] = useState<any[]>([]);

  // Printable Invoice & Appraisal Certificate Modal State
  const [activeInvoice, setActiveInvoice] = useState<any>(null);

  // Dispatch active channels for Monthly Invoicing
  const [channels, setChannels] = useState({
    whatsapp: true,
    sms: true,
    email: false
  });
  const [isSending, setIsSending] = useState(false);
  const [sendingStep, setSendingStep] = useState('');
  const [sendCompleted, setSendCompleted] = useState(false);

  // Bulk dispatch state variables for automated invoicing
  const [isSendingAll, setIsSendingAll] = useState(false);
  const [bulkSendCount, setBulkSendCount] = useState(0);
  const [bulkSendStep, setBulkSendStep] = useState('');

  const handleSendInvoice = () => {
    if (!activeInvoice) return;
    setIsSending(true);
    setSendCompleted(false);
    
    setSendingStep("Generating secure PDF...");
    setTimeout(() => {
      setSendingStep("Attaching gold appraisal photos & purity certificate...");
      setTimeout(() => {
        setSendingStep("Signing cryptographic transaction payload...");
        setTimeout(() => {
          setSendingStep("Routing via Suvarna Telecom APIs...");
          setTimeout(() => {
            setIsSending(false);
            setSendCompleted(true);
            
            const activeChanText = Object.entries(channels)
              .filter(([_, enabled]) => enabled)
              .map(([name]) => name.toUpperCase())
              .join(" & ");
            
            const newAct = {
              id: `act-${Date.now()}`,
              text: `Monthly Invoice ${activeInvoice.id} sent to ${activeInvoice.customerName} via ${activeChanText}`,
              amount: null,
              time: 'Just now',
              type: 'invoice'
            };
            setActivities([newAct, ...activities]);
            
            const newNotif = {
              id: `NTF-${Math.floor(100 + Math.random() * 900)}`,
              type: 'system',
              message: `Monthly Invoice ${activeInvoice.id} delivered successfully to ${activeInvoice.customerName}.`,
              severity: 'low',
              unread: true,
              date: 'Just now'
            };
            setNotifications([newNotif, ...notifications]);
          }, 850);
        }, 900);
      }, 900);
    }, 900);
  };

  // Interest Rates Simulator State
  const [interestCalc, setInterestCalc] = useState({
    selectedLoanId: 'SL-2024-1050',
    elapsedDays: '30',
    customRate: ''
  });

  // Attempt to sync and fetch with Supabase
  useEffect(() => {
    async function loadSupabaseData() {
      localStorage.removeItem('suvarna_loans');
      localStorage.removeItem('suvarna_shop_owners');
      if (isSupabaseConfigured) {
        setDbStatus('connecting');
        const supabase = getSupabase();
        if (supabase) {
          try {
            // Check connection by querying or inserting
            const { data: customerData, error: custError } = await supabase
              .from('customers')
              .select('*')
              .limit(1);

            if (custError) {
              console.warn("Supabase query error (tables might not be created yet):", custError);
              setDbStatus('error');
              setUsingDemo(true);
            } else {
              setDbStatus('connected');
              setUsingDemo(false);
              // Fetch real data from Supabase if table exists
              const { data: fetchedLoans } = await supabase
                .from('gold_loans')
                .select('*')
                .order('created_at', { ascending: false });

              if (fetchedLoans && fetchedLoans.length > 0) {
                setLoans(fetchedLoans.map((l: any) => ({
                  id: l.id,
                  customerName: l.customer_name,
                  amount: Number(l.amount),
                  weight: Number(l.weight),
                  purity: l.purity,
                  pledgedItem: l.pledged_item,
                  loanDate: l.created_at ? new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today',
                  dueDate: l.due_date,
                  status: l.status
                })));
              }

              const { data: fetchedCustomers, error: custFetchError } = await supabase
                .from('customers')
                .select('*')
                .order('created_at', { ascending: false });

              if (!custFetchError && fetchedCustomers) {
                setCustomers(fetchedCustomers.map((c: any) => ({
                  id: c.id,
                  name: c.name,
                  phone: c.phone,
                  email: c.email || `${c.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
                  address: c.address || 'Registered during Gold Loan pledge',
                  aadhaar: c.aadhaar || '',
                  pan: c.pan || '',
                  avatar: c.avatar || '',
                  kycStatus: c.kyc_status || 'Pending',
                  activeLoans: c.active_loans_count || 0,
                  registeredAt: c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'
                })));
              }
            }
          } catch (e) {
            console.error("Supabase failed:", e);
            setDbStatus('error');
            setUsingDemo(true);
          }
        }
      } else {
        setDbStatus('unconfigured');
        setUsingDemo(true);
      }
    }
    loadSupabaseData();
  }, []);

  // Sync state back to localStorage for seamless local testing
  useEffect(() => {
    if (!isSupabaseConfigured || dbStatus !== 'connected') {
      const savedLoans = localStorage.getItem('suvarna_loans');
      if (savedLoans) {
        setLoans(JSON.parse(savedLoans));
      }
    }
  }, [dbStatus]);

  // Submit Handler for New Loan
  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoanForm.customerName || !newLoanForm.amount || !newLoanForm.weight) {
      alert("Please fill in Name, Amount, and Gold Weight.");
      return;
    }

    const loanId = `SL-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    const formattedDueDate = nextMonth.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const newLoanObj = {
      id: loanId,
      customerName: newLoanForm.customerName,
      phone: newLoanForm.phone || '+91 99999 99999',
      aadhaar: newLoanForm.aadhaar || '',
      pan: newLoanForm.pan || '',
      amount: parseFloat(newLoanForm.amount),
      weight: parseFloat(newLoanForm.weight),
      purity: newLoanForm.purity,
      pledgedItem: newLoanForm.pledgedItem || 'Gold jewelry packet',
      loanDate: formattedDate,
      dueDate: formattedDueDate,
      status: 'Active'
    };

    // Update state & localStorage
    const updatedLoans = [newLoanObj, ...loans];
    setLoans(updatedLoans);
    localStorage.setItem('suvarna_loans', JSON.stringify(updatedLoans));

    // Also auto-register as customer if not already in customers registry
    const customerExists = customers.some(c => c.name.toLowerCase() === newLoanObj.customerName.toLowerCase());
    if (!customerExists) {
      const autoCustObj = {
        id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
        name: newLoanObj.customerName,
        phone: newLoanObj.phone,
        email: `${newLoanObj.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        address: 'Registered during Gold Loan pledge',
        aadhaar: newLoanObj.aadhaar,
        pan: newLoanObj.pan,
        kycStatus: (newLoanObj.aadhaar || newLoanObj.pan) ? 'Verified' : 'Pending',
        activeLoans: 1,
        registeredAt: formattedDate
      };
      setCustomers([autoCustObj, ...customers]);
    } else {
      setCustomers(customers.map(c => {
        if (c.name.toLowerCase() === newLoanObj.customerName.toLowerCase()) {
          return {
            ...c,
            activeLoans: (c.activeLoans || 0) + 1,
            aadhaar: c.aadhaar || newLoanObj.aadhaar,
            pan: c.pan || newLoanObj.pan
          };
        }
        return c;
      }));
    }

    // Update Activities log
    const newActivity = {
      id: `act-${Date.now()}`,
      text: `New loan created for ${newLoanObj.customerName}`,
      amount: newLoanObj.amount,
      time: 'Just now',
      type: 'loan'
    };
    setActivities([newActivity, ...activities]);

    // If Supabase is configured, write to Cloud Database
    if (isSupabaseConfigured && dbStatus === 'connected') {
      const supabase = getSupabase();
      if (supabase) {
        try {
          // 1. Create/Retrieve Customer ID
          const { data, error: custError } = await (supabase
            .from('customers')
            .insert({
              name: newLoanObj.customerName,
              phone: newLoanObj.phone,
              kyc_status: 'Verified',
              active_loans_count: 1,
              total_pledged_weight: newLoanObj.weight,
              total_loan_amount: newLoanObj.amount
            } as any)
            .select()
            .single() as any);

          const customerRecord = data as any;

          if (customerRecord) {
            // 2. Insert Gold Loan
            await (supabase.from('gold_loans').insert({
              id: newLoanObj.id,
              customer_name: newLoanObj.customerName,
              customer_id: customerRecord.id,
              amount: newLoanObj.amount,
              interest_rate: parseFloat(newLoanForm.interestRate),
              weight: newLoanObj.weight,
              purity: newLoanObj.purity,
              pledged_item: newLoanObj.pledgedItem,
              due_date: newLoanObj.dueDate,
              status: 'Active'
            } as any) as any);
          }
        } catch (error) {
          console.error("Failed to write to Supabase:", error);
        }
      }
    }

    // Reset Form
    setNewLoanForm({
      customerName: '',
      phone: '',
      aadhaar: '',
      pan: '',
      amount: '',
      weight: '',
      purity: '22K',
      pledgedItem: '',
      interestRate: '1.2'
    });
    setIsNewLoanOpen(false);

    // Dispatch Sovereign Sound Chime & Live Toast Alert
    window.dispatchEvent(new CustomEvent('triggerSuvarnaToast', {
      detail: {
        title: '🔒 Secure Pledge Packet Seal',
        description: `Loan ${loanId} registered for ${newLoanForm.customerName}. Gold packet verified, sealed, and vaulted.`,
        type: 'vault'
      }
    }));
  };

  // Filter Loans based on search query
  const filteredLoans = loans.filter(loan => 
    loan.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.pledgedItem.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute stats dynamically from the state
  const totalLoanPortfolio = loans.reduce((acc, curr) => curr.status !== 'Closed' ? acc + curr.amount : acc, 0);
  const totalCustomers = Array.from(new Set(loans.map(l => l.customerName))).length + 1243; // Added to baseline
  const totalGoldWeight = loans.reduce((acc, curr) => curr.status !== 'Closed' ? acc + curr.weight : acc, 0) / 1000 + 12.4; // conversion to kg + baseline
  const totalOutstanding = totalLoanPortfolio * 0.51; // baseline estimate

  // Tab content routing function
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Customers': {
        const verifiedCount = customers.filter(c => c.kycStatus === 'Verified').length;
        const pendingCount = customers.filter(c => c.kycStatus === 'Pending').length;
        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#0A1A36]">Customer Registry</h3>
                <p className="text-xs text-slate-400">Manage customer credentials, contact info, and KYC statuses</p>
              </div>
              <button
                onClick={() => setIsAddCustOpen(true)}
                className="flex items-center gap-1.5 self-start bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-4 py-2 rounded-xl text-xs font-black shadow-md hover:opacity-90 transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Customer</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Registered</span>
                <p className="text-xl font-black text-[#0A1A36] mt-1">{customers.length + 1243}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">KYC Verified</span>
                <p className="text-xl font-black text-emerald-600 mt-1">{verifiedCount + 1210}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">KYC Pending / Rejected</span>
                <p className="text-xl font-black text-amber-500 mt-1">{pendingCount + 33}</p>
              </div>
            </div>

            {/* Customer List */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
                <h4 className="text-sm font-black text-[#0A1A36]">Active Accounts</h4>
                <div className="relative w-48 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-amber-400 font-bold"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2.5">ID</th>
                      <th className="pb-2.5">Name</th>
                      <th className="pb-2.5">Phone & Email</th>
                      <th className="pb-2.5">KYC Documents</th>
                      <th className="pb-2.5">Address</th>
                      <th className="pb-2.5">Active Loans</th>
                      <th className="pb-2.5">KYC Status</th>
                      <th className="pb-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                    {customers
                      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((cust) => (
                        <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 font-bold text-slate-400">{cust.id}</td>
                          <td className="py-3.5 font-extrabold text-[#0B1E43]">
                            <div className="flex items-center gap-2.5">
                              {cust.avatar ? (
                                <img 
                                  src={cust.avatar} 
                                  alt={cust.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-xs shrink-0" 
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 text-[#D28F1B] flex items-center justify-center font-black text-xs shrink-0 uppercase">
                                  {cust.name ? cust.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2) : 'CU'}
                                </div>
                              )}
                              <span>{cust.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <span className="block font-bold">{cust.phone}</span>
                            <span className="text-[10px] text-slate-400">{cust.email}</span>
                          </td>
                          <td className="py-3.5">
                            {cust.aadhaar || cust.pan ? (
                              <div className="space-y-1">
                                {cust.aadhaar && (
                                  <span className="block text-[10px] text-slate-600 font-bold">
                                    🪪 {cust.aadhaar.replace(/(\d{4})/g, '$1 ').trim()}
                                  </span>
                                )}
                                {cust.pan && (
                                  <span className="block text-[10px] text-[#D28F1B] font-extrabold uppercase">
                                    💳 {cust.pan}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[10px]">None provided</span>
                            )}
                          </td>
                          <td className="py-3.5 text-slate-500 max-w-xs truncate">{cust.address}</td>
                          <td className="py-3.5">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-black rounded-md">{cust.activeLoans}</span>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                              cust.kycStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              cust.kycStatus === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                              {cust.kycStatus}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="flex justify-end items-center gap-1.5">
                              {cust.activeLoans > 0 && (
                                <button
                                  onClick={() => {
                                    const matchingLoan = loans.find(l => l.customerName === cust.name);
                                    setActiveInvoice({
                                      id: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
                                      loanId: matchingLoan?.id || 'SL-2024-1050',
                                      customerName: cust.name,
                                      phone: cust.phone,
                                      email: cust.email,
                                      aadhaar: cust.aadhaar,
                                      pan: cust.pan,
                                      item: matchingLoan?.pledgedItem || 'Gold Ornaments',
                                      totalWeight: matchingLoan ? `${matchingLoan.weight} gm` : '25.3 gm',
                                      principal: matchingLoan?.amount || 125000,
                                      date: matchingLoan?.loanDate || '20 May 2024'
                                    });
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-[#D28F1B] border border-amber-100/30 rounded-md text-[10px] font-bold transition-all"
                                  title="Send Monthly Invoice"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Bill Dues</span>
                                </button>
                              )}
                              {cust.kycStatus !== 'Verified' && (
                                <button
                                  onClick={async () => {
                                    if (isSupabaseConfigured && dbStatus === 'connected') {
                                      const supabase = getSupabase();
                                      if (supabase) {
                                        try {
                                          await supabase.from('customers').update({ kyc_status: 'Verified' }).eq('id', cust.id);
                                        } catch (err) {
                                          console.error("Supabase KYC approval failed:", err);
                                        }
                                      }
                                    }

                                    const updated = customers.map(c => c.id === cust.id ? { ...c, kycStatus: 'Verified' } : c);
                                    setCustomers(updated);
                                    setActivities([{ id: `act-${Date.now()}`, text: `KYC Approved for ${cust.name}`, amount: null, time: 'Just now', type: 'update' }, ...activities]);
                                  }}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-md text-[10px] font-bold"
                                >
                                  Approve KYC
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingCustomer(cust);
                                }}
                                className="p-1 text-slate-400 hover:text-amber-500 hover:bg-slate-100 rounded-md"
                                title="Edit Profile & Picture"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  alert(`Customer Profile:\n\nID: ${cust.id}\nName: ${cust.name}\nPhone: ${cust.phone}\nEmail: ${cust.email}\nAddress: ${cust.address}\nKYC Status: ${cust.kycStatus}`);
                                }}
                                className="p-1 text-slate-400 hover:text-[#0A1A36] hover:bg-slate-100 rounded-md"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Customer Modal */}
            <AnimatePresence>
              {isAddCustOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-[#0A1A36]/60 backdrop-blur-xs" onClick={() => setIsAddCustOpen(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl max-w-md w-full p-6 relative z-10 shadow-2xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-black text-[#0A1A36] flex items-center gap-2">
                        <Users className="w-4.5 h-4.5 text-[#D28F1B]" />
                        Register New Customer
                      </h3>
                      <button onClick={() => setIsAddCustOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newCustForm.name || !newCustForm.phone) {
                          alert("Please fill in Name and Phone Number.");
                          return;
                        }

                        let newCustId = `CUST-${Math.floor(100 + Math.random() * 900)}`;

                        if (isSupabaseConfigured && dbStatus === 'connected') {
                          const supabase = getSupabase();
                          if (supabase) {
                            try {
                              const dbCust = {
                                name: newCustForm.name,
                                phone: newCustForm.phone,
                                kyc_status: newCustForm.kycStatus,
                                active_loans_count: 0,
                                total_pledged_weight: 0,
                                total_loan_amount: 0,
                                avatar: newCustForm.avatar || ''
                              };
                              const { data, error } = await supabase.from('customers').insert(dbCust).select().single();
                              if (!error && data) {
                                newCustId = data.id;
                              } else if (error) {
                                console.error("Supabase customer insert error:", error);
                              }
                            } catch (err) {
                              console.error("Supabase customer insert failed:", err);
                            }
                          }
                        }

                        const newCust = {
                          id: newCustId,
                          name: newCustForm.name,
                          phone: newCustForm.phone,
                          email: newCustForm.email || 'no-email@suvarna.com',
                          address: newCustForm.address || 'Not Provided',
                          aadhaar: newCustForm.aadhaar || '',
                          pan: newCustForm.pan || '',
                          avatar: newCustForm.avatar || '',
                          kycStatus: newCustForm.kycStatus,
                          activeLoans: 0,
                          registeredAt: 'Today'
                        };
                        setCustomers([newCust, ...customers]);
                        setActivities([{ id: `act-${Date.now()}`, text: `Registered customer ${newCust.name}`, amount: null, time: 'Just now', type: 'update' }, ...activities]);
                        setNewCustForm({ name: '', phone: '', email: '', address: '', aadhaar: '', pan: '', avatar: '', kycStatus: 'Pending' });
                        setIsAddCustOpen(false);
                      }}
                      className="space-y-4 pt-4"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Customer Profile Picture</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                          <div className="relative group shrink-0">
                            {newCustForm.avatar ? (
                              <img 
                                src={newCustForm.avatar} 
                                alt="Preview" 
                                referrerPolicy="no-referrer"
                                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-sm" 
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-black text-xl border-2 border-slate-100 uppercase">
                                {newCustForm.name ? newCustForm.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'CU'}
                              </div>
                            )}
                            <label className="absolute inset-0 bg-[#0A1A36]/70 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                              <Camera className="w-4 h-4 mb-0.5 text-amber-400" />
                              <span className="text-[7px] font-extrabold uppercase tracking-widest">Upload</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setNewCustForm({ ...newCustForm, avatar: reader.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          
                          <div className="space-y-1 w-full">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block">Or Quick Select Preset Premium Avatars:</span>
                            <div className="flex flex-wrap gap-2">
                              {[
                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
                                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
                                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
                                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
                                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
                                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80'
                              ].map((url, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setNewCustForm({ ...newCustForm, avatar: url })}
                                  className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all hover:scale-105 shrink-0 ${newCustForm.avatar === url ? 'border-amber-500 ring-2 ring-amber-300' : 'border-slate-100 hover:border-slate-400'}`}
                                >
                                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </button>
                              ))}
                              {newCustForm.avatar && (
                                <button
                                  type="button"
                                  onClick={() => setNewCustForm({ ...newCustForm, avatar: '' })}
                                  className="text-[9px] font-black text-rose-500 hover:underline hover:text-rose-600 transition-colors uppercase ml-1"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                            <p className="text-[8px] text-slate-400">Supports PNG, JPG, or any drag & drop files.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Customer Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newCustForm.name}
                          onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                          placeholder="e.g. Anand Shinde"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={newCustForm.phone}
                          onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                          placeholder="e.g. +91 95451 00221"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                        <input
                          type="email"
                          value={newCustForm.email}
                          onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                          placeholder="e.g. anand@gmail.com"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Aadhaar Number (12 Digits)</label>
                          <input
                            type="text"
                            maxLength={12}
                            pattern="\d{12}"
                            title="Aadhaar number must be exactly 12 digits"
                            value={newCustForm.aadhaar}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setNewCustForm({ ...newCustForm, aadhaar: val });
                            }}
                            className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                            placeholder="e.g. 453298127432"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">PAN Number (10 Alphanumeric)</label>
                          <input
                            type="text"
                            maxLength={10}
                            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                            title="PAN card number format: e.g. ABCDE1234F"
                            value={newCustForm.pan}
                            onChange={(e) => setNewCustForm({ ...newCustForm, pan: e.target.value.toUpperCase() })}
                            className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold uppercase"
                            placeholder="e.g. AHGPS9012K"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Residential Address</label>
                        <textarea
                          value={newCustForm.address}
                          onChange={(e) => setNewCustForm({ ...newCustForm, address: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold h-20 resize-none"
                          placeholder="e.g. Flat 402, Royal Residency, Dadar West"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Initial KYC Status</label>
                        <select
                          value={newCustForm.kycStatus}
                          onChange={(e) => setNewCustForm({ ...newCustForm, kycStatus: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                        >
                          <option value="Pending">Pending Audit</option>
                          <option value="Verified">Verified Instantly (Aadhaar Match)</option>
                        </select>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAddCustOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancel</button>
                        <button type="submit" className="bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-5 py-2.5 rounded-xl text-xs font-black uppercase">Create Profile</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Edit Customer Profile & Picture Modal */}
            <AnimatePresence>
              {editingCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-[#0A1A36]/60 backdrop-blur-xs" onClick={() => setEditingCustomer(null)}></div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl max-w-md w-full p-6 relative z-10 shadow-2xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-black text-[#0A1A36] flex items-center gap-2">
                        <Pencil className="w-4.5 h-4.5 text-[#D28F1B]" />
                        Edit Customer Profile
                      </h3>
                      <button onClick={() => setEditingCustomer(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!editingCustomer.name || !editingCustomer.phone) {
                          alert("Name and Phone Number are required.");
                          return;
                        }

                        if (isSupabaseConfigured && dbStatus === 'connected') {
                          const supabase = getSupabase();
                          if (supabase) {
                            try {
                              await supabase.from('customers').update({
                                name: editingCustomer.name,
                                phone: editingCustomer.phone,
                                kyc_status: editingCustomer.kycStatus,
                                avatar: editingCustomer.avatar || ''
                              }).eq('id', editingCustomer.id);
                            } catch (err) {
                              console.error("Supabase customer update failed:", err);
                            }
                          }
                        }

                        const updated = customers.map(c => c.id === editingCustomer.id ? editingCustomer : c);
                        setCustomers(updated);
                        setActivities([{ 
                          id: `act-${Date.now()}`, 
                          text: `Updated profile & picture of customer ${editingCustomer.name}`, 
                          amount: null, 
                          time: 'Just now', 
                          type: 'update' 
                        }, ...activities]);
                        setEditingCustomer(null);
                      }}
                      className="space-y-4 pt-4 overflow-y-auto max-h-[75vh] pr-1"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Customer Profile Picture</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                          <div className="relative group shrink-0">
                            {editingCustomer.avatar ? (
                              <img 
                                src={editingCustomer.avatar} 
                                alt="Preview" 
                                referrerPolicy="no-referrer"
                                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-sm" 
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-black text-xl border-2 border-slate-100 uppercase">
                                {editingCustomer.name ? editingCustomer.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'CU'}
                              </div>
                            )}
                            <label className="absolute inset-0 bg-[#0A1A36]/70 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                              <Camera className="w-4 h-4 mb-0.5 text-amber-400" />
                              <span className="text-[7px] font-extrabold uppercase tracking-widest">Upload</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setEditingCustomer({ ...editingCustomer, avatar: reader.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          
                          <div className="space-y-1 w-full">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block">Or Quick Select Preset Premium Avatars:</span>
                            <div className="flex flex-wrap gap-2">
                              {[
                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
                                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
                                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
                                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
                                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
                                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80'
                              ].map((url, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setEditingCustomer({ ...editingCustomer, avatar: url })}
                                  className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all hover:scale-105 shrink-0 ${editingCustomer.avatar === url ? 'border-amber-500 ring-2 ring-amber-300' : 'border-slate-100 hover:border-slate-400'}`}
                                >
                                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </button>
                              ))}
                              {editingCustomer.avatar && (
                                <button
                                  type="button"
                                  onClick={() => setEditingCustomer({ ...editingCustomer, avatar: '' })}
                                  className="text-[9px] font-black text-rose-500 hover:underline hover:text-rose-600 transition-colors uppercase ml-1"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                            <p className="text-[8px] text-slate-400">Supports JPG, PNG file uploads or instant click presets.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Customer Full Name *</label>
                        <input
                          type="text"
                          required
                          value={editingCustomer.name}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                          placeholder="e.g. Anand Shinde"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={editingCustomer.phone}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                          placeholder="e.g. +91 95451 00221"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                        <input
                          type="email"
                          value={editingCustomer.email || ''}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                          placeholder="e.g. anand@gmail.com"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Aadhaar Number (12 Digits)</label>
                          <input
                            type="text"
                            maxLength={12}
                            pattern="\d{12}"
                            title="Aadhaar number must be exactly 12 digits"
                            value={editingCustomer.aadhaar || ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setEditingCustomer({ ...editingCustomer, aadhaar: val });
                            }}
                            className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                            placeholder="e.g. 453298127432"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">PAN Number (10 Alphanumeric)</label>
                          <input
                            type="text"
                            maxLength={10}
                            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                            title="PAN card number format: e.g. ABCDE1234F"
                            value={editingCustomer.pan || ''}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, pan: e.target.value.toUpperCase() })}
                            className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold uppercase"
                            placeholder="e.g. AHGPS9012K"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Residential Address</label>
                        <textarea
                          value={editingCustomer.address || ''}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold h-20 resize-none"
                          placeholder="e.g. Flat 402, Royal Residency, Dadar West"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">KYC Status</label>
                        <select
                          value={editingCustomer.kycStatus || 'Pending'}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, kycStatus: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                        >
                          <option value="Pending">Pending Audit</option>
                          <option value="Verified">Verified</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setEditingCustomer(null)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancel</button>
                        <button type="submit" className="bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-5 py-2.5 rounded-xl text-xs font-black uppercase">Save Changes</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      case 'Gold Loans': {
        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#0A1A36]">Gold Loan Ledger</h3>
                <p className="text-xs text-slate-400">Manage open pledge books, interest, and status updates</p>
              </div>
              <button
                onClick={() => setIsNewLoanOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-4.5 py-2 rounded-xl text-xs font-black shadow-md hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>New Gold Loan</span>
              </button>
            </div>

            {/* Filter controls */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Active', 'Overdue', 'Closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSearchQuery(status === 'All' ? '' : status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        (searchQuery === status || (status === 'All' && !searchQuery))
                          ? 'bg-[#0A1A36] text-white'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <div className="relative w-48 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search by ID or customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-amber-400 font-bold"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2.5">Loan ID</th>
                      <th className="pb-2.5">Customer Name</th>
                      <th className="pb-2.5">Pledge Item</th>
                      <th className="pb-2.5">Appraisal Weight</th>
                      <th className="pb-2.5">Sanctioned Amount</th>
                      <th className="pb-2.5">Due Date</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                    {loans
                      .filter(l => 
                        l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.status.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((loan) => (
                        <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 font-bold text-[#D28F1B]">{loan.id}</td>
                          <td className="py-3.5">
                            <span className="block font-extrabold text-[#0B1E43]">{loan.customerName}</span>
                            <span className="text-[10px] text-slate-400">{loan.phone}</span>
                          </td>
                          <td className="py-3.5 font-bold">{loan.pledgedItem}</td>
                          <td className="py-3.5 font-bold text-slate-500">{loan.weight} gm <span className="text-[10px] text-slate-400">({loan.purity})</span></td>
                          <td className="py-3.5 font-black text-[#0A1A36]">{formatINR(loan.amount)}</td>
                          <td className="py-3.5 text-slate-400">{loan.dueDate}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                              loan.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              loan.status === 'Overdue' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'bg-slate-50 text-slate-400 border border-slate-100'
                            }`}>
                              {loan.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="flex justify-end gap-1.5">
                              {loan.status !== 'Closed' && (
                                <>
                                  <button
                                    onClick={() => {
                                      const updated = loans.map(l => l.id === loan.id ? { ...l, status: 'Closed' } : l);
                                      setLoans(updated);
                                      setActivities([{ id: `act-${Date.now()}`, text: `Loan ${loan.id} closed & items released`, amount: loan.amount, time: 'Just now', type: 'payment' }, ...activities]);
                                    }}
                                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-md text-[10px] font-bold"
                                  >
                                    Release / Close
                                  </button>
                                  {loan.status !== 'Overdue' && (
                                    <button
                                      onClick={() => {
                                        const updated = loans.map(l => l.id === loan.id ? { ...l, status: 'Overdue' } : l);
                                        setLoans(updated);
                                        setActivities([{ id: `act-${Date.now()}`, text: `Loan ${loan.id} flagged as OVERDUE`, amount: null, time: 'Just now', type: 'update' }, ...activities]);
                                      }}
                                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-100 rounded-md text-[10px] font-bold"
                                    >
                                      Mark Overdue
                                    </button>
                                  )}
                                </>
                              )}
                              <button
                                onClick={() => {
                                  const customerInfo = customers.find(c => c.name.toLowerCase() === loan.customerName.toLowerCase());
                                  setActiveInvoice({
                                    id: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
                                    loanId: loan.id,
                                    customerName: loan.customerName,
                                    phone: loan.phone || customerInfo?.phone,
                                    email: customerInfo?.email,
                                    aadhaar: loan.aadhaar || customerInfo?.aadhaar,
                                    pan: loan.pan || customerInfo?.pan,
                                    item: loan.pledgedItem,
                                    totalWeight: `${loan.weight} gm`,
                                    principal: loan.amount,
                                    date: loan.loanDate
                                  });
                                }}
                                className="p-1 bg-slate-50 text-slate-500 hover:text-amber-500 hover:bg-amber-50 rounded-md"
                                title="Print appraisal"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'Payments': {
        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#0A1A36]">Collections & Payments Ledger</h3>
                <p className="text-xs text-slate-400">Record customer interest/principal collections and view accounting history</p>
              </div>
              <button
                onClick={() => setIsNewPaymentOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-4 py-2.5 rounded-xl text-xs font-black shadow-md hover:opacity-90 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>Log Repayment</span>
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Collections</span>
                  <p className="text-2xl font-black text-[#0A1A36] mt-1">{formatINR(payments.reduce((acc, curr) => acc + curr.amount, 0) + 72100)}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Settlement Rate</span>
                  <p className="text-2xl font-black text-blue-600 mt-1">94.8%</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Payment List */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <h4 className="text-sm font-black text-[#0A1A36] mb-4">Repayment History</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2.5">Receipt ID</th>
                      <th className="pb-2.5">Loan ID</th>
                      <th className="pb-2.5">Customer</th>
                      <th className="pb-2.5">Collection Type</th>
                      <th className="pb-2.5">Payment Mode</th>
                      <th className="pb-2.5">Date</th>
                      <th className="pb-2.5 text-right">Collected Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 font-bold text-slate-400">{p.id}</td>
                        <td className="py-3 font-bold text-[#D28F1B]">{p.loanId}</td>
                        <td className="py-3 font-extrabold text-[#0B1E43]">{p.customerName}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                            p.type === 'Interest' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {p.type}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-slate-500">{p.mode}</td>
                        <td className="py-3 text-slate-400">{p.date}</td>
                        <td className="py-3 text-right font-black text-[#0A1A36]">{formatINR(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Log Repayment Modal */}
            <AnimatePresence>
              {isNewPaymentOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-[#0A1A36]/60 backdrop-blur-xs" onClick={() => setIsNewPaymentOpen(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl max-w-md w-full p-6 relative z-10 shadow-2xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-black text-[#0A1A36] flex items-center gap-2">
                        <CreditCard className="w-4.5 h-4.5 text-[#D28F1B]" />
                        Log Repayment Receipt
                      </h3>
                      <button onClick={() => setIsNewPaymentOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newPaymentForm.loanId || !newPaymentForm.amount) {
                          alert("Please fill in Loan ID and Payment Amount.");
                          return;
                        }
                        const targetLoan = loans.find(l => l.id === newPaymentForm.loanId);
                        if (!targetLoan) {
                          alert("Selected Loan ID is invalid.");
                          return;
                        }
                        const amt = parseFloat(newPaymentForm.amount);
                        const payId = `PAY-${Math.floor(100 + Math.random() * 900)}`;
                        const newPay = {
                          id: payId,
                          loanId: targetLoan.id,
                          customerName: targetLoan.customerName,
                          amount: amt,
                          type: newPaymentForm.type,
                          mode: newPaymentForm.mode,
                          date: 'Today'
                        };

                        setPayments([newPay, ...payments]);
                        setActivities([
                          { id: `act-${Date.now()}`, text: `${newPay.type} collection from ${newPay.customerName}`, amount: amt, time: 'Just now', type: 'payment' },
                          ...activities
                        ]);

                        // Reduce loan balance if principal is paid
                        if (newPaymentForm.type === 'Principal') {
                          const updated = loans.map(l => {
                            if (l.id === targetLoan.id) {
                              const remaining = Math.max(0, l.amount - amt);
                              return { ...l, amount: remaining, status: remaining === 0 ? 'Closed' : l.status };
                            }
                            return l;
                          });
                          setLoans(updated);
                        }

                        setNewPaymentForm({ loanId: '', amount: '', type: 'Interest', mode: 'UPI' });
                        setIsNewPaymentOpen(false);

                        // Trigger Chime & Toast for Payment Collection
                        window.dispatchEvent(new CustomEvent('triggerSuvarnaToast', {
                          detail: {
                            title: `💰 ${newPay.type} Collection Recorded`,
                            description: `Successfully collected ₹${amt.toLocaleString()} from ${targetLoan.customerName} via ${newPaymentForm.mode}.`,
                            type: 'financial'
                          }
                        }));
                      }}
                      className="space-y-4 pt-4"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Select Active Gold Loan *</label>
                        <select
                          required
                          value={newPaymentForm.loanId}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, loanId: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold text-[#0B1E43]"
                        >
                          <option value="">-- Choose Loan Packet --</option>
                          {loans.filter(l => l.status !== 'Closed').map(l => (
                            <option key={l.id} value={l.id}>{l.id} - {l.customerName} (₹{l.amount.toLocaleString()})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Payment Amount (₹) *</label>
                          <input
                            type="number"
                            required
                            value={newPaymentForm.amount}
                            onChange={(e) => setNewPaymentForm({ ...newPaymentForm, amount: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                            placeholder="e.g. 5000"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Collection Type</label>
                          <select
                            value={newPaymentForm.type}
                            onChange={(e) => setNewPaymentForm({ ...newPaymentForm, type: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                          >
                            <option value="Interest">Interest Collection</option>
                            <option value="Principal">Principal Repayment</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Payment Mode</label>
                        <select
                          value={newPaymentForm.mode}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, mode: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                        >
                          <option value="UPI">UPI (GooglePay / PhonePe)</option>
                          <option value="Cash">Cash Counter</option>
                          <option value="Bank Transfer">NEFT / Bank Transfer</option>
                        </select>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsNewPaymentOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancel</button>
                        <button type="submit" className="bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-5 py-2.5 rounded-xl text-xs font-black uppercase">Post Receipt</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      case 'Interest': {
        const selectedLoan = loans.find(l => l.id === interestCalc.selectedLoanId) || loans[0];
        const monthlyRate = parseFloat(settings.defaultInterestRate);
        const days = parseInt(interestCalc.elapsedDays) || 30;
        const interestEarned = selectedLoan ? Math.round(selectedLoan.amount * (monthlyRate / 100) * (days / 30)) : 0;
        const penaltyCharge = selectedLoan?.status === 'Overdue' ? Math.round(selectedLoan.amount * 0.02) : 0;
        const totalPayable = selectedLoan ? (selectedLoan.amount + interestEarned + penaltyCharge) : 0;

        // Custom simulated trigger for Ledger Accrual
        const startLedgerAccrual = () => {
          setIsAccruingLedger(true);
          setAccrualProgress(0);
          setAccrualLog(['🚀 Initializing Monthly Automated Interest Accrual Cycle...']);

          const steps = [
            { prog: 15, log: '🔍 Scanning active gold loan records in secure vaults...' },
            { prog: 35, log: `📊 Identified 248 active accounts. Aggregated assets: ${formatINR(18245000)}` },
            { prog: 55, log: `⚡ Running daily accrual calculations at default base rate of ${settings.defaultInterestRate}%...` },
            { prog: 75, log: '⚖️ Standardizing 18% GST (Tax) line items for compliance accounting...' },
            { prog: 90, log: '💾 Committing formal journal records into the master financial ledger...' },
            { prog: 100, log: '🎉 Process Complete! Accrued ₹1,48,210 of new interest. Sent 248 WhatsApp alert triggers successfully.' }
          ];

          let currentStepIndex = 0;
          const interval = setInterval(() => {
            setAccrualProgress((prev) => {
              const next = prev + 5;
              if (next >= 100) {
                clearInterval(interval);
                setIsAccruingLedger(false);
                // Log final step
                setAccrualLog(prevLog => [...prevLog, steps[steps.length - 1].log]);
                
                // Add to activities
                setActivities([
                  {
                    id: `act-${Date.now()}`,
                    text: `Executed Bulk Ledger Accrual: Accrued ₹1,48,210 interest for 248 packets`,
                    amount: 148210,
                    time: 'Just now',
                    type: 'interest'
                  },
                  ...activities
                ]);
                return 100;
              }

              // Check if we reached next step criteria
              const currentStep = steps[currentStepIndex];
              if (currentStep && next >= currentStep.prog) {
                setAccrualLog(prevLog => [...prevLog, currentStep.log]);
                currentStepIndex++;
              }

              return next;
            });
          }, 150);
        };

        return (
          <div className="space-y-6 text-left">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-black text-[#0A1A36]">Sovereign Interest & Ledger Suite</h3>
                <p className="text-xs text-slate-400">Configure regulatory slabs, calculate accrued dues, and automate monthly disbursal billing</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 p-2 rounded-2xl">
                <span className="p-1.5 bg-[#DF9F28]/10 text-[#D28F1B] rounded-lg">
                  <Award className="w-4 h-4 text-[#D28F1B]" />
                </span>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">RBI Compliance</p>
                  <p className="text-[11px] font-black text-[#0A1A36]">Sovereign Certified</p>
                </div>
              </div>
            </div>

            {/* High level visual cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Base Monthly Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-[#0A1A36] font-mono">{settings.defaultInterestRate}%</span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full" style={{ width: `${(parseFloat(settings.defaultInterestRate)/3)*100}%` }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Accrued Interest (MTD)</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-emerald-600 font-mono">₹ 14,82,100</span>
                  <span className="text-[10px] text-emerald-500 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded-md leading-none">+12.4%</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-2 font-medium">Automatic daily calculation based on active accounts</p>
              </div>

              <div className="bg-gradient-to-br from-[#0A1A36] to-[#040D1E] text-white border border-slate-800 p-4 rounded-2xl shadow-xs relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
                <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider block mb-1">Active Ledger Packets</span>
                <div className="flex items-baseline gap-1 relative z-10">
                  <span className="text-xl font-black text-white font-mono">248</span>
                  <span className="text-xs text-amber-400 font-bold">Packets Audited</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-2 font-medium">100% compliant with secure vault backups</p>
              </div>
            </div>

            {/* Sub navigation Tabs */}
            <div className="flex border-b border-slate-200">
              {[
                { id: 'calculator', label: 'Accrual Estimator', desc: 'Single Account Projection' },
                { id: 'slabs', label: 'Interest Slabs & Rules', desc: 'Tiered Regulatory Rates' },
                { id: 'batch', label: 'Bulk Ledger Posting', desc: 'Automatic Dispatch Engine' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setInterestSubTab(t.id as any)}
                  className={`flex-1 pb-3 text-center transition-all relative ${
                    interestSubTab === t.id 
                      ? 'text-[#0A1A36] font-black' 
                      : 'text-slate-400 hover:text-slate-600 font-bold'
                  }`}
                >
                  <p className="text-xs uppercase tracking-wide">{t.label}</p>
                  <span className="text-[8px] opacity-60 font-medium block">{t.desc}</span>
                  {interestSubTab === t.id && (
                    <motion.div 
                      layoutId="activeInterestTabIndicator" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Inner Tabs Content */}
            <AnimatePresence mode="wait">
              {interestSubTab === 'calculator' && (
                <motion.div
                  key="calculator-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {/* Interactive Tool */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-black text-[#0A1A36] flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                        Live Packet Accrual Estimator
                      </h4>
                      <span className="text-[9px] font-black text-[#DF9F28] bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                        Real-time Core
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Select Target Loan Packet</label>
                        <select
                          value={interestCalc.selectedLoanId}
                          onChange={(e) => setInterestCalc({ ...interestCalc, selectedLoanId: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold text-[#0B1E43]"
                        >
                          {loans.map(l => (
                            <option key={l.id} value={l.id}>{l.id} - {l.customerName} (₹{l.amount.toLocaleString()})</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Interest Cycle (Days Elapsed)</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={interestCalc.elapsedDays}
                            onChange={(e) => setInterestCalc({ ...interestCalc, elapsedDays: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold pr-12"
                            placeholder="e.g. 30"
                          />
                          <span className="absolute right-3 top-2.5 text-[9px] font-black text-slate-400 uppercase">Days</span>
                        </div>
                      </div>
                    </div>

                    {selectedLoan && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 font-bold">Principal Sanctioned:</span>
                          <span className="font-extrabold text-[#0B1E43]">{formatINR(selectedLoan.amount)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 font-bold">Monthly Interest Rate:</span>
                          <span className="font-extrabold text-[#0B1E43]">{monthlyRate}% / month ({settings.defaultInterestRate}% base)</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 font-bold">Days Elapsing:</span>
                          <span className="font-extrabold text-[#0B1E43] font-mono">{days} days</span>
                        </div>
                        <hr className="border-slate-200/60" />
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 font-bold">Calculated Net Interest:</span>
                          <span className="font-extrabold text-emerald-600 font-mono">₹ {interestEarned.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 font-bold">Compulsory 18% GST (Tax):</span>
                          <span className="font-extrabold text-slate-600 font-mono">₹ {Math.round(interestEarned * 0.18).toLocaleString()}</span>
                        </div>
                        {penaltyCharge > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-amber-500 font-bold">Overdue Penalty (2%):</span>
                            <span className="font-extrabold text-rose-500 font-mono">₹ {penaltyCharge.toLocaleString()}</span>
                          </div>
                        )}
                        <hr className="border-slate-200" />
                        <div className="flex justify-between text-sm bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                          <span className="text-[#0A1A36] font-black">Estimated Total Payable:</span>
                          <span className="font-black text-[#0A1A36] font-mono">
                            {formatINR(totalPayable + Math.round(interestEarned * 0.18))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RBI Slab card */}
                  <div className="bg-[#0A1A36] text-white p-5 rounded-3xl border border-[#1B2B4C]/40 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                        <h4 className="text-sm font-black">RBI-Approved Guidelines</h4>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Suvarna's ERP calculations strictly mirror the regulatory framework specified under Section 45-L of the Reserve Bank of India Act:
                      </p>
                      <div className="space-y-2 text-xs pt-2">
                        <div className="flex justify-between border-b border-white/5 pb-1.5">
                          <span className="text-slate-400 font-medium">Max permissible LTV</span>
                          <span className="font-bold text-amber-400">{settings.maxLtvRatio}% of Valuation</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5">
                          <span className="text-slate-400 font-medium">Standard Grace Period</span>
                          <span className="font-bold text-white">{settings.gracePeriodDays} Days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Default Annual Penalty</span>
                          <span className="font-bold text-rose-400">2% per annum</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[9px] text-slate-400 leading-normal">
                        Calculations use 30-day month division. Overdue interest is compounded with base rate after the standard {settings.gracePeriodDays} days grace period.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {interestSubTab === 'slabs' && (
                <motion.div
                  key="slabs-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-black text-[#0A1A36]">Active Interest Slab Configuration</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Define loan size thresholds and mapped base rates</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                        Slabs Enabled
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {slabs.map((slab) => (
                        <div key={slab.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-left space-y-3 relative group hover:border-amber-400 transition-colors">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                              Slab #{slab.id}
                            </span>
                            <span className="text-sm font-black text-amber-600 font-mono">{slab.rate}%/mo</span>
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-black text-[#0A1A36]">{slab.name}</h5>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                              {slab.minAmount === 0 ? 'Up to' : `${formatINR(slab.minAmount)} -`} {slab.maxAmount > 5000000 ? 'No limit' : formatINR(slab.maxAmount)}
                            </p>
                          </div>

                          <p className="text-[10px] text-slate-500 leading-normal">{slab.description}</p>

                          <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Adjust Rate:</span>
                            <input
                              type="number"
                              step="0.1"
                              value={slab.rate}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setSlabs(slabs.map(s => s.id === slab.id ? { ...s, rate: val } : s));
                              }}
                              className="w-16 text-xs p-1 border border-slate-200 rounded font-bold text-center bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl flex items-center gap-2 text-slate-700">
                      <span className="p-1.5 bg-[#DF9F28]/10 text-[#D28F1B] rounded-lg">
                        <Settings className="w-4 h-4 text-[#D28F1B]" />
                      </span>
                      <p className="text-[11px] font-semibold leading-relaxed">
                        Slab configurations are linked directly to customer pledging cycles. When a pledge amount is posted in the Gold Loans tab, Suvarna dynamically selects the cheapest compliant slab rate for maximum transparency.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {interestSubTab === 'batch' && (
                <motion.div
                  key="batch-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {/* Action Panel */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4 lg:col-span-2 text-left">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                        <h4 className="text-sm font-black text-[#0A1A36]">Monthly Batch Interest Poster</h4>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        Automation Engine
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      SaaS billing operations require batch processing. Compute monthly accrued dues, calculate compliance GST parameters, and dispatch automated alerts directly to active phone numbers in one atomic operation.
                    </p>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Target Ledger Accrual Month</span>
                        <span className="text-xs font-black text-[#0A1A36] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#D28F1B]" />
                          July 2026 Cycle
                        </span>
                      </div>

                      <button
                        onClick={startLedgerAccrual}
                        disabled={isAccruingLedger}
                        className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 select-none cursor-pointer ${
                          isAccruingLedger
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] hover:scale-[1.02] shadow-md shadow-amber-500/10'
                        }`}
                      >
                        {isAccruingLedger ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                            Accruing... {accrualProgress}%
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#0A1A36]" />
                            Trigger Ledger Posting
                          </>
                        )}
                      </button>
                    </div>

                    {/* Progress Bar */}
                    {isAccruingLedger && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-amber-600 uppercase">Posting Interest Ledger Entries...</span>
                          <span className="font-mono text-[10px] font-bold text-amber-600">{accrualProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-150" style={{ width: `${accrualProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Real-time Logs Console */}
                    {accrualLog.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Live Ledger Audit Feed:</span>
                        <div className="bg-slate-900 text-slate-300 font-mono text-[10px] rounded-xl p-3.5 space-y-1 max-h-32 overflow-y-auto leading-relaxed border border-slate-800">
                          {accrualLog.map((log, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="text-[#DF9F28] select-none">&gt;&gt;</span>
                              <span>{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Operational Ledger Status Side Card */}
                  <div className="bg-[#0A1A36] text-white p-5 rounded-3xl border border-[#1B2B4C]/40 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h4 className="text-sm font-black">Ledger Engine Status</h4>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Automated Disbursal cycles run at 00:00 UTC daily. All interest calculations are locked to avoid calculation drift.
                      </p>
                      
                      <div className="space-y-2 text-xs pt-2">
                        <div className="flex justify-between border-b border-white/5 pb-1.5">
                          <span className="text-slate-400">Database Driver</span>
                          <span className="font-bold text-emerald-400">PostgreSQL (Drizzle)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5">
                          <span className="text-slate-400">Calculation Accuracy</span>
                          <span className="font-bold text-white">Decimal (24, 4) ISO-18</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Audit Checksum</span>
                          <span className="font-mono text-amber-400">PASS (SV-LE-77X)</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-400 mt-4 leading-normal">
                      Manual ledger override is logged to complies with auditing acts under GAAP guidelines.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      case 'Invoices': {
        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#0A1A36]">Appraisal Certificates & Invoices</h3>
                <p className="text-xs text-slate-400">Access, preview, and print formal gold valuation certificates and tax receipts</p>
              </div>
              <div className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 self-start">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                <span>Telecom API Status: Online</span>
              </div>
            </div>

            {/* Automated Billing and Monthly Invoice Engine Broadcast Panel */}
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 p-5 rounded-3xl border border-amber-500/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
              <div className="space-y-1.5 max-w-2xl text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-500 text-[#0A1A36] text-[9px] font-black uppercase tracking-wider rounded-md">ERP Core</span>
                  <span className="text-xs font-black text-[#0A1A36]">Monthly Invoice Broadcast Hub</span>
                </div>
                <h4 className="text-sm font-bold text-[#0A1A36]">Send Monthly Gold Loan Invoices to All Active Customers</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Instantly compute monthly interest dues under sovereign guidelines (1.2% base + 18% GST), assemble appraisal certificates, and automatically dispatch PDF links via **WhatsApp API** and **SMS Relay** to all clients with active accounts.
                </p>
              </div>
              
              <div className="shrink-0 text-left md:text-right space-y-2">
                {isSendingAll ? (
                  <div className="space-y-1.5 p-3 bg-[#0A1A36] text-white rounded-2xl border border-[#1B2B4C] min-w-56">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Processing Queue</span>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    </div>
                    <p className="text-[10px] font-medium text-slate-300 leading-none truncate">{bulkSendStep}</p>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div 
                        style={{ width: `${(bulkSendCount / Math.max(1, loans.filter(l => l.status !== 'Closed').length)) * 100}%` }}
                        className="bg-amber-400 h-full transition-all duration-300"
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsSendingAll(true);
                      setBulkSendCount(0);
                      setBulkSendStep("Fetching active loan registries...");
                      
                      const activeLoans = loans.filter(l => l.status !== 'Closed');
                      let count = 0;
                      
                      const sendNext = () => {
                        if (count < activeLoans.length) {
                          const loan = activeLoans[count];
                          setBulkSendStep(`Delivering PDF invoice to ${loan.customerName} via WhatsApp/SMS...`);
                          setBulkSendCount(count + 1);
                          
                          // Add log activity
                          const newAct = {
                            id: `act-${Date.now()}-${count}`,
                            text: `Auto Monthly Invoice INV-2024-${Math.floor(100+Math.random()*900)} dispatched to ${loan.customerName}`,
                            amount: null,
                            time: 'Just now',
                            type: 'invoice'
                          };
                          setActivities(prev => [newAct, ...prev]);

                          count++;
                          setTimeout(sendNext, 750);
                        } else {
                          setBulkSendStep("Complete!");
                          setTimeout(() => {
                            setIsSendingAll(false);
                            alert(`Success! Generated and dispatched monthly invoices to all ${activeLoans.length} active gold loan customers. Broadcast receipts logged in the System Registry.`);
                          }, 1000);
                        }
                      };
                      
                      setTimeout(sendNext, 900);
                    }}
                    disabled={isSendingAll || loans.filter(l => l.status !== 'Closed').length === 0}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0A1A36] text-white hover:bg-[#152747] font-black rounded-2xl text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    <Smartphone className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                    <span>Broadcast Invoices ({loans.filter(l => l.status !== 'Closed').length})</span>
                  </button>
                )}
                <p className="text-[9px] text-slate-400">Total outstanding billing queue: {loans.filter(l => l.status !== 'Closed').length} active accounts</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <h4 className="text-sm font-black text-[#0A1A36] mb-4">Past Documents</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2.5">Invoice ID</th>
                      <th className="pb-2.5">Loan ID</th>
                      <th className="pb-2.5">Customer Name</th>
                      <th className="pb-2.5">Valued Item</th>
                      <th className="pb-2.5">Appraised Value</th>
                      <th className="pb-2.5">Date</th>
                      <th className="pb-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                    {[
                      { id: 'INV-2024-401', loanId: 'SL-2024-1050', customerName: 'Suresh Patil', item: 'Gold Chain (Heavy)', totalWeight: '25.30 gm', principal: 125000, date: '20 May 2024' },
                      { id: 'INV-2024-402', loanId: 'SL-2024-1049', customerName: 'Amit Sharma', item: '2 Gold Bangles', totalWeight: '18.60 gm', principal: 85000, date: '19 May 2024' },
                      { id: 'INV-2024-403', loanId: 'SL-2024-1048', customerName: 'Kavita Jadhav', item: 'Gold Necklace & Ring Set', totalWeight: '92.50 gm', principal: 450000, date: '15 May 2024' },
                    ].map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 font-bold text-slate-400">{inv.id}</td>
                        <td className="py-3.5 font-bold text-[#D28F1B]">{inv.loanId}</td>
                        <td className="py-3.5 font-extrabold text-[#0B1E43]">{inv.customerName}</td>
                        <td className="py-3.5">{inv.item} ({inv.totalWeight})</td>
                        <td className="py-3.5 font-black text-[#0A1A36]">{formatINR(inv.principal)}</td>
                        <td className="py-3.5 text-slate-400">{inv.date}</td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => setActiveInvoice(inv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#D28F1B] rounded-lg font-bold text-[10px]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'Pledged Items': {
        return (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-[#0A1A36]">Pledge Drawer & Locker Vault</h3>
              <p className="text-xs text-slate-400">Monitor precious metals inventory, drawer assignments and secure vault logs</p>
            </div>

            {/* Locker Layout Simulation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs md:col-span-2 space-y-4">
                <h4 className="text-sm font-black text-[#0A1A36] flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-[#D28F1B]" />
                  Active Drawer Registry
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                        <th className="pb-2.5">Packet ID</th>
                        <th className="pb-2.5">Description</th>
                        <th className="pb-2.5">Weight / Purity</th>
                        <th className="pb-2.5">Customer Name</th>
                        <th className="pb-2.5">Locker Room Location</th>
                        <th className="pb-2.5">Vault Status</th>
                        <th className="pb-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                      {pledgedItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 font-bold text-slate-400">{item.id}</td>
                          <td className="py-3.5 font-extrabold text-[#0B1E43]">{item.description}</td>
                          <td className="py-3.5">{item.weight} ({item.purity})</td>
                          <td className="py-3.5 font-bold">{item.customer}</td>
                          <td className="py-3.5">
                            <span className="font-mono font-bold text-[#D28F1B] bg-amber-50 px-2 py-0.5 rounded-md text-[10px]">{item.locker}</span>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                              item.status === 'Secured' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => {
                                const newLoc = prompt("Enter new locker coordinates (e.g. Locker B-05):", item.locker);
                                if (newLoc) {
                                  const updated = pledgedItems.map(p => p.id === item.id ? { ...p, locker: newLoc } : p);
                                  setPledgedItems(updated);
                                  setActivities([{ id: `act-${Date.now()}`, text: `Transferred ${item.description} to ${newLoc}`, amount: null, time: 'Just now', type: 'update' }, ...activities]);
                                }
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-bold text-[10px]"
                            >
                              Transfer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security Metrics Card */}
              <div className="bg-[#0A1A36] text-white p-5 rounded-3xl border border-[#1B2B4C]/40 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-sm font-black flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
                    Vault Status: EXTREMELY SECURE
                  </h4>
                  <p className="text-[11px] text-slate-300">Biometric lockers are operating in healthy modes. All items logged here match physical lockers A-01 through C-20 with real-time weighing logs.</p>
                  <div className="pt-2 text-xs space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-slate-400">Total Vaulted Weight</span>
                      <span className="font-bold text-white">12.4 kg Gold</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-slate-400">Locked Items</span>
                      <span className="font-bold text-amber-400">{pledgedItems.filter(p => p.status === 'Secured').length} Packets</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Audit</span>
                      <span className="font-bold text-emerald-400">Today 09:00 AM</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert("Initiating complete vault audit... Status: Ok. Sensors synced.")}
                  className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-xl text-center"
                >
                  Trigger Sensor Audit
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'Reports': {
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#0A1A36]">Executive Reports</h3>
                <p className="text-xs text-slate-400">Business performance metrics, monthly audit logs, and interest ledger growth charts</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => alert("Exporting spreadsheet ledger to Excel...")} className="px-3 py-1.5 bg-slate-200/60 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">Export Excel</button>
                <button onClick={() => alert("Rendering secure accounting summary PDF...")} className="px-3 py-1.5 bg-[#0A1A36] hover:bg-[#0A1A36]/90 text-white rounded-lg text-xs font-bold">Export PDF</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Interest Accrued (MTD)</span>
                <p className="text-xl font-black text-emerald-600 mt-1">{formatINR(totalLoanPortfolio * 0.012)}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">New Disbursals (MTD)</span>
                <p className="text-xl font-black text-blue-600 mt-1">{formatINR(totalLoanPortfolio)}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Average Ticket Size</span>
                <p className="text-xl font-black text-[#0A1A36] mt-1">{formatINR(loans.length > 0 ? Math.round(totalLoanPortfolio / loans.length) : 0)}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">NPA (Non-Perf. Assets)</span>
                <p className="text-xl font-black text-rose-500 mt-1">1.8% <span className="text-[9px] text-slate-400 font-medium">Excellent</span></p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <h4 className="text-sm font-black text-[#0A1A36]">Interest Collection Growth (Weekly)</h4>
              <div className="h-48 flex items-end justify-between gap-4 pt-4 border-b border-slate-100 pb-2">
                {[
                  { label: 'Week 1', value: 45000, height: '30%' },
                  { label: 'Week 2', value: 68000, height: '48%' },
                  { label: 'Week 3', value: 92000, height: '65%' },
                  { label: 'Week 4', value: 125000, height: '88%' }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-bold text-slate-500">{formatINR(bar.value)}</span>
                    <div style={{ height: bar.height }} className="w-full max-w-16 bg-gradient-to-t from-[#D28F1B] to-[#DF9F28] rounded-t-lg transition-all hover:brightness-110"></div>
                    <span className="text-[10px] text-slate-400 font-bold">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'Employees': {
        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#0A1A36]">Staff & Credentials</h3>
                <p className="text-xs text-slate-400">Control branch user profiles, assign operational responsibilities and monitor shifts</p>
              </div>
              <button
                onClick={() => setIsAddEmpOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-4 py-2 rounded-xl text-xs font-black shadow-md hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Employee</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <h4 className="text-sm font-black text-[#0A1A36] mb-4">Active Staff Profiles</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2.5">Staff ID</th>
                      <th className="pb-2.5">Employee Name</th>
                      <th className="pb-2.5">Corporate Role</th>
                      <th className="pb-2.5">Assigned Branch</th>
                      <th className="pb-2.5">Contact Number</th>
                      <th className="pb-2.5">ERP Security clearance</th>
                      <th className="pb-2.5 text-right">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 font-bold text-slate-400">{emp.id}</td>
                        <td className="py-3.5 font-extrabold text-[#0B1E43]">{emp.name}</td>
                        <td className="py-3.5 font-bold">{emp.role}</td>
                        <td className="py-3.5 text-slate-500">{emp.branch}</td>
                        <td className="py-3.5 font-bold">{emp.phone}</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-[#0B1E43] font-bold rounded-md uppercase text-[9px]">
                            {emp.role === 'Branch Manager' ? 'Full Control' : 'Standard Write'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => {
                              const updated = employees.map(e => e.id === emp.id ? { ...e, status: e.status === 'Active' ? 'Suspended' : 'Active' } : e);
                              setEmployees(updated);
                              setActivities([{ id: `act-${Date.now()}`, text: `Employee status toggled for ${emp.name}`, amount: null, time: 'Just now', type: 'update' }, ...activities]);
                            }}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                              emp.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                                : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                            }`}
                          >
                            {emp.status}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Employee Modal */}
            <AnimatePresence>
              {isAddEmpOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-[#0A1A36]/60 backdrop-blur-xs" onClick={() => setIsAddEmpOpen(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl max-w-md w-full p-6 relative z-10 shadow-2xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-black text-[#0A1A36] flex items-center gap-2">
                        <Briefcase className="w-4.5 h-4.5 text-[#D28F1B]" />
                        Register New Staff Employee
                      </h3>
                      <button onClick={() => setIsAddEmpOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newEmpForm.name || !newEmpForm.phone) {
                          alert("Please fill in Name and Phone Number.");
                          return;
                        }
                        const newEmp = {
                          id: `EMP-${Math.floor(10 + Math.random() * 90)}`,
                          name: newEmpForm.name,
                          role: newEmpForm.role,
                          phone: newEmpForm.phone,
                          branch: newEmpForm.branch,
                          status: 'Active'
                        };
                        setEmployees([...employees, newEmp]);
                        setActivities([{ id: `act-${Date.now()}`, text: `Registered employee profile ${newEmp.name}`, amount: null, time: 'Just now', type: 'update' }, ...activities]);
                        setNewEmpForm({ name: '', role: 'Loan Officer', phone: '', branch: 'Mumbai Main Branch' });
                        setIsAddEmpOpen(false);
                      }}
                      className="space-y-4 pt-4"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Employee Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newEmpForm.name}
                          onChange={(e) => setNewEmpForm({ ...newEmpForm, name: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                          placeholder="e.g. Ramesh Chavan"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Corporate Role Type</label>
                        <select
                          value={newEmpForm.role}
                          onChange={(e) => setNewEmpForm({ ...newEmpForm, role: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                        >
                          <option value="Loan Officer">Loan Officer (Standard)</option>
                          <option value="Gold Valuer">Gold Appraiser & Valuer</option>
                          <option value="Cashier">Cash Counter Clerk</option>
                          <option value="Branch Manager">Branch Manager (Full clearance)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Assigned Working Branch</label>
                        <select
                          value={newEmpForm.branch}
                          onChange={(e) => setNewEmpForm({ ...newEmpForm, branch: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                        >
                          <option value="Mumbai Main Branch">Mumbai Main Branch</option>
                          <option value="Pune Sub Branch">Pune Sub Branch</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={newEmpForm.phone}
                          onChange={(e) => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                          placeholder="e.g. +91 91234 56780"
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAddEmpOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancel</button>
                        <button type="submit" className="bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-5 py-2.5 rounded-xl text-xs font-black uppercase">Appoint Employee</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      case 'Branches': {
        return (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-[#0A1A36]">Company Store Outlets</h3>
              <p className="text-xs text-slate-400">Track liquid cash ceilings, ledger capacities and operational statuses of your registered outlets</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {branches.map((br) => (
                <div key={br.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{br.id}</span>
                        <h4 className="text-sm font-black text-[#0A1A36]">{br.name}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        br.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {br.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs pt-1.5">
                      <p className="text-slate-500 font-medium">📍 {br.address}</p>
                      <p className="text-slate-500 font-medium">📞 {br.phone}</p>
                      <div className="flex justify-between font-bold text-[11px] pt-1.5 border-t border-slate-50">
                        <span className="text-slate-400">Active Staff:</span>
                        <span className="text-[#0B1E43]">{br.staffCount} Officers</span>
                      </div>
                      {br.ledgerAmount > 0 && (
                        <div className="flex justify-between font-bold text-[11px]">
                          <span className="text-slate-400">Cash Ceiling:</span>
                          <span className="text-[#0B1E43]">{formatINR(br.ledgerAmount)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const newCap = prompt("Specify new liquid cash ceiling amount (₹):", br.ledgerAmount.toString());
                      if (newCap && !isNaN(Number(newCap))) {
                        const updated = branches.map(b => b.id === br.id ? { ...b, ledgerAmount: Number(newCap) } : b);
                        setBranches(updated);
                        setActivities([{ id: `act-${Date.now()}`, text: `Adjusted ledger capacity for ${br.name}`, amount: null, time: 'Just now', type: 'update' }, ...activities]);
                      }
                    }}
                    className="mt-5 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-bold rounded-xl text-center"
                  >
                    Adjust Ledger Limit
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'Notifications': {
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#0A1A36]">Compliance Notifications</h3>
                <p className="text-xs text-slate-400">Trigger customer repayment alerts, kyc audits, and system security summaries</p>
              </div>
              <button
                onClick={() => {
                  setNotifications([]);
                  alert("All notifications cleared successfully.");
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
              >
                Clear All
              </button>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
              {notifications.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                  <p className="text-xs font-bold text-[#0B1E43]">Compliance inbox perfectly empty!</p>
                  <p className="text-[10px] text-slate-400">No overdue packets or pending KYC checks require attention today.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all ${
                      notif.unread ? 'bg-amber-50/20 border-amber-200' : 'bg-slate-50 border-slate-200/50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        notif.severity === 'high' ? 'bg-rose-50 text-rose-500' :
                        notif.severity === 'medium' ? 'bg-amber-50 text-amber-500' :
                        'bg-blue-50 text-blue-500'
                      }`}>
                        <AlertTriangle className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#0B1E43] leading-snug">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 block">{notif.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const updated = notifications.filter(n => n.id !== notif.id);
                        setNotifications(updated);
                      }}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      }

      case 'Settings': {
        return (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-[#0A1A36]">ERP Global settings</h3>
              <p className="text-xs text-slate-400">Configure parameters, grace periods, LTV limits and company credentials dynamically</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs max-w-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("ERP System settings updated successfully!");
                  setActivities([{ id: `act-${Date.now()}`, text: `Adjusted system parameters & grace periods`, amount: null, time: 'Just now', type: 'update' }, ...activities]);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Jewellery Shop Name *</label>
                    <input
                      type="text"
                      required
                      value={settings.shopName}
                      onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Default Base Interest (% Monthly) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={settings.defaultInterestRate}
                      onChange={(e) => setSettings({ ...settings, defaultInterestRate: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Maximum LTV Limit Percentage *</label>
                    <input
                      type="number"
                      required
                      value={settings.maxLtvRatio}
                      onChange={(e) => setSettings({ ...settings, maxLtvRatio: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                      placeholder="e.g. 85"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Overdue Grace Period (Days) *</label>
                    <input
                      type="number"
                      required
                      value={settings.gracePeriodDays}
                      onChange={(e) => setSettings({ ...settings, gracePeriodDays: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black block text-[#0B1E43]">Automated Customer SMS Alerts</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Sends WhatsApp/SMS triggers automatically when due dates are within 3 days.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, autoSmsAlerts: !settings.autoSmsAlerts })}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        settings.autoSmsAlerts ? 'bg-amber-400' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        settings.autoSmsAlerts ? 'translate-x-5' : ''
                      }`} />
                    </button>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black block text-[#0B1E43]">Durable Cloud Backup Storage</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Pushes incremental transactions continuously to your cloud cluster.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, secureBackup: !settings.secureBackup })}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        settings.secureBackup ? 'bg-amber-400' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        settings.secureBackup ? 'translate-x-5' : ''
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-6 py-2.5 rounded-xl text-xs font-black uppercase">Save System Settings</button>
                </div>
              </form>
            </div>
          </div>
        );
      }

      case 'Subscription': {
        return (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-[#0A1A36]">SaaS Enterprise Subscription</h3>
              <p className="text-xs text-slate-400">View license details, active API modules, and SaaS invoice histories</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-[#0A1A36] text-white p-6 rounded-3xl border border-[#1B2B4C]/40 lg:col-span-2 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-amber-400 text-[#0A1A36] font-black rounded-lg text-[10px] uppercase tracking-wider">Enterprise Plan Active</span>
                    <span className="text-xs text-slate-300">Renewal Date: **15 Jun 2027**</span>
                  </div>
                  <h4 className="text-xl font-serif font-black bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">Suvarna ERP Premium Suite</h4>
                  <p className="text-xs text-slate-300">Your account is active on the highest business tier. Includes multi-branch cash drawers, secure biometric vaults, real-time SMS relays, and Supabase cloud ledger mirrors.</p>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>Unlimited Customers & Loans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>Multi-Branch Synchronization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>Dynamic Gold Market API</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>Sovereign Security Rules Auditing</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#1B2B4C] flex justify-between items-center text-xs">
                  <span className="text-slate-400">Licensed to **Mumbai & Pune Outlets**</span>
                  <span className="text-emerald-400 font-bold">💳 Auto-renewal On</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <h4 className="text-sm font-black text-[#0A1A36] flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                  Premium Services Activated
                </h4>
                <div className="space-y-3">
                  {[
                    { service: 'Gold Market Rates Tracker', status: 'Online' },
                    { service: 'Supabase Sync Relay', status: 'Online' },
                    { service: 'Bulk SMS Gateway', status: 'Online' },
                    { service: 'Physical Locker Sensor Bridge', status: 'Active' }
                  ].map((srv, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      <span className="text-slate-600 font-bold">{srv.service}</span>
                      <span className="text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-2 py-0.5 rounded-md">{srv.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
      case 'Dashboard':
        return null; // Will fallback to original layout rendering below
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#0B1E43] flex flex-col md:flex-row font-sans antialiased">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#0A1A36] text-white flex flex-col justify-between shrink-0 p-5 md:min-h-screen border-r border-[#1B2B4C]/40">
        <div className="space-y-6">
          
          {/* Brand Logo in Sidebar */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sb-gold-crown-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DF9F28" />
                    <stop offset="30%" stopColor="#FFF2B2" />
                    <stop offset="70%" stopColor="#D28F1B" />
                    <stop offset="100%" stopColor="#875005" />
                  </linearGradient>
                </defs>
                <path d="M 32 30 L 28 14 L 38 23 L 50 8 L 62 23 L 72 14 L 68 30 Z" fill="url(#sb-gold-crown-grad)" />
                <path d="M 18 48 L 82 48 L 94 60 L 50 95 L 6 60 Z" stroke="url(#sb-gold-crown-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 58 42 C 58 42, 53 38, 46 40 C 40 42, 38 46, 40 52 C 42 58, 48 60, 53 62 C 59 64, 63 67, 61 75 C 59 83, 50 86, 43 83 C 37 80, 36 75, 36 75" stroke="url(#sb-gold-crown-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline font-serif">
                <span className="font-extrabold text-white text-lg tracking-tight">Suvarna</span>
                <span className="font-extrabold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent text-lg tracking-tight ml-0.5">Loan</span>
              </div>
              <span className="text-[7.5px] font-bold text-slate-400 tracking-[0.2em] uppercase block leading-none">ERP SOFTWARE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-4">
            {[
              { name: 'Dashboard', icon: Layers },
              { name: 'Customers', icon: Users, badge: '1,248' },
              { name: 'Gold Loans', icon: Scale },
              { name: 'Payments', icon: CreditCard },
              { name: 'Interest', icon: TrendingUp },
              { name: 'Invoices', icon: FileText },
              { name: 'Pledged Items', icon: Landmark },
              { name: 'Reports', icon: ShieldCheck },
              { name: 'Employees', icon: Briefcase },
              { name: 'Branches', icon: Landmark },
              { name: 'Notifications', icon: Bell, badge: '12' },
              { name: 'Settings', icon: Settings },
              { name: 'Subscription', icon: Award },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] shadow-lg shadow-amber-500/10 font-bold' 
                      : 'text-slate-300 hover:bg-[#152747]/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A1A36]' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${isActive ? 'bg-[#0A1A36] text-white font-black' : 'bg-[#EF4444] text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            
            {/* Direct Log Out Option in Sidebar */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-rose-300 hover:bg-rose-500/10 hover:text-rose-100 transition-all border border-transparent hover:border-rose-500/10 mt-3 group"
              title="Log Out of Session"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-300 transition-colors" />
                <span className="font-bold">Log Out</span>
              </div>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider scale-90 opacity-70 group-hover:opacity-100 transition-opacity">
                Exit
              </span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar Components */}
        <div className="space-y-4 pt-6 mt-6 border-t border-[#1B2B4C]/60">
          {/* Premium Plan Card */}
          <div className="bg-gradient-to-b from-[#152747] to-[#0E1F3D] p-3.5 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-amber-500/10 rounded-full blur-xl"></div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {currentOwner?.plan || "Sovereign Pro"} Plan
              </span>
            </div>
            <p className="text-[9px] text-slate-400">License state: <span className="text-emerald-400 font-bold">{currentOwner?.status || "Active"}</span></p>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Account ID: <code className="bg-slate-900/50 text-slate-300 px-1 py-0.5 rounded font-mono text-[9px]">{currentOwner?.id || "owner-1"}</code>
            </div>
          </div>

          {/* User Profile Info with Logout */}
          <div className="flex items-center justify-between p-1">
            <button 
              onClick={() => setIsEditOwnerProfileOpen(true)}
              className="flex items-center gap-2.5 group/owner text-left hover:opacity-90 transition-all"
              title="Edit Shop Owner Profile"
            >
              <div className="relative">
                <img 
                  src={ownerAvatar} 
                  alt="Owner" 
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-xl border border-white/10 object-cover" 
                />
                <div className="absolute inset-0 bg-black/45 rounded-xl opacity-0 group-hover/owner:opacity-100 flex items-center justify-center transition-all">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-none text-white group-hover/owner:text-amber-400 transition-colors">{ownerName}</span>
                <span className="text-[9px] text-slate-400 mt-1">Shop Owner ✏️</span>
              </div>
            </button>
            <button 
              onClick={handleLogout}
              title="Log Out of Session"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main className="flex-1 flex flex-col p-4 md:p-8 space-y-6 overflow-x-hidden">
        
        {/* Top Header / Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Welcome Info */}
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#0A1A36] flex items-center gap-2">
              Welcome back, {ownerName} <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Here's a live overview of {settings.shopName}'s operations for today.</p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search customers, loans, id..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white text-xs text-[#0B1E43] font-medium border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#DF9F28] w-52 shadow-xs placeholder-slate-400 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Branch Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0B1E43] shadow-xs hover:border-slate-300"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Main Branch</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
              
              {isBranchDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-40 text-left">
                  <button onClick={() => setIsBranchDropdownOpen(false)} className="w-full text-left px-4 py-2 text-xs font-bold text-[#0B1E43] hover:bg-slate-50">Main Branch (Mumbai)</button>
                  <button onClick={() => setIsBranchDropdownOpen(false)} className="w-full text-left px-4 py-2 text-xs font-bold text-[#0B1E43] hover:bg-slate-50">Sub Branch (Pune)</button>
                  <button onClick={() => setIsBranchDropdownOpen(false)} className="w-full text-left px-4 py-2 text-xs font-bold text-[#0B1E43] hover:bg-slate-50">Vault Facility (Secure)</button>
                </div>
              )}
            </div>

            {/* Quick WhatsApp Support Link */}
            <a 
              href="https://wa.me/917058536371" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-xl transition-colors shadow-xs animate-pulse"
              title="WhatsApp Customer Support"
            >
              <Smartphone className="w-4.5 h-4.5" />
            </a>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-xl text-xs font-bold text-[#0B1E43] shadow-xs hover:border-slate-300 transition-all"
                title="Account Menu"
              >
                <img 
                  src={ownerAvatar} 
                  alt="Owner" 
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-lg border border-slate-100 object-cover" 
                />
                <span className="hidden md:inline-block pr-1 font-extrabold text-slate-700">{ownerName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-0.5" />
              </button>
              
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40 text-left">
                  <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                    <p className="text-xs font-black text-[#0B1E43]">{ownerName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{currentOwner?.plan || "Sovereign Pro"} Tier</p>
                  </div>
                  <button 
                    onClick={() => { 
                      setIsProfileDropdownOpen(false); 
                      setIsEditOwnerProfileOpen(true); 
                    }} 
                    className="w-full text-left px-4 py-2 text-xs font-bold text-[#0B1E43] hover:bg-slate-50 flex items-center gap-2 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Shop Profile</span>
                  </button>
                  <button 
                    onClick={() => { 
                      setIsProfileDropdownOpen(false); 
                      setActiveTab('Settings'); 
                    }} 
                    className="w-full text-left px-4 py-2 text-xs font-bold text-[#0B1E43] hover:bg-slate-50 flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                  <button 
                    onClick={() => { 
                      setIsProfileDropdownOpen(false); 
                      handleLogout(); 
                    }} 
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* "+ New Loan" Primary Trigger */}
            <button 
              onClick={() => setIsNewLoanOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] hover:from-[#e8a932] hover:to-[#db9823] text-[#0A1A36] px-4.5 py-2 rounded-xl text-xs font-extrabold tracking-wide shadow-md transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Loan</span>
            </button>
          </div>

        </div>

        {/* Database Sync Status Alert Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
              dbStatus === 'connecting' ? 'bg-amber-400 animate-spin' :
              dbStatus === 'error' ? 'bg-rose-500' : 'bg-slate-400'
            }`}></div>
            <div className="text-left">
              <span className="text-xs font-bold block text-[#0B1E43]">
                {dbStatus === 'connected' ? '⚡ Connected to Supabase Cloud Database' :
                 dbStatus === 'connecting' ? '🔄 Attempting to connect to Supabase Cloud...' :
                 dbStatus === 'error' ? '❌ Supabase connection error (Using Offline Safe Mode)' :
                 '🔌 Offline Safe Mode (Initial Local State Active)'}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {dbStatus === 'connected' 
                  ? 'All loan creations, customer registries, and payments sync in real-time.' 
                  : 'Configure VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY inside environment variables for durable cloud storage.'}
              </span>
            </div>
          </div>
          {dbStatus !== 'connected' && (
            <button 
              onClick={() => setIsSupabaseModalOpen(true)}
              className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-[#D28F1B] border border-[#D28F1B]/20 rounded-lg text-[10px] font-extrabold tracking-wide uppercase transition-colors"
            >
              How to Connect
            </button>
          )}
        </div>

        {activeTab === 'Dashboard' ? (
          <>
            {/* 3. FOUR METRIC KEY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          
              {/* Card 1: Total Loan Portfolio */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(223,159,40,0.15)] hover:border-amber-400/50 transition-all duration-300 flex items-center justify-between relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                <div className="space-y-2 text-left z-10">
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">Total Loan Portfolio</span>
                  <h3 className="text-xl md:text-2xl font-black text-[#0A1A36] tracking-tight">{formatINR(totalLoanPortfolio + 24500000)}</h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px] font-black">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12.5%</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">vs last month</span>
                  </div>

                  {/* Sparkline */}
                  <div className="pt-2 w-28 h-6 opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg className="w-full h-full" viewBox="0 0 120 30">
                      <defs>
                        <linearGradient id="spark-gold" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#DF9F28" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#DF9F28" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 25 L 20 20 L 40 22 L 60 12 L 80 18 L 100 8 L 120 5 L 120 30 L 0 30 Z" fill="url(#spark-gold)" />
                      <path d="M0 25 L 20 20 L 40 22 L 60 12 L 80 18 L 100 8 L 120 5" fill="none" stroke="#DF9F28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="120" cy="5" r="2" fill="#DF9F28" />
                    </svg>
                  </div>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 text-[#D28F1B] shrink-0 shadow-inner z-10 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                  <DollarSign className="w-6 h-6" />
                </div>
              </motion.div>

              {/* Card 2: Total Customers */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(59,130,246,0.15)] hover:border-blue-400/50 transition-all duration-300 flex items-center justify-between relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                <div className="space-y-2 text-left z-10">
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">Total Customers</span>
                  <h3 className="text-xl md:text-2xl font-black text-[#0A1A36] tracking-tight">{totalCustomers.toLocaleString()}</h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px] font-black">
                      <TrendingUp className="w-3 h-3" />
                      <span>+8.2%</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">vs last month</span>
                  </div>

                  {/* Sparkline */}
                  <div className="pt-2 w-28 h-6 opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg className="w-full h-full" viewBox="0 0 120 30">
                      <defs>
                        <linearGradient id="spark-blue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 28 L 20 22 L 40 24 L 60 15 L 80 16 L 100 10 L 120 7 L 120 30 L 0 30 Z" fill="url(#spark-blue)" />
                      <path d="M0 28 L 20 22 L 40 24 L 60 15 L 80 16 L 100 10 L 120 7" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="120" cy="7" r="2" fill="#3B82F6" />
                    </svg>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-600 shrink-0 shadow-inner z-10 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <Users className="w-6 h-6" />
                </div>
              </motion.div>

              {/* Card 3: Total Gold Weight */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(0,168,150,0.15)] hover:border-emerald-400/50 transition-all duration-300 flex items-center justify-between relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00A896]/5 to-teal-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                <div className="space-y-2 text-left z-10">
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">Total Gold Pledged</span>
                  <h3 className="text-xl md:text-2xl font-black text-[#0A1A36] tracking-tight">{totalGoldWeight.toFixed(3)} kg</h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px] font-black">
                      <TrendingUp className="w-3 h-3" />
                      <span>+5.6%</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">vs last month</span>
                  </div>

                  {/* Sparkline */}
                  <div className="pt-2 w-28 h-6 opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg className="w-full h-full" viewBox="0 0 120 30">
                      <defs>
                        <linearGradient id="spark-teal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00A896" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#00A896" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 26 L 20 25 L 40 18 L 60 20 L 80 14 L 100 11 L 120 8 L 120 30 L 0 30 Z" fill="url(#spark-teal)" />
                      <path d="M0 26 L 20 25 L 40 18 L 60 20 L 80 14 L 100 11 L 120 8" fill="none" stroke="#00A896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="120" cy="8" r="2" fill="#00A896" />
                    </svg>
                  </div>
                </div>
                <div className="w-12 h-12 bg-[#00A896]/10 rounded-2xl flex items-center justify-center border border-[#00A896]/20 text-[#00A896] shrink-0 shadow-inner z-10 group-hover:bg-[#00A896] group-hover:text-white transition-colors duration-300">
                  <Scale className="w-6 h-6" />
                </div>
              </motion.div>

              {/* Card 4: Total Outstanding */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(239,68,68,0.15)] hover:border-rose-400/50 transition-all duration-300 flex items-center justify-between relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/5 to-red-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                <div className="space-y-2 text-left z-10">
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">Total Outstanding</span>
                  <h3 className="text-xl md:text-2xl font-black text-[#0A1A36] tracking-tight">{formatINR(totalOutstanding + 12400000)}</h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px] font-black">
                      <TrendingUp className="w-3 h-3" />
                      <span>+10.3%</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">vs last month</span>
                  </div>

                  {/* Sparkline */}
                  <div className="pt-2 w-28 h-6 opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg className="w-full h-full" viewBox="0 0 120 30">
                      <defs>
                        <linearGradient id="spark-rose" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 24 L 20 20 L 40 15 L 60 18 L 80 12 L 100 9 L 120 6 L 120 30 L 0 30 Z" fill="url(#spark-rose)" />
                      <path d="M0 24 L 20 20 L 40 15 L 60 18 L 80 12 L 100 9 L 120 6" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="120" cy="6" r="2" fill="#EF4444" />
                    </svg>
                  </div>
                </div>
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 text-rose-600 shrink-0 shadow-inner z-10 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                  <FileText className="w-6 h-6" />
                </div>
              </motion.div>

            </div>

        {/* 4. PRIMARY ANALYTICS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Portfolio Overview Line Graph */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] lg:col-span-2 text-left space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-[#0A1A36] tracking-tight">Interactive Portfolio Analytics</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Asset health, disbursed values & live accruals</p>
              </div>
              
              {/* Dynamic Tabs Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                {(['disbursed', 'outstanding', 'interest'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPortfolioTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold capitalize tracking-wide transition-all ${
                      portfolioTab === tab
                        ? 'bg-white text-[#0A1A36] shadow-xs'
                        : 'text-slate-500 hover:text-[#0A1A36]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom Interactive Pure SVG Chart */}
            <div className="relative h-64 w-full flex items-end pt-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-area-disbursed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DF9F28" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#DF9F28" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="chart-area-outstanding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="chart-area-interest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
                
                {/* Under Fill Path - Dynamic */}
                {portfolioTab === 'disbursed' && (
                  <path 
                    d="M 10 180 Q 100 140, 200 120 T 400 60 L 490 50 L 490 190 L 10 190 Z" 
                    fill="url(#chart-area-disbursed)" 
                  />
                )}
                {portfolioTab === 'outstanding' && (
                  <path 
                    d="M 10 160 Q 120 150, 230 100 T 410 80 L 490 70 L 490 190 L 10 190 Z" 
                    fill="url(#chart-area-outstanding)" 
                  />
                )}
                {portfolioTab === 'interest' && (
                  <path 
                    d="M 10 190 Q 90 170, 220 140 T 380 90 L 490 80 L 490 190 L 10 190 Z" 
                    fill="url(#chart-area-interest)" 
                  />
                )}

                {/* Curved Line - Dynamic */}
                {portfolioTab === 'disbursed' && (
                  <path 
                    d="M 10 180 Q 100 140, 200 120 T 400 60 L 490 50" 
                    fill="none" 
                    stroke="#DF9F28" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                )}
                {portfolioTab === 'outstanding' && (
                  <path 
                    d="M 10 160 Q 120 150, 230 100 T 410 80 L 490 70" 
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                )}
                {portfolioTab === 'interest' && (
                  <path 
                    d="M 10 190 Q 90 170, 220 140 T 380 90 L 490 80" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                )}

                {/* Markers - Dynamic */}
                {portfolioTab === 'disbursed' && (
                  <>
                    <circle cx="10" cy="180" r="5" fill="#0A1A36" stroke="#DF9F28" strokeWidth="2.5" />
                    <circle cx="150" cy="130" r="5" fill="#0A1A36" stroke="#DF9F28" strokeWidth="2.5" />
                    <circle cx="300" cy="90" r="5" fill="#0A1A36" stroke="#DF9F28" strokeWidth="2.5" />
                    <circle cx="450" cy="54" r="6" fill="#DF9F28" stroke="#FFF" strokeWidth="2" className="animate-pulse" />
                  </>
                )}
                {portfolioTab === 'outstanding' && (
                  <>
                    <circle cx="10" cy="160" r="5" fill="#0A1A36" stroke="#3B82F6" strokeWidth="2.5" />
                    <circle cx="150" cy="135" r="5" fill="#0A1A36" stroke="#3B82F6" strokeWidth="2.5" />
                    <circle cx="300" cy="95" r="5" fill="#0A1A36" stroke="#3B82F6" strokeWidth="2.5" />
                    <circle cx="450" cy="73" r="6" fill="#3B82F6" stroke="#FFF" strokeWidth="2" className="animate-pulse" />
                  </>
                )}
                {portfolioTab === 'interest' && (
                  <>
                    <circle cx="10" cy="190" r="5" fill="#0A1A36" stroke="#10B981" strokeWidth="2.5" />
                    <circle cx="150" cy="160" r="5" fill="#0A1A36" stroke="#10B981" strokeWidth="2.5" />
                    <circle cx="300" cy="115" r="5" fill="#0A1A36" stroke="#10B981" strokeWidth="2.5" />
                    <circle cx="450" cy="83" r="6" fill="#10B981" stroke="#FFF" strokeWidth="2" className="animate-pulse" />
                  </>
                )}
              </svg>
              
              {/* Highlight Overlay Badge on the maximum point */}
              <div className="absolute right-8 top-8 bg-[#0A1A36] text-white text-[11px] font-black px-3 py-2 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  portfolioTab === 'disbursed' ? 'bg-amber-400 animate-ping' :
                  portfolioTab === 'outstanding' ? 'bg-blue-400 animate-ping' :
                  'bg-emerald-400 animate-ping'
                }`}></span>
                <span>
                  {portfolioTab === 'disbursed' ? 'Portfolio: ₹ 2.45 Cr' :
                   portfolioTab === 'outstanding' ? 'Outstanding: ₹ 1.24 Cr' :
                   'Accrued Interest: ₹ 14.8 L'}
                </span>
              </div>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[9px] font-bold text-slate-400 px-3 pt-1">
              <span>1 May</span>
              <span>5 May</span>
              <span>10 May</span>
              <span>15 May</span>
              <span>20 May</span>
              <span>25 May</span>
              <span>31 May</span>
            </div>
          </div>

          {/* Today's Collections & Live Goal Tracker */}
          <div className="bg-[#0A1A36] text-white p-5 rounded-3xl border border-[#1B2B4C]/60 shadow-xl text-left flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="space-y-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black tracking-tight text-white">Live Collection Goal</h4>
                  <p className="text-[10px] text-slate-400">Daily target vs collections progress</p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[9px] font-extrabold border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span>LIVE TRACKING</span>
                </div>
              </div>

              {/* Progress Tracker Widget */}
              <div className="flex items-center gap-4 py-2 bg-white/5 p-3 rounded-2xl border border-white/5">
                {/* Radial Progress Ring */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="transparent" />
                    {/* 95.4% progress */}
                    <circle cx="32" cy="32" r="26" stroke="#DF9F28" strokeWidth="5.5" fill="transparent" 
                            strokeDasharray="163" strokeDashoffset={163 - (163 * 0.954)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-[10px] font-black text-amber-400">95.4%</div>
                </div>

                <div className="space-y-1">
                  <span className="text-3xl font-black tracking-tight text-white block leading-none">₹ 95,400</span>
                  <p className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                    <span>▲ +18.6%</span>
                    <span className="text-slate-400 font-normal">of ₹1.0L Target</span>
                  </p>
                </div>
              </div>

              {/* Collections breakdown */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">Funds Distribution</span>
                <div className="space-y-2 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Interest Collected</span>
                      <span className="font-bold text-amber-400">₹ 62,400 (65%)</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Principal Repaid</span>
                      <span className="font-bold text-blue-400">₹ 28,000 (29%)</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full" style={{ width: '29%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Advance Fees</span>
                      <span className="font-bold text-emerald-400">₹ 5,000 (6%)</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: '6%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 z-10">
              <button className="w-full py-2.5 bg-white/10 hover:bg-[#DF9F28] hover:text-[#0A1A36] text-white rounded-xl text-xs font-black transition-all border border-white/5 flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Detailed Collection Logs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* 5. SECONDARY ANALYTICS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Donut Chart: Loan Status */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] text-left space-y-5 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-black text-[#0A1A36] tracking-tight">Loan Status Distribution</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Current portfolio status split of active packets</p>
            </div>

            {/* Pure SVG Donut Chart with glowing center */}
            <div className="relative flex items-center justify-center py-2">
              <svg className="w-36 h-36 transform -rotate-90">
                {/* Background Ring */}
                <circle cx="72" cy="72" r="54" stroke="#F8FAFC" strokeWidth="15" fill="transparent" />
                {/* Active Segment (68.6%) - circumference is 2 * pi * 54 = 339.3 */}
                <circle cx="72" cy="72" r="54" stroke="#00A896" strokeWidth="15" fill="transparent" 
                        strokeDasharray="339.3" strokeDashoffset={339.3 - (339.3 * 0.686)} strokeLinecap="round" />
                {/* Overdue Segment (15.7%) */}
                <circle cx="72" cy="72" r="54" stroke="#DF9F28" strokeWidth="15" fill="transparent" 
                        strokeDasharray="339.3" strokeDashoffset={339.3 - (339.3 * 0.157)} transform="rotate(247 72 72)" strokeLinecap="round" />
                {/* Closed Segment (12.3%) */}
                <circle cx="72" cy="72" r="54" stroke="#3B82F6" strokeWidth="15" fill="transparent" 
                        strokeDasharray="339.3" strokeDashoffset={339.3 - (339.3 * 0.123)} transform="rotate(303 72 72)" strokeLinecap="round" />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black text-[#0A1A36] tracking-tight">1,248</span>
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Active</span>
              </div>
            </div>

            {/* Donut Legends */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#00A896] rounded-md"></span>
                <span>Active: 68.6%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#DF9F28] rounded-md"></span>
                <span>Overdue: 15.7%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#3B82F6] rounded-md"></span>
                <span>Closed: 12.3%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-rose-500  rounded-md"></span>
                <span>Auction: 3.4%</span>
              </div>
            </div>
          </div>

          {/* Gold Market Rates Card with Dynamic appraisal calculator utility */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] text-left flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-[#0A1A36] tracking-tight">Live Gold Desk & Appraisal</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">IBJA spot rates & instant eligible LTV calculator</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <span>10:30 AM</span>
                </span>
              </div>

              {/* Dynamic appraisal desk tab section */}
              <div className="space-y-3">
                {/* Instant LTV Appraiser Form */}
                <div className="bg-amber-500/5 p-3 rounded-2xl border border-amber-500/10 space-y-2.5">
                  <span className="text-[10px] font-extrabold text-amber-800 tracking-wider uppercase block">Instant Gold Appraiser</span>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Input weight */}
                    <div>
                      <label className="text-[9px] text-slate-400 font-bold block mb-1">Weight (grams)</label>
                      <input 
                        type="number" 
                        value={calcWeight}
                        onChange={(e) => setCalcWeight(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#0B1E43] focus:outline-hidden focus:border-amber-400"
                        placeholder="e.g. 15.5"
                      />
                    </div>
                    {/* Purity selector */}
                    <div>
                      <label className="text-[9px] text-slate-400 font-bold block mb-1">Gold Purity</label>
                      <select 
                        value={calcPurity}
                        onChange={(e) => setCalcPurity(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#0B1E43] focus:outline-hidden focus:border-amber-400"
                      >
                        <option value="24K">24K (99.9%)</option>
                        <option value="22K">22K (91.6%)</option>
                        <option value="20K">20K (83.3%)</option>
                        <option value="18K">18K (75.0%)</option>
                      </select>
                    </div>
                  </div>

                  {/* LTV percentage slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold">
                      <span>LTV Ratio (RBI Limit)</span>
                      <span className="text-amber-800 font-black">{calcLtv}% LTV</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {['70', '75', '80', '85'].map((ltv) => (
                        <button
                          key={ltv}
                          type="button"
                          onClick={() => setCalcLtv(ltv)}
                          className={`flex-1 text-[9px] py-1 rounded-md font-bold border transition-all ${
                            calcLtv === ltv 
                              ? 'bg-[#DF9F28] text-[#0A1A36] border-transparent font-extrabold shadow-sm' 
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {ltv}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Computed maximum loan eligible value */}
                  <div className="pt-2 border-t border-amber-500/10 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold">Max Eligible Loan:</span>
                    <span className="text-xs font-black text-[#0A1A36] bg-amber-100 px-2.5 py-1 rounded-lg">
                      {formatINR(
                        Math.max(0, (parseFloat(calcWeight) || 0) * (goldRates[calcPurity] || 0) * (parseFloat(calcLtv) / 100))
                      )}
                    </span>
                  </div>
                </div>

                {/* Rates list (Compact) */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { carat: '24K', price: goldRates['24K'] },
                    { carat: '22K', price: goldRates['22K'] },
                  ].map((rate, i) => (
                    <div key={i} className="flex flex-col p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase">{rate.carat} Spot</span>
                      <span className="text-xs font-black text-[#0B1E43]">₹ {rate.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[8px] text-slate-400 pt-2 text-center font-semibold">Standard calculations aligned with RBI 85% maximum Gold Loan LTV rules.</p>
          </div>

          {/* Top 5 Customers list */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] text-left space-y-4">
            <div>
              <h4 className="text-sm font-black text-[#0A1A36] tracking-tight">Top Credit Portfolio Clients</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Highest active outstanding credit exposure</p>
            </div>

            <div className="space-y-3.5">
              {[
                { name: 'Suresh Patil', amount: 1250000, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', active: true, percent: '100%' },
                { name: 'Amit Sharma', amount: 980000, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80', active: true, percent: '78%' },
                { name: 'Kavita Jadhav', amount: 875000, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', active: true, percent: '70%' },
                { name: 'Ramesh Gupta', amount: 760000, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80', active: false, percent: '60%' },
                { name: 'Prakash More', amount: 640000, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&q=80', active: true, percent: '51%' }
              ].map((cust, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-300 w-4 block text-center group-hover:text-amber-500 transition-colors">
                      {i === 0 ? '👑' : i + 1}
                    </span>
                    <img src={cust.img} alt={cust.name} className="w-8 h-8 rounded-full object-cover border-2 border-slate-100 group-hover:border-amber-400 transition-all shadow-xs" />
                    <div className="text-left">
                      <span className="text-xs font-extrabold text-[#0B1E43] block leading-tight">{cust.name}</span>
                      <div className="w-16 bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: cust.percent }}></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#0A1A36] bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">{formatINR(cust.amount)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 6. RECENT LOANS & REMINDERS / ACTIVITIES BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Block: Recent Loans Table */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] lg:col-span-2 text-left space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-[#0A1A36] tracking-tight">Recent Gold Loan Entries</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Real-time status of latest pledged loan packets</p>
              </div>
              <button className="text-[10px] text-[#DF9F28] bg-amber-500/5 hover:bg-amber-500/10 px-3 py-1.5 rounded-xl font-extrabold tracking-wide transition-all uppercase cursor-pointer">
                View All Loans
              </button>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Loan No.</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Loan Amount</th>
                    <th className="py-3 px-4">Gold Weight</th>
                    <th className="py-3 px-4">Next Due</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLoans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">No loans match your search.</td>
                    </tr>
                  ) : (
                    filteredLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-50/75 transition-all">
                        <td className="py-3.5 px-4 font-extrabold text-slate-500">{loan.id}</td>
                        <td className="py-3.5 px-4 font-black text-[#0B1E43]">{loan.customerName}</td>
                        <td className="py-3.5 px-4 font-black text-[#0A1A36]">{formatINR(loan.amount)}</td>
                        <td className="py-3.5 px-4 text-slate-600 font-bold">
                          <span className="block leading-none">{loan.weight.toFixed(3)} gm</span>
                          <span className="text-[9px] text-slate-400 font-extrabold">({loan.purity})</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-semibold">{loan.dueDate}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            loan.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            loan.status === 'Overdue' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-slate-50 text-slate-400 border border-slate-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              loan.status === 'Active' ? 'bg-emerald-500' :
                              loan.status === 'Overdue' ? 'bg-amber-500 animate-pulse' :
                              'bg-slate-400'
                            }`}></span>
                            {loan.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button 
                              onClick={() => {
                                const customerInfo = customers.find(c => c.name.toLowerCase() === loan.customerName.toLowerCase());
                                setActiveInvoice({
                                  id: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
                                  loanId: loan.id,
                                  customerName: loan.customerName,
                                  phone: loan.phone || customerInfo?.phone,
                                  email: customerInfo?.email,
                                  aadhaar: loan.aadhaar || customerInfo?.aadhaar,
                                  pan: loan.pan || customerInfo?.pan,
                                  item: loan.pledgedItem,
                                  totalWeight: `${loan.weight} gm`,
                                  principal: loan.amount,
                                  date: loan.loanDate
                                });
                              }}
                              className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all cursor-pointer"
                              title="Invoice & Appraisal dispatch"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-[#0A1A36] hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Block: Important Reminders & Recent Activities */}
          <div className="space-y-6">
            
            {/* Important Reminders card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] text-left space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-[#0A1A36] tracking-tight">Important Reminders</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Critical compliance triggers</p>
                </div>
                <span className="text-[10px] text-[#DF9F28] font-extrabold cursor-pointer hover:underline">View All</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { title: 'Interest Due Today', count: 23, color: 'text-amber-600 bg-amber-50 border border-amber-100' },
                  { title: 'Loans Overdue Alert', count: 17, color: 'text-rose-600 bg-rose-50 border border-rose-100' },
                  { title: 'Due in Next 3 Days', count: 31, color: 'text-blue-600 bg-blue-50 border border-blue-100' },
                  { title: 'KYC Renewals Due', count: 12, color: 'text-[#00A896] bg-[#00A896]/5 border border-[#00A896]/10' }
                ].map((rem, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200/80 transition-all cursor-pointer shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${rem.color}`}>
                        {rem.count}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{rem.title}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase">Today</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Live Activities */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] text-left space-y-4">
              <div>
                <h4 className="text-sm font-black text-[#0A1A36] tracking-tight">Recent Activity Log</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Audit events logged globally</p>
              </div>

              <div className="space-y-3">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="text-left space-y-1 max-w-[70%]">
                      <p className="text-xs font-bold text-[#0B1E43] leading-snug">{act.text}</p>
                      <span className="text-[9px] text-slate-400 font-semibold block">{act.time}</span>
                    </div>
                    {act.amount ? (
                      <span className="text-xs font-extrabold text-[#00A896] bg-[#00A896]/10 px-2.5 py-1 rounded-lg shrink-0">
                        + {formatINR(act.amount)}
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md shrink-0 font-extrabold tracking-wide uppercase">Audit</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
          </>
        ) : (
          renderTabContent()
        )}

      </main>

      {/* 7. NEW LOAN CREATION DRAWER MODAL */}
      <AnimatePresence>
        {isNewLoanOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewLoanOpen(false)}
              className="absolute inset-0 bg-[#0A1A36]/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 relative z-10 shadow-2xl border border-slate-200 text-left flex flex-col max-h-[90vh] overflow-hidden"
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 text-[#D28F1B] rounded-xl flex items-center justify-center border border-amber-200">
                    <Scale className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0A1A36]">Create New Gold Loan</h3>
                    <p className="text-[11px] text-slate-400">Pledge gold jewellery items instantly</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsNewLoanOpen(false)}
                  className="p-1 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateLoan} className="space-y-4 pt-4 overflow-y-auto pr-1 flex-1">
                
                {/* Section 1: Customer Details */}
                <div className="space-y-3">
                  <h5 className="text-xs font-black uppercase text-[#D28F1B] tracking-wider">1. Customer Identification</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Customer Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Suresh Patil"
                        value={newLoanForm.customerName}
                        onChange={(e) => setNewLoanForm({...newLoanForm, customerName: e.target.value})}
                        className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-hidden focus:border-amber-400 font-bold text-[#0B1E43]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="e.g. +91 98452 11045"
                        value={newLoanForm.phone}
                        onChange={(e) => setNewLoanForm({...newLoanForm, phone: e.target.value})}
                        className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-hidden focus:border-amber-400 font-bold text-[#0B1E43]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Aadhaar Number (12 Digits)</label>
                      <input 
                        type="text" 
                        maxLength={12}
                        pattern="\d{12}"
                        title="Aadhaar number must be exactly 12 digits"
                        placeholder="e.g. 453298127432"
                        value={newLoanForm.aadhaar}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setNewLoanForm({...newLoanForm, aadhaar: val});
                        }}
                        className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-hidden focus:border-amber-400 font-bold text-[#0B1E43]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">PAN Card Number</label>
                      <input 
                        type="text" 
                        maxLength={10}
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        title="PAN card number format: e.g. ABCDE1234F"
                        placeholder="e.g. AHGPS9012K"
                        value={newLoanForm.pan}
                        onChange={(e) => setNewLoanForm({...newLoanForm, pan: e.target.value.toUpperCase()})}
                        className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-hidden focus:border-amber-400 font-bold text-[#0B1E43] uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Gold Evaluation */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-xs font-black uppercase text-[#D28F1B] tracking-wider">2. Gold Evaluation & Valuation</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Gross Weight (grams)</label>
                      <input 
                        type="number" 
                        step="0.001"
                        required
                        placeholder="e.g. 25.300"
                        value={newLoanForm.weight}
                        onChange={(e) => setNewLoanForm({...newLoanForm, weight: e.target.value})}
                        className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-hidden focus:border-amber-400 font-bold text-[#0B1E43]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Gold Purity (Karat)</label>
                      <select 
                        value={newLoanForm.purity}
                        onChange={(e) => setNewLoanForm({...newLoanForm, purity: e.target.value as any})}
                        className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-hidden focus:border-amber-400 font-extrabold text-[#0B1E43]"
                      >
                        <option value="24K">24K (99.9% pure)</option>
                        <option value="22K">22K (91.6% pure)</option>
                        <option value="18K">18K (75.0% pure)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Pledged Jewel Description</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Heavy Gold Chain"
                        value={newLoanForm.pledgedItem}
                        onChange={(e) => setNewLoanForm({...newLoanForm, pledgedItem: e.target.value})}
                        className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-hidden focus:border-amber-400 font-bold text-[#0B1E43]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Finance parameters */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-xs font-black uppercase text-[#D28F1B] tracking-wider">3. Disbursal & Interest Parameters</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Sanctioned Loan Amount (₹)</label>
                      <input 
                        type="number" 
                        required
                        placeholder="e.g. 125000"
                        value={newLoanForm.amount}
                        onChange={(e) => setNewLoanForm({...newLoanForm, amount: e.target.value})}
                        className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-hidden focus:border-amber-400 font-bold text-[#0B1E43]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Monthly Interest Rate (%)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="e.g. 1.2"
                        value={newLoanForm.interestRate}
                        onChange={(e) => setNewLoanForm({...newLoanForm, interestRate: e.target.value})}
                        className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-hidden focus:border-amber-400 font-bold text-[#0B1E43]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action Block */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3.5">
                  <button 
                    type="button" 
                    onClick={() => setIsNewLoanOpen(false)}
                    className="px-4 py-2 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-6 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Disburse & Save Loan
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. SUPABASE CONNECTIVITY INSTRUCTION MODAL */}
      <AnimatePresence>
        {isSupabaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSupabaseModalOpen(false)}
              className="absolute inset-0 bg-[#0A1A36]/60 backdrop-blur-xs"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 relative z-10 shadow-2xl border border-slate-200 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-[#0A1A36] flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-amber-500" />
                  Connect Real Supabase Instance
                </h3>
                <button 
                  onClick={() => setIsSupabaseModalOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 pt-4 text-xs text-slate-600">
                <p>This Gold Loan ERP can sync directly with your own **Supabase Database & Authentication** cluster.</p>
                
                <div className="space-y-2">
                  <p className="font-extrabold text-[#0B1E43]">Steps to connect:</p>
                  <ol className="list-decimal pl-4 space-y-1.5 font-medium">
                    <li>Create a free account or login to **Supabase** (https://supabase.com).</li>
                    <li>Provision a new project and retrieve your **Project URL** and **API Anon Key**.</li>
                    <li>Go to the **Secrets / Environment Variables** panel in AI Studio Build.</li>
                    <li>Add your credentials into the corresponding keys:</li>
                  </ol>
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-mono text-[10px] text-slate-500 space-y-1">
                    <p>VITE_SUPABASE_URL="your-project-url"</p>
                    <p>VITE_SUPABASE_ANON_KEY="your-anon-key"</p>
                  </div>
                </div>

                <p className="bg-amber-50 text-[#D28F1B] p-2.5 border border-amber-100 rounded-xl text-[10px] font-bold">
                  Note: The app runs in an auto-fallback offline state. Any local loans you disburse are saved in local storage automatically.
                </p>

                <div className="pt-3 flex justify-end">
                  <button 
                    onClick={() => setIsSupabaseModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all"
                  >
                    Got It
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. DETAILED MONTHLY INVOICE & APPRASIAL DELIVERY MODAL */}
      <AnimatePresence>
        {activeInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSending) setActiveInvoice(null);
              }}
              className="absolute inset-0 bg-[#0A1A36]/60 backdrop-blur-xs"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-4xl w-full p-6 relative z-10 shadow-2xl border border-slate-200 text-left flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-hidden"
            >
              {/* Left Column: Invoice PDF / Print layout */}
              <div className="flex-1 flex flex-col overflow-hidden max-h-[80vh]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="text-sm font-black text-[#0A1A36]">Monthly Invoice & Appraisal</h3>
                      <p className="text-[10px] text-slate-400">Official Shop Copy & Customer Invoice</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-50 text-[#D28F1B] px-2.5 py-0.5 rounded-md font-bold uppercase">
                    {activeInvoice.id}
                  </span>
                </div>

                {/* Printable Invoice Page Canvas */}
                <div className="flex-1 overflow-y-auto mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/60 font-sans space-y-4 text-xs text-slate-700">
                  {/* Shop Branding Header */}
                  <div className="flex justify-between items-start border-b-2 border-amber-500 pb-4">
                    <div className="text-left">
                      <h4 className="text-sm font-serif font-black text-[#0A1A36] uppercase tracking-wide">{settings.shopName || "Suvarna Gold Loan & Jewellery Co."}</h4>
                      <p className="text-[10px] text-slate-400">Govt. Regd. Gold Loan Merchant</p>
                      <p className="text-[9px] text-slate-400 mt-1">📍 Opera House, Charni Road, Mumbai, MH</p>
                      <p className="text-[9px] text-slate-400">📞 +91 22 2345 6789 | ✉️ billing@suvarnaloan.com</p>
                    </div>
                    
                    {/* Crown emblem */}
                    <div className="w-12 h-12 flex items-center justify-center bg-[#0A1A36] rounded-xl shrink-0 p-1 border border-amber-500/20">
                      <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 32 30 L 28 14 L 38 23 L 50 8 L 62 23 L 72 14 L 68 30 Z" fill="#DF9F28" />
                        <path d="M 18 48 L 82 48 L 94 60 L 50 95 L 6 60 Z" stroke="#DF9F28" strokeWidth="4" />
                      </svg>
                    </div>
                  </div>

                  {/* Customer and Invoice Info Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded-xl border border-slate-100">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Customer Details</span>
                      <p className="font-extrabold text-[#0B1E43] text-sm">{activeInvoice.customerName}</p>
                      <p className="text-[10px] text-slate-500 font-bold">📞 {activeInvoice.phone || '+91 98452 11045'}</p>
                      {activeInvoice.aadhaar && (
                        <p className="text-[10px] text-slate-600 font-bold">🪪 Aadhaar: {activeInvoice.aadhaar.replace(/(\d{4})/g, '$1 ').trim()}</p>
                      )}
                      {activeInvoice.pan && (
                        <p className="text-[10px] text-[#D28F1B] font-extrabold uppercase">💳 PAN: {activeInvoice.pan}</p>
                      )}
                      <p className="text-[10px] text-slate-400">✉️ {activeInvoice.email || `${activeInvoice.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`}</p>
                      <p className="text-[9px] text-slate-400 leading-normal mt-0.5">📍 Dadar Financial District, Mumbai, MH</p>
                    </div>

                    <div className="space-y-1 text-right text-[10px]">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Invoice Details</span>
                        <p className="font-bold text-[#0B1E43]">Invoice #: <span className="text-[#D28F1B] font-extrabold">{activeInvoice.id}</span></p>
                        <p className="font-bold text-[#0B1E43]">Loan Account: <span className="font-mono text-blue-600 font-extrabold">{activeInvoice.loanId}</span></p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-50 text-[9px] text-slate-400">
                        <p>Billing Date: <span className="font-bold text-slate-600">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>
                        <p>Loan Date: <span className="font-bold text-slate-600">{activeInvoice.date || '15 May 2024'}</span></p>
                        <p>Payment Due Date: <span className="font-bold text-rose-500">20th of this Month</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Gold Appraisal particulars */}
                  <div className="space-y-1.5 text-left">
                    <h5 className="text-[9px] font-black uppercase text-[#D28F1B] tracking-wider">Pledged Gold Particulars</h5>
                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                      <div className="grid grid-cols-3 gap-2 text-center border-b border-slate-50 pb-2">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold block">Gold Jewel Item</span>
                          <span className="text-xs font-black text-[#0B1E43] mt-0.5 block">{activeInvoice.item || 'Gold Chain'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold block">Gross Weight</span>
                          <span className="text-xs font-black text-[#0B1E43] mt-0.5 block">{activeInvoice.totalWeight || '25.300 gm'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold block">Assayed Purity</span>
                          <span className="text-xs font-black text-amber-500 mt-0.5 block">22K Gold (91.6%)</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 text-[10px]">
                        <span className="text-slate-400 font-bold">Estimated Market Value:</span>
                        <span className="font-extrabold text-[#0B1E43]">
                          {formatINR((parseFloat(activeInvoice.totalWeight) || 25.3) * (goldRates?.['22K'] || 5850))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly billing itemization table */}
                  <div className="space-y-1.5 text-left">
                    <h5 className="text-[9px] font-black uppercase text-[#D28F1B] tracking-wider">Billing Itemization (This Month)</h5>
                    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-[9px] uppercase tracking-wider">
                            <th className="p-2.5">Item Description</th>
                            <th className="p-2.5">Rate / Basis</th>
                            <th className="p-2.5 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium">
                          <tr>
                            <td className="p-2.5 font-bold text-[#0B1E43]">
                              Monthly Interest Accrual
                              <span className="block text-[9px] text-slate-400 font-normal">Calculated on principal of {formatINR(activeInvoice.principal)}</span>
                            </td>
                            <td className="p-2.5 font-semibold text-slate-500">1.2% per Month</td>
                            <td className="p-2.5 text-right font-black text-[#0A1A36]">
                              {formatINR(activeInvoice.principal * 0.012)}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-[#0B1E43]">
                              CGST (9%) on Interest Services
                              <span className="block text-[9px] text-slate-400 font-normal">Sovereign Financial Services Tax</span>
                            </td>
                            <td className="p-2.5 font-semibold text-slate-500">9% of Accrual</td>
                            <td className="p-2.5 text-right font-bold text-slate-500">
                              {formatINR(activeInvoice.principal * 0.012 * 0.09)}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-[#0B1E43]">
                              SGST (9%) on Interest Services
                              <span className="block text-[9px] text-slate-400 font-normal">State Financial Services Tax</span>
                            </td>
                            <td className="p-2.5 font-semibold text-slate-500">9% of Accrual</td>
                            <td className="p-2.5 text-right font-bold text-slate-500">
                              {formatINR(activeInvoice.principal * 0.012 * 0.09)}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Summary Blocks */}
                      <div className="bg-slate-50 p-3 border-t border-slate-100 text-right space-y-1 text-[11px] font-bold">
                        <div className="flex justify-between max-w-xs ml-auto">
                          <span className="text-slate-400">Total Monthly Accrued Due:</span>
                          <span className="text-[#0B1E43]">
                            {formatINR(
                              activeInvoice.principal * 0.012 + 
                              activeInvoice.principal * 0.012 * 0.18
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between max-w-xs ml-auto text-xs font-black pt-1.5 border-t border-slate-200">
                          <span className="text-amber-600">Total Outstanding Principal:</span>
                          <span className="text-amber-600">{formatINR(activeInvoice.principal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Terms */}
                  <div className="p-3 bg-white rounded-xl border border-slate-100 text-[8.5px] text-slate-400 space-y-1 leading-normal text-left">
                    <p className="font-bold text-[#0B1E43]">Terms & Compliance Declarations:</p>
                    <p>1. Interest is compounded on a simple monthly basis according to signed sovereign RBI mandates. Standard billing occurs on the 20th of every month.</p>
                    <p>2. Please pay dues before the overdue date to avoid the sovereign 2% default penalty charge and safe-locker vault lock state trigger.</p>
                  </div>
                </div>

                {/* Print button on Left bottom */}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Securely Encrypted with AES-256
                  </span>
                  <button 
                    onClick={() => {
                      window.print();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Invoicing Actions, Selection and SMS Simulation */}
              <div className="w-full md:w-80 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs flex flex-col justify-between max-h-[80vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-200/60">
                    <h4 className="text-sm font-black text-[#0A1A36] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Invoice Dispatch Hub
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Send official monthly invoice directly to customer's personal device</p>
                  </div>

                  {/* Delivery Channels Select */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">1. Select Dispatch Channels</label>
                    
                    {/* WhatsApp */}
                    <div 
                      onClick={() => setChannels({ ...channels, whatsapp: !channels.whatsapp })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        channels.whatsapp ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200/60 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg shrink-0 ${channels.whatsapp ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-[#0B1E43] block text-[11px]">WhatsApp Business</span>
                          <span className="text-[9px] text-slate-400 block">{activeInvoice.phone || '+91 98452 11045'}</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        channels.whatsapp ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {channels.whatsapp && <span className="text-[9px] font-bold">✓</span>}
                      </div>
                    </div>

                    {/* SMS */}
                    <div 
                      onClick={() => setChannels({ ...channels, sms: !channels.sms })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        channels.sms ? 'bg-amber-50/60 border-amber-300' : 'bg-white border-slate-200/60 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg shrink-0 ${channels.sms ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-[#0B1E43] block text-[11px]">Suvarna SMS Relay</span>
                          <span className="text-[9px] text-slate-400 block">DND-compliant transaction alert</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        channels.sms ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {channels.sms && <span className="text-[9px] font-bold">✓</span>}
                      </div>
                    </div>

                    {/* Email */}
                    <div 
                      onClick={() => setChannels({ ...channels, email: !channels.email })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        channels.email ? 'bg-blue-50/60 border-blue-300' : 'bg-white border-slate-200/60 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg shrink-0 ${channels.email ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-[#0B1E43] block text-[11px]">E-Mail PDF Invoice</span>
                          <span className="text-[9px] text-slate-400 block truncate max-w-[130px]">{activeInvoice.email || `${activeInvoice.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`}</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        channels.email ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {channels.email && <span className="text-[9px] font-bold">✓</span>}
                      </div>
                    </div>
                  </div>

                  {/* Message Preview Box */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">2. Live Message Preview</label>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-[10px] text-slate-600 space-y-2 leading-relaxed">
                      <p className="font-bold text-[#0A1A36]">Dear {activeInvoice.customerName},</p>
                      <p>Your monthly gold loan invoice **{activeInvoice.id}** for account **{activeInvoice.loanId}** has been generated by **{settings.shopName || "Suvarna Gold Loan & Jewellery Co."}**.</p>
                      <p>• Principal: {formatINR(activeInvoice.principal)}<br />
                         • Monthly Accrued Interest: {formatINR(activeInvoice.principal * 0.012)}<br />
                         • Item: {activeInvoice.item || 'Pledged Gold Chain'}</p>
                      <p>Please pay the due amount before the due date to avoid penalties. View full appraisal report & make a payment here: https://suvarnaloan.com/p/{activeInvoice.id}</p>
                    </div>
                  </div>
                </div>

                {/* Dispatch Trigger Button */}
                <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
                  {isSending ? (
                    <div className="space-y-2 py-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span>{sendingStep}</span>
                        <span className="animate-pulse text-amber-500">Processing...</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3.5, ease: "linear" }}
                          className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full"
                        />
                      </div>
                    </div>
                  ) : sendCompleted ? (
                    <div className="space-y-2.5">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-700 text-[11px] font-bold">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div className="text-left">
                          <span>Invoice Dispatched!</span>
                          <span className="text-[9.5px] font-normal text-emerald-600 block mt-0.5">Alerts successfully delivered via active APIs.</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSendCompleted(false);
                        }}
                        className="w-full py-2.5 bg-slate-200/70 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-[10px] uppercase tracking-wider"
                      >
                        Send Again
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleSendInvoice}
                      disabled={!channels.whatsapp && !channels.sms && !channels.email}
                      className="w-full py-3 bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ⚡ Send Monthly Invoice
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      if (!isSending) setActiveInvoice(null);
                    }}
                    disabled={isSending}
                    className="w-full py-2 bg-transparent text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-wider text-center"
                  >
                    Close Preview
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Shop Owner Profile Modal */}
      <AnimatePresence>
        {isEditOwnerProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0A1A36]/60 backdrop-blur-xs" onClick={() => setIsEditOwnerProfileOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 relative z-10 shadow-2xl border border-slate-200 animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-[#0A1A36] flex items-center gap-2">
                  <Pencil className="w-4.5 h-4.5 text-[#D28F1B]" />
                  Edit Shop Owner Profile
                </h3>
                <button onClick={() => setIsEditOwnerProfileOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!ownerName.trim()) {
                    alert("Owner Name is required.");
                    return;
                  }

                  // Update LocalStorage custom avatar & name
                  localStorage.setItem(`suvarna_owner_avatar_${currentOwner?.id || 'default'}`, ownerAvatar);
                  
                  // Update parent session in localstorage if currentOwner exists
                  if (currentOwner) {
                    const updatedOwner = {
                      ...currentOwner,
                      ownerName: ownerName,
                      avatar: ownerAvatar,
                      shopName: settings.shopName
                    };
                    localStorage.setItem('suvarna_current_owner', JSON.stringify(updatedOwner));
                  }

                  setActivities([{ 
                    id: `act-${Date.now()}`, 
                    text: `Updated shop owner profile and logo of ${ownerName}`, 
                    amount: null, 
                    time: 'Just now', 
                    type: 'update' 
                  }, ...activities]);

                  setIsEditOwnerProfileOpen(false);
                  alert("Shop Owner profile updated successfully!");
                }}
                className="space-y-4 pt-4 overflow-y-auto max-h-[75vh] pr-1 text-left"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Shop Owner Profile Picture</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="relative group shrink-0">
                      {ownerAvatar ? (
                        <img 
                          src={ownerAvatar} 
                          alt="Preview" 
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-sm" 
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-black text-xl border-2 border-slate-100 uppercase">
                          {ownerName ? ownerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'OW'}
                        </div>
                      )}
                      <label className="absolute inset-0 bg-[#0A1A36]/70 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                        <Camera className="w-4 h-4 mb-0.5 text-amber-400" />
                        <span className="text-[7px] font-extrabold uppercase tracking-widest">Upload</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setOwnerAvatar(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    
                    <div className="space-y-1 w-full text-left">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block">Or Quick Select Preset Premium Avatars:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
                          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80'
                        ].map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setOwnerAvatar(url)}
                            className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all hover:scale-105 shrink-0 ${ownerAvatar === url ? 'border-amber-500 ring-2 ring-amber-300' : 'border-slate-100 hover:border-slate-400'}`}
                          >
                            <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                      <p className="text-[8px] text-slate-400 mt-1">Supports PNG/JPG file uploads or choose a quick professional photo preset.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                    placeholder="e.g. Rajesh Verma"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Jewellery Shop Name</label>
                  <input
                    type="text"
                    value={settings.shopName}
                    onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl font-bold"
                    placeholder="e.g. Suvarna Gold Loan & Jewellery Co."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">License Plan</label>
                    <input
                      type="text"
                      disabled
                      value={currentOwner?.plan || 'Sovereign Pro'}
                      className="w-full text-xs p-2.5 border border-slate-200 bg-slate-100 rounded-xl font-bold text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">SaaS License Status</label>
                    <input
                      type="text"
                      disabled
                      value={currentOwner?.status || 'Active'}
                      className="w-full text-xs p-2.5 border border-slate-200 bg-slate-100 rounded-xl font-bold text-emerald-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditOwnerProfileOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancel</button>
                  <button type="submit" className="bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] text-[#0A1A36] px-5 py-2.5 rounded-xl text-xs font-black uppercase">Save Shop Profile</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
