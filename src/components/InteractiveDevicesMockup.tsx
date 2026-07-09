import React, { useState, useEffect } from 'react';
import { Customer, GoldLoan } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_LOANS, GOLD_RATES } from '../data';
import { 
  TrendingUp, Users, Award, Calendar, ChevronRight, Search, Plus, 
  Settings, Info, User, CheckCircle2, ShieldCheck, PieChart, BarChart2,
  Lock, ArrowRight, Laptop, Smartphone, Sparkles, Scale, IndianRupee, RotateCcw
} from 'lucide-react';

export default function InteractiveDevicesMockup() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'loans' | 'settings'>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [loans, setLoans] = useState<GoldLoan[]>(INITIAL_LOANS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUST12345');
  const [rates, setRates] = useState(GOLD_RATES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom interactive: Add Customer state
  const [showAddCustModal, setShowAddCustModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustWeight, setNewCustWeight] = useState(15);
  const [newCustPurity, setNewCustPurity] = useState<'24K' | '22K' | '18K'>('22K');

  // Customer sync with mobile
  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const activeCustomerLoans = loans.filter(l => l.customerId === activeCustomer.id);
  const primaryLoan = activeCustomerLoans[0] || null;

  // Real-time calculations for metrics
  const totalCustomers = customers.length + 12454; // add base from screenshot
  const activeLoansCount = loans.filter(l => l.status === 'Active').length + 8650;
  const overdueLoansCount = loans.filter(l => l.status === 'Overdue').length + 243;
  const closedLoansCount = loans.filter(l => l.status === 'Closed').length + 1244;
  
  const totalLoanPortfolioValue = loans.reduce((acc, l) => l.status !== 'Closed' ? acc + l.amount : acc, 0) + 245500000;
  const totalOutstandingValue = loans.reduce((acc, l) => l.status === 'Active' ? acc + l.amount : acc, 0) + 87100000;
  const totalGoldWeightKg = (loans.reduce((acc, l) => l.status !== 'Closed' ? acc + l.weight : acc, 0) / 1000) + 125.65;

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    const newId = `CUST${Math.floor(10000 + Math.random() * 90000)}`;
    const loanAmount = Math.round(newCustWeight * rates[newCustPurity] * 0.75); // 75% LTV

    const newCust: Customer = {
      id: newId,
      name: newCustName,
      phone: newCustPhone,
      kycStatus: 'Verified',
      activeLoansCount: 1,
      totalPledgedWeight: newCustWeight,
      totalLoanAmount: loanAmount,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?q=80&w=256&auto=format&fit=crop`
    };

    const newLoan: GoldLoan = {
      id: `LN${Math.floor(9000 + Math.random() * 1000)}`,
      customerName: newCustName,
      customerId: newId,
      amount: loanAmount,
      interestRate: 1.2,
      weight: newCustWeight,
      purity: newCustPurity,
      pledgedItem: `Gold ${newCustPurity === '24K' ? 'Bar' : newCustPurity === '22K' ? 'Bangles' : 'Chain'} (${newCustWeight}g)`,
      dueDate: '2026-12-15',
      status: 'Active'
    };

    setCustomers([newCust, ...customers]);
    setLoans([newLoan, ...loans]);
    setSelectedCustomerId(newId);
    
    // reset form
    setNewCustName('');
    setNewCustPhone('');
    setNewCustWeight(15);
    setShowAddCustModal(false);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
      {/* Interactive Helper Overlay Info */}
      <div className="absolute top-0 left-4 z-20 flex items-center gap-1.5 bg-gold-100 text-gold-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow border border-gold-200">
        <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
        <span>Try interacting! Change tabs or select clients to see devices sync live.</span>
      </div>

      <div className="relative pt-10 pb-20">
        {/* BACKDROP BLUR ACCENTS */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-gold-100 rounded-full blur-[100px] opacity-70 -z-10"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-50 rounded-full blur-[100px] opacity-60 -z-10"></div>

        {/* MOCKUP ROW: LAPTOP + PHONE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative">
          
          {/* LAPTOP (MacBook Pro styling) - col-span-9 */}
          <div className="lg:col-span-9 w-full relative z-10">
            
            {/* SLEEK LAPTOP CONTAINER */}
            <div className="bg-slate-950 p-3 rounded-t-[2.5rem] shadow-2xl border-t border-slate-800">
              
              {/* LAPTOP SCREEN BEZEL */}
              <div className="bg-slate-900 rounded-[1.8rem] overflow-hidden border border-slate-800 relative aspect-[16/10.3] flex flex-col">
                
                {/* CAMERA NOTCH */}
                <div className="absolute top-0 inset-x-0 flex justify-center z-40">
                  <div className="bg-slate-950 w-24 h-4 rounded-b-lg flex items-center justify-center gap-1.5 px-3">
                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* ERP SOFTWARE HEADER BAR */}
                <div className="bg-slate-950 h-11 border-b border-slate-800 flex items-center justify-between px-4 text-xs select-none z-30">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gold-500/20 rounded border border-gold-500 flex items-center justify-center">
                        <span className="text-[10px] text-gold-500 font-bold">S</span>
                      </div>
                      <span className="font-bold text-white tracking-tight">SuvarnaLoan ERP</span>
                    </div>
                    {/* Window Controls */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-md py-1 px-2 text-[10px] text-slate-400">
                      <Lock className="w-3 h-3 text-gold-500" />
                      <span>Secure Vault Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center font-bold text-[9px] text-gold-400 border border-gold-500/30">
                        TH
                      </div>
                      <span className="text-slate-300 font-medium hidden md:inline">Tanishq Jewellery</span>
                    </div>
                  </div>
                </div>

                {/* ERP INNER WORKSPACE CONTAINER */}
                <div className="flex-1 flex bg-[#f8fafc] text-slate-800 overflow-hidden relative">
                  
                  {/* SIDEBAR */}
                  <div className="w-14 sm:w-44 bg-slate-950 text-slate-400 border-r border-slate-900 p-2 flex flex-col justify-between select-none shrink-0 z-20">
                    <div className="space-y-1">
                      <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          activeTab === 'dashboard' 
                            ? 'bg-gold-500 text-white font-bold shadow-lg shadow-gold-500/15' 
                            : 'hover:bg-slate-900 hover:text-slate-100'
                        }`}
                      >
                        <PieChart className="w-4 h-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('customers')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          activeTab === 'customers' 
                            ? 'bg-gold-500 text-white font-bold shadow-lg shadow-gold-500/15' 
                            : 'hover:bg-slate-900 hover:text-slate-100'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">Customers</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('loans')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          activeTab === 'loans' 
                            ? 'bg-gold-500 text-white font-bold shadow-lg shadow-gold-500/15' 
                            : 'hover:bg-slate-900 hover:text-slate-100'
                        }`}
                      >
                        <Award className="w-4 h-4" />
                        <span className="hidden sm:inline">Gold Loans</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          activeTab === 'settings' 
                            ? 'bg-gold-500 text-white font-bold shadow-lg shadow-gold-500/15' 
                            : 'hover:bg-slate-900 hover:text-slate-100'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Live Settings</span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-slate-900 hidden sm:block">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                        <span>Liveness Server v2.4</span>
                      </div>
                    </div>
                  </div>

                  {/* MAIN CANVAS */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:pr-[250px] text-left">
                    
                    {/* VIEW: DASHBOARD */}
                    {activeTab === 'dashboard' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900">Dashboard</h4>
                            <p className="text-[10px] text-slate-500">Overview of your jewellery store loan activity.</p>
                          </div>
                          <span className="text-[9px] sm:text-[10px] bg-gold-50 text-gold-700 border border-gold-200 px-2 py-0.5 sm:py-1 rounded-full font-bold">
                            Rate (22K): ₹{rates["22K"]}/g
                          </span>
                        </div>

                        {/* STATS TILES ROW */}
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Total Portfolio</span>
                            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 block mt-1">
                              ₹{(totalLoanPortfolioValue / 10000000).toFixed(2)} Cr
                            </span>
                            <span className="text-[8px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-0.5 leading-none">
                              <TrendingUp className="w-2 h-2" /> +12.5%
                            </span>
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Total Customers</span>
                            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 block mt-1">
                              {totalCustomers.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[8px] text-slate-400 block mt-1 leading-none">Registered clients</span>
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Active Loans</span>
                            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 block mt-1">
                              {activeLoansCount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[8px] text-amber-500 font-bold block mt-1 leading-none">In vault storage</span>
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Outstanding</span>
                            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 block mt-1">
                              ₹{(totalOutstandingValue / 10000000).toFixed(2)} Cr
                            </span>
                            <span className="text-[8px] text-slate-500 block mt-1 leading-none">Due collection</span>
                          </div>
                        </div>

                        {/* GRID FOR PORTFOLIO LINE CHART & LOAN STATUS CHART */}
                        <div className="grid grid-cols-1 gap-3">
                          
                          {/* Portfolio line graph placeholder */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-1.5">
                              <span className="text-[9px] font-bold text-slate-700">Loan Portfolio Trend</span>
                              <span className="text-[8px] text-slate-400">Past 6 months</span>
                            </div>
                            {/* Graphic lines representation */}
                            <div className="h-20 flex items-end gap-1 px-1 relative">
                              <div className="absolute top-1 right-2 bg-amber-50 border border-gold-200 text-gold-700 font-mono text-[8px] font-bold px-1 py-0.25 rounded">
                                Current: ₹{(totalLoanPortfolioValue / 10000000).toFixed(2)} Cr
                              </div>
                              <div className="w-full h-1/3 bg-slate-100 rounded-t hover:bg-gold-200 transition-colors cursor-pointer" title="Jan: ₹18.4Cr"></div>
                              <div className="w-full h-[45%] bg-slate-100 rounded-t hover:bg-gold-200 transition-colors cursor-pointer" title="Feb: ₹19.1Cr"></div>
                              <div className="w-full h-[55%] bg-slate-100 rounded-t hover:bg-gold-200 transition-colors cursor-pointer" title="Mar: ₹20.5Cr"></div>
                              <div className="w-full h-[68%] bg-slate-100 rounded-t hover:bg-gold-200 transition-colors cursor-pointer" title="Apr: ₹21.8Cr"></div>
                              <div className="w-full h-[80%] bg-gold-100 rounded-t hover:bg-gold-400 transition-colors cursor-pointer" title="May: ₹23.2Cr"></div>
                              <div className="w-full h-full bg-gold-500 rounded-t cursor-pointer" title="Jun: ₹24.58Cr"></div>
                            </div>
                            <div className="flex justify-between text-[8px] text-slate-400 mt-1.5 font-mono">
                              <span>Jan</span>
                              <span>Feb</span>
                              <span>Mar</span>
                              <span>Apr</span>
                              <span>May</span>
                              <span>Jun</span>
                            </div>
                          </div>

                          {/* Doughnut status representation */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-slate-700 block mb-1.5 border-b border-slate-100 pb-1.5">Loan Status Breakdown</span>
                            <div className="flex items-center gap-3">
                              {/* Radial donut SVG */}
                              <div className="w-12 h-12 shrink-0 relative flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                  <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="text-emerald-500" strokeDasharray="80, 100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="text-amber-500" strokeDasharray="8, 100" strokeDashoffset="-80" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="text-slate-400" strokeDasharray="12, 100" strokeDashoffset="-88" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-[7px] font-bold leading-none">
                                  <span className="text-slate-800">8.6k</span>
                                  <span className="text-[5px] text-slate-400">Active</span>
                                </div>
                              </div>
                              {/* Legends */}
                              <div className="space-y-0.5 text-[8px] flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-emerald-500"></span> Active:</span>
                                  <span className="font-mono font-bold">{activeLoansCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-amber-500"></span> Overdue:</span>
                                  <span className="font-mono font-bold">{overdueLoansCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-slate-400"></span> Closed:</span>
                                  <span className="font-mono font-bold">{closedLoansCount}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* VIEW: CUSTOMERS */}
                    {activeTab === 'customers' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base sm:text-lg font-bold text-slate-900">Customer Accounts</h4>
                            <p className="text-[10px] sm:text-xs text-slate-500">Add or manage registered gold-borrowers with synchronized KYC profiles.</p>
                          </div>
                          <button 
                            onClick={() => setShowAddCustModal(true)}
                            className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-sm shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Customer
                          </button>
                        </div>

                        {/* Simple Search */}
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2 text-slate-400 w-3.5 h-3.5" />
                          <input 
                            type="text" 
                            placeholder="Search by name, phone or KYC status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                          />
                        </div>

                        {/* Customer list table */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                          <div className="overflow-x-auto select-none no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[360px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-[8px] text-slate-500 uppercase tracking-wider">
                                  <th className="p-2">Name / ID</th>
                                  <th className="p-2">KYC Status</th>
                                  <th className="p-2">Loans</th>
                                  <th className="p-2">Gold</th>
                                  <th className="p-2 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="text-[10px] divide-y divide-slate-100">
                                {customers
                                  .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.kycStatus.toLowerCase().includes(searchQuery.toLowerCase()))
                                  .map((c) => (
                                    <tr 
                                      key={c.id} 
                                      onClick={() => setSelectedCustomerId(c.id)}
                                      className={`cursor-pointer transition-colors ${
                                        selectedCustomerId === c.id ? 'bg-gold-50/50 font-medium' : 'hover:bg-slate-50/60'
                                      }`}
                                    >
                                      <td className="p-2 flex items-center gap-1.5">
                                        <img src={c.avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                                        <div>
                                          <span className="text-slate-800 font-semibold block leading-tight">{c.name}</span>
                                          <span className="text-[7.5px] text-slate-400 font-mono block leading-none">{c.id}</span>
                                        </div>
                                      </td>
                                      <td className="p-2">
                                        <span className={`px-1.5 py-0.25 rounded-full text-[7.5px] font-bold ${
                                          c.kycStatus === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                        }`}>
                                          {c.kycStatus}
                                        </span>
                                      </td>
                                      <td className="p-2 font-mono text-[9px]">{c.activeLoansCount}</td>
                                      <td className="p-2 font-mono text-[9px] font-semibold">{c.totalPledgedWeight} g</td>
                                      <td className="p-2 text-right">
                                        <span className="text-gold-600 font-bold hover:underline text-[8px]">
                                          Sync
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VIEW: LOANS */}
                    {activeTab === 'loans' && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-slate-900">Gold Pledge Receipts</h4>
                          <p className="text-[10px] sm:text-xs text-slate-500">Live collateral transactions, asset description, weight & active balances.</p>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                          <div className="overflow-x-auto select-none no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[400px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-[8px] text-slate-500 uppercase tracking-wider">
                                  <th className="p-2">Loan ID</th>
                                  <th className="p-2">Customer</th>
                                  <th className="p-2">Pledge Item / Purity</th>
                                  <th className="p-2">Disbursed</th>
                                  <th className="p-2">Status</th>
                                </tr>
                              </thead>
                              <tbody className="text-[10px] divide-y divide-slate-100">
                                {loans.map((l) => (
                                  <tr key={l.id} className="hover:bg-slate-50/50">
                                    <td className="p-2 font-mono text-[9px] font-bold text-slate-600">{l.id}</td>
                                    <td className="p-2 font-semibold text-slate-800">{l.customerName}</td>
                                    <td className="p-2 text-slate-500">
                                      <span className="block text-[10px] font-medium text-slate-700">{l.pledgedItem}</span>
                                      <span className="text-[7.5px] bg-slate-100 text-slate-600 font-bold px-1 rounded">{l.purity} Gold</span>
                                    </td>
                                    <td className="p-2 font-mono font-bold text-slate-900">
                                      ₹{l.amount.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-2">
                                      <span className={`px-1.5 py-0.25 rounded-full text-[7.5px] font-bold ${
                                        l.status === 'Active' 
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                          : l.status === 'Overdue'
                                          ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                                      }`}>
                                        {l.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VIEW: SETTINGS */}
                    {activeTab === 'settings' && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-slate-900">Global Gold Settings</h4>
                          <p className="text-[10px] sm:text-xs text-slate-500">Adjust gold rates per gram to recalculate assets values and maximum loans dynamically.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          {(['24K', '22K', '18K'] as const).map((k) => (
                            <div key={k} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{k} Gold Rate</span>
                              <div className="flex items-center gap-1.5 mb-2">
                                <span className="font-bold text-slate-900 text-sm">₹</span>
                                <input 
                                  type="number" 
                                  value={rates[k]}
                                  onChange={(e) => setRates({...rates, [k]: Number(e.target.value)})}
                                  className="w-full font-mono text-base font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-gold-500"
                                />
                              </div>
                              <span className="text-[9px] text-slate-400 block">per gram (Market rate)</span>
                            </div>
                          ))}
                        </div>

                        {/* Reset button */}
                        <button 
                          onClick={() => setRates(GOLD_RATES)}
                          className="text-xs text-slate-500 hover:text-gold-600 font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reset to standard rates
                        </button>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            </div>

            {/* LAPTOP KEYBOARD BASE BASE */}
            <div className="bg-slate-900 h-4 rounded-b-2xl border-b-2 border-slate-950 mx-4 shadow-lg flex justify-center">
              <div className="w-24 h-1.5 bg-slate-950 rounded-b"></div>
            </div>
            
          </div>

          {/* MOBILE PHONE MOCKUP (Overlaps the Laptop Screen) - col-span-3 */}
          <div className="lg:col-span-3 w-72 mx-auto lg:absolute lg:-right-4 lg:bottom-4 z-20">
            
            {/* PHONE CASE CONTAINER (iPhone Style) */}
            <div className="bg-slate-950 p-2.5 rounded-[2.5rem] shadow-2xl border border-slate-800 glow-gold">
              
              {/* PHONE SCREEN BEZEL */}
              <div className="bg-slate-900 rounded-[2.1rem] overflow-hidden relative aspect-[9/18.5] flex flex-col border border-slate-800">
                
                {/* DYNAMIC ISLAND notch */}
                <div className="absolute top-2 inset-x-0 flex justify-center z-40">
                  <div className="bg-slate-950 w-20 h-4.5 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
                  </div>
                </div>

                {/* STATUS BAR */}
                <div className="bg-white h-8 pt-3 px-5 flex justify-between items-center text-[9px] font-bold text-slate-800 select-none z-30 shrink-0">
                  <span>18:32</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] tracking-tighter">5G</span>
                    <div className="w-4 h-2 border border-slate-800 rounded-sm p-0.5">
                      <div className="h-full w-full bg-emerald-500 rounded-2xs"></div>
                    </div>
                  </div>
                </div>

                {/* MOBILE CLIENT VIEW */}
                <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col justify-between overflow-y-auto text-left">
                  
                  {/* APP HEADER */}
                  <div className="bg-white p-3 pt-2 border-b border-slate-100 flex items-center justify-between shadow-sm shrink-0">
                    <span className="text-[10px] font-bold text-slate-400">Customer Details</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">Verified KYC</span>
                  </div>

                  {/* ACTIVE CUSTOMER SYNCED BODY */}
                  <div className="flex-1 p-3.5 space-y-3">
                    
                    {/* Customer Info Card */}
                    <div className="flex items-center gap-2.5 bg-white p-2 rounded-xl shadow-xs border border-slate-100">
                      <img 
                        src={activeCustomer.avatar} 
                        alt={activeCustomer.name} 
                        className="w-10 h-10 rounded-full object-cover border border-gold-200" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="font-bold text-xs text-slate-800 leading-tight">{activeCustomer.name}</h5>
                        <p className="text-[9px] text-slate-400 font-mono">{activeCustomer.id}</p>
                      </div>
                    </div>

                    {/* Loan Summary Summary */}
                    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-xs space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Loan Summary</span>
                      
                      <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Total Principal</span>
                          <span className="font-mono text-xs font-bold text-slate-900">
                            ₹{activeCustomer.totalLoanAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Active</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <div>
                          <span className="text-slate-400 block text-[9px]">Monthly Interest</span>
                          <span className="font-semibold text-slate-700 font-mono">
                            ₹{primaryLoan ? Math.round(primaryLoan.amount * (primaryLoan.interestRate / 100)).toLocaleString('en-IN') : '₹0'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">Next Due Date</span>
                          <span className="font-semibold text-slate-700 font-mono">
                            {primaryLoan ? primaryLoan.dueDate : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pledged Items List */}
                    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-xs space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pledged Collateral</span>
                      {primaryLoan ? (
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-100 text-gold-600">
                            <Scale className="w-3.5 h-3.5" />
                          </div>
                          <div className="text-[10px]">
                            <span className="font-semibold text-slate-800 block leading-tight">{primaryLoan.pledgedItem}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{primaryLoan.weight} grams • {primaryLoan.purity} Purity</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400">No active pledge history.</p>
                      )}

                      <button className="w-full mt-1.5 border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[9px] py-1.5 rounded-lg transition-colors text-center">
                        View All Assets
                      </button>
                    </div>

                  </div>

                  {/* BOTTOM TAP BAR */}
                  <div className="bg-white border-t border-slate-100 py-1.5 px-3 flex justify-around items-center text-[8px] font-bold text-slate-400 shrink-0">
                    <div className="flex flex-col items-center gap-0.5 text-gold-500">
                      <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                      <span>Dashboard</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Loans</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Payments</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>More</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>

        {/* MARBLE DESKTOP SHELF + GOLD ORNAMENTS REPRESENTATION */}
        <div className="mt-[-15px] relative h-20 bg-gradient-to-b from-white/95 to-slate-200/50 rounded-2xl border-t border-white/50 backdrop-blur-md shadow-xl flex items-center justify-center px-4 select-none">
          <div className="absolute inset-0 bg-marble-gradient opacity-10 rounded-2xl"></div>
          {/* Ornaments Row */}
          <div className="flex gap-16 text-slate-400 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 rounded-full ring-2 ring-white shadow"></span>
              <span className="text-[10px] text-slate-500">Pure Gold 24K</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-gradient-to-tr from-amber-600 via-yellow-500 to-yellow-300 rounded-full ring-2 ring-white shadow"></span>
              <span className="text-[10px] text-slate-500">Jewellery 22K</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-gradient-to-tr from-yellow-600 via-amber-500 to-amber-200 rounded-full ring-2 ring-white shadow"></span>
              <span className="text-[10px] text-slate-500">Standard 18K</span>
            </div>
          </div>
        </div>

      </div>

      {/* QUICK INNER MODAL FOR CUSTOMER DISBURSAL DEMO */}
      {showAddCustModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gold-100 text-left">
            <h5 className="font-bold text-base text-slate-800 mb-2">Simulate Customer Disbursal</h5>
            <p className="text-xs text-slate-500 mb-4">Add a new client and automatically pledge gold ornaments to see statistics sync.</p>
            
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Priyesh Patel"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile No.</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. +91 94522 12345"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gold (g)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={newCustWeight}
                    onChange={(e) => setNewCustWeight(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Purity</label>
                  <select 
                    value={newCustPurity}
                    onChange={(e) => setNewCustPurity(e.target.value as '24K' | '22K' | '18K')}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                  >
                    <option value="24K">24K</option>
                    <option value="22K">22K</option>
                    <option value="18K">18K</option>
                  </select>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg text-[10px] text-gold-700 leading-normal">
                Estimated disbursal at 75% LTV: <strong>₹{Math.round(newCustWeight * rates[newCustPurity] * 0.75).toLocaleString('en-IN')}</strong>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddCustModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold px-3 py-1.5"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow"
                >
                  Confirm Disbursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
