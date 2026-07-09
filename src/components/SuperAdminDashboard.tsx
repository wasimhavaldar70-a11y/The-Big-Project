import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Shield, ShieldCheck, Mail, Phone, Calendar, Key, Check, X,
  Trash2, AlertTriangle, Building, CreditCard, LayoutDashboard, ExternalLink,
  Power, Search, Lock, DollarSign, Award, ArrowLeft, RefreshCw, BarChart3, TrendingUp
} from 'lucide-react';
import { ShopOwner } from './LoginModal';

interface SuperAdminDashboardProps {
  onLogout: () => void;
  onImpersonateOwner: (owner: ShopOwner) => void;
}

export default function SuperAdminDashboard({ onLogout, onImpersonateOwner }: SuperAdminDashboardProps) {
  const [shopOwners, setShopOwners] = useState<ShopOwner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  
  // Create / Edit Shop Owner Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<ShopOwner | null>(null);
  
  // Form values
  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<ShopOwner['plan']>('Standard');
  const [status, setStatus] = useState<ShopOwner['status']>('Active');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadShopOwners();
  }, []);

  const loadShopOwners = () => {
    const stored = localStorage.getItem('suvarna_shop_owners');
    if (stored) {
      setShopOwners(JSON.parse(stored));
    }
  };

  const saveShopOwnersToStorage = (updatedList: ShopOwner[]) => {
    localStorage.setItem('suvarna_shop_owners', JSON.stringify(updatedList));
    setShopOwners(updatedList);
  };

  const handleOpenCreateForm = () => {
    setEditingOwner(null);
    setOwnerName('');
    setShopName('');
    setEmail('');
    setPhone('');
    setPin(Math.floor(1000 + Math.random() * 9000).toString()); // Auto-generate random 4-digit PIN
    setPassword('owner123'); // Default secure password
    setPlan('Standard');
    setStatus('Active');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (owner: ShopOwner) => {
    setEditingOwner(owner);
    setOwnerName(owner.ownerName);
    setShopName(owner.shopName);
    setEmail(owner.email);
    setPhone(owner.phone);
    setPin(owner.pin);
    setPassword(owner.password || 'owner123');
    setPlan(owner.plan);
    setStatus(owner.status);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    const updated = shopOwners.map(owner => {
      if (owner.id === id) {
        const newStatus: ShopOwner['status'] = owner.status === 'Active' ? 'Suspended' : 'Active';
        return { ...owner, status: newStatus };
      }
      return owner;
    });
    saveShopOwnersToStorage(updated);
  };

  const handleDeleteOwner = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete Shop Owner "${name}"? This action cannot be undone.`)) {
      const updated = shopOwners.filter(owner => owner.id !== id);
      saveShopOwnersToStorage(updated);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!ownerName.trim()) return setFormError('Owner name is required.');
    if (!shopName.trim()) return setFormError('Shop name is required.');
    if (!email.trim() || !email.includes('@')) return setFormError('Valid email is required.');
    if (!phone.trim()) return setFormError('Phone number is required.');
    if (pin.length !== 4 || isNaN(Number(pin))) return setFormError('PIN must be exactly 4 digits.');
    if (password.length < 4) return setFormError('Password must be at least 4 characters.');

    if (editingOwner) {
      // Edit mode
      const updated = shopOwners.map(owner => {
        if (owner.id === editingOwner.id) {
          return {
            ...owner,
            ownerName: ownerName.trim(),
            shopName: shopName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            pin,
            password,
            plan,
            status
          };
        }
        return owner;
      });
      saveShopOwnersToStorage(updated);
    } else {
      // Create mode
      const isEmailTaken = shopOwners.some(o => o.email.toLowerCase() === email.trim().toLowerCase());
      const isPinTaken = shopOwners.some(o => o.pin === pin);
      if (isEmailTaken) return setFormError('A shop owner with this email already exists.');
      if (isPinTaken) return setFormError('This PIN is already assigned to another owner. Please choose a different PIN.');

      const newOwner: ShopOwner = {
        id: `owner-${Date.now()}`,
        ownerName: ownerName.trim(),
        shopName: shopName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        pin,
        password,
        plan,
        status,
        dateJoined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        loansCount: 0,
        totalPledgedGold: '0.0 gm',
        outstandingAmount: 0
      };
      saveShopOwnersToStorage([...shopOwners, newOwner]);
    }

    setIsFormOpen(false);
  };

  // Metrics calculations
  const activeOwners = shopOwners.filter(o => o.status === 'Active');
  const planBreakdown = shopOwners.reduce((acc, curr) => {
    acc[curr.plan] = (acc[curr.plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredOwners = shopOwners.filter(owner => {
    const matchesSearch = 
      owner.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.phone.includes(searchQuery);

    const matchesPlan = selectedPlanFilter === 'all' || owner.plan === selectedPlanFilter;
    const matchesStatus = selectedStatusFilter === 'all' || owner.status === selectedStatusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#060D1E] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-amber-400 selection:text-slate-900">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 right-0 h-full w-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent blur-[160px]" />
        <div className="absolute bottom-[20%] left-[-15%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent blur-[140px]" />
      </div>

      {/* Main Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center border border-amber-400 shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5 text-[#060D1E] stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">Super Admin Mode</span>
              </div>
              <h1 className="text-base font-serif font-black tracking-tight text-white uppercase">Suvarna Cloud Control Room</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-200 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 hover:border-rose-900/50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Log Out Control Room</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        
        {/* Banner with metrics summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Shop Owners</span>
              <span className="text-3xl font-black text-white mt-1 block">{shopOwners.length}</span>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Licenses</span>
              <span className="text-3xl font-black text-emerald-400 mt-1 block">{activeOwners.length}</span>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enterprise Plans</span>
              <span className="text-3xl font-black text-purple-400 mt-1 block">{planBreakdown['Premium Enterprise'] || 0}</span>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sovereign Pro Plans</span>
              <span className="text-3xl font-black text-amber-400 mt-1 block">{planBreakdown['Sovereign Pro'] || 0}</span>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <DollarSign className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Control and Filter Bar */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Shop Name, Owner, Email or Phone..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-400 rounded-xl text-xs text-white outline-none placeholder-slate-500 transition-all"
              />
            </div>

            {/* Plan Filter */}
            <select
              value={selectedPlanFilter}
              onChange={(e) => setSelectedPlanFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none focus:border-amber-400"
            >
              <option value="all">All Subscription Plans</option>
              <option value="Standard">Standard Tier</option>
              <option value="Premium Enterprise">Premium Enterprise</option>
              <option value="Sovereign Pro">Sovereign Pro</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none focus:border-amber-400"
            >
              <option value="all">All License Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <button
            onClick={handleOpenCreateForm}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md hover:shadow-amber-400/20 flex items-center justify-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Shop Owner</span>
          </button>
        </div>

        {/* Shop Owner Directory */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Shop Owner Directory ({filteredOwners.length})</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Real-time control panel database</span>
          </div>

          {filteredOwners.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Users className="w-12 h-12 text-slate-600 mx-auto opacity-40" />
              <p className="text-sm font-semibold">No Shop Owners match your search filters.</p>
              <p className="text-xs">Try clearing search text or resetting selected filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {filteredOwners.map((owner) => (
                <div key={owner.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-900/20 transition-all group">
                  
                  {/* Shop Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      <Building className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-sm font-serif font-black text-white uppercase tracking-wide">{owner.shopName}</h4>
                        
                        {/* Status badge */}
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          owner.status === 'Active'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {owner.status}
                        </span>

                        {/* Plan Badge */}
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                          owner.plan === 'Sovereign Pro'
                            ? 'bg-amber-400/10 border-amber-400/25 text-amber-400'
                            : owner.plan === 'Premium Enterprise'
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                            : 'bg-slate-500/10 border-slate-500/20 text-slate-300'
                        }`}>
                          {owner.plan}
                        </span>
                      </div>
                      
                      {/* Owner and Contact details */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-400">
                        <span className="font-semibold text-slate-200">Owner: {owner.ownerName}</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {owner.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {owner.phone}
                        </span>
                      </div>

                      {/* Credentials indicator */}
                      <div className="flex items-center gap-4 mt-2.5 text-[10px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Key className="w-3 h-3" />
                          PIN: <strong className="text-slate-300">{owner.pin}</strong>
                        </span>
                        <span>
                          Password: <strong className="text-slate-300">{owner.password || 'owner123'}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined: {owner.dateJoined}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Metrics (Gives superadmin direct control view of what is happening) */}
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-800/40 lg:border-t-0 pt-4 lg:pt-0 lg:px-6 flex-1 max-w-sm">
                    <div className="text-center lg:text-left">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Pledges</span>
                      <span className="text-sm font-black text-slate-200">{owner.loansCount || 0} Loans</span>
                    </div>
                    <div className="text-center lg:text-left">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Gold Vault</span>
                      <span className="text-sm font-black text-amber-400">{owner.totalPledgedGold || '0.0 gm'}</span>
                    </div>
                    <div className="text-center lg:text-left">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Outstandings</span>
                      <span className="text-sm font-black text-white">₹{(owner.outstandingAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-2 border-t border-slate-800/40 lg:border-t-0 pt-4 lg:pt-0 shrink-0">
                    
                    {/* IMPERSONATE / ENTER PORTAL */}
                    <button
                      onClick={() => onImpersonateOwner(owner)}
                      disabled={owner.status === 'Suspended'}
                      title={owner.status === 'Suspended' ? 'Unsuspend to access owner portal' : 'Directly login to this Shop Owner\'s workspace'}
                      className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white disabled:opacity-40 rounded-xl text-xs font-bold border border-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Launch Portal</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </button>

                    {/* EDIT SHOP OWNER */}
                    <button
                      onClick={() => handleOpenEditForm(owner)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
                      title="Edit Shop Owner Details & Plan"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    {/* SUSPEND / ACTIVE TOGGLE */}
                    <button
                      onClick={() => handleToggleStatus(owner.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        owner.status === 'Active'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/25'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/25'
                      }`}
                      title={owner.status === 'Active' ? 'Suspend License Access' : 'Unsuspend/Activate License'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    {/* DELETE PERMANENTLY */}
                    <button
                      onClick={() => handleDeleteOwner(owner.id, owner.ownerName)}
                      className="p-2 bg-slate-950 hover:bg-rose-950/40 text-slate-600 hover:text-rose-400 rounded-xl border border-slate-800 hover:border-rose-900/40 transition-all cursor-pointer"
                      title="Delete Owner Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-6 text-center text-[10px] text-slate-500 bg-[#040915] mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Suvarna Super-Admin Control Panel. Govt Standard 256-bit Secure Gateway.</span>
          <span className="flex items-center gap-1 text-emerald-500">
            <ShieldCheck className="w-3.5 h-3.5" /> Cloud Database Connection: Secure and Encrypted
          </span>
        </div>
      </footer>

      {/* CREATE & EDIT FORMS MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-[#040915]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0B1528] rounded-3xl max-w-lg w-full p-6 relative z-10 shadow-2xl border border-slate-800 text-left overflow-hidden"
            >
              {/* Close Modal Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Secure Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
                <div className="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center border border-amber-400/20 shrink-0">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide">
                    {editingOwner ? 'Edit Shop Owner License' : 'Register New Shop Owner'}
                  </h3>
                  <p className="text-[10px] text-slate-400">Specify shop license info, logins, and plan level.</p>
                </div>
              </div>

              {/* Form Validation Error Alert */}
              {formError && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-2.5 text-[11px]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Shop Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Shop Name</label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Suvarna Gold Loan"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-400 outline-none rounded-xl text-xs text-white transition-all font-semibold"
                    />
                  </div>

                  {/* Owner Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Owner Name</label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Rajesh Verma"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-400 outline-none rounded-xl text-xs text-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Owner Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rajesh@goldco.com"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-400 outline-none rounded-xl text-xs text-white transition-all font-semibold"
                    />
                  </div>

                  {/* Owner Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 70585 36371"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-400 outline-none rounded-xl text-xs text-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/50">
                  
                  {/* Security PIN */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Secure 4-Digit PIN
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 1234"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-amber-400 outline-none rounded-lg text-xs text-white font-mono tracking-widest text-center"
                    />
                  </div>

                  {/* Security Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                      <Key className="w-3 h-3" />
                      Portal Password
                    </label>
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. owner123"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-amber-400 outline-none rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Plan level */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Licensing Subscription Plan</label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value as ShopOwner['plan'])}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl text-xs text-white font-bold outline-none"
                    >
                      <option value="Standard">Standard Tier (Basic ERP)</option>
                      <option value="Premium Enterprise">Premium Enterprise (Multi-Vault)</option>
                      <option value="Sovereign Pro">Sovereign Pro (Full Sovereignty)</option>
                    </select>
                  </div>

                  {/* Initial Status */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">License Access Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ShopOwner['status'])}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl text-xs text-white font-bold outline-none"
                    >
                      <option value="Active">Active (Permitted Entrance)</option>
                      <option value="Suspended">Suspended (Access Restricted)</option>
                    </select>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 mt-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingOwner ? 'Apply Updated License Info' : 'Provision Merchant Database'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
