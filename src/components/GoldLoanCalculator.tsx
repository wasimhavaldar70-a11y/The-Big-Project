import { useState, useEffect } from 'react';
import { GOLD_RATES } from '../data';
import { 
  IndianRupee, Scale, Percent, ShieldCheck, ArrowRight, Sparkles, 
  TrendingUp, Calendar, Info, FileText, Download, CheckCircle, 
  Plus, Minus, Landmark, Printer, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GoldLoanCalculator() {
  const [weight, setWeight] = useState<number>(45);
  const [purity, setPurity] = useState<'24K' | '22K' | '18K'>('22K');
  const [ltv, setLtv] = useState<number>(75); // Loan-To-Value ratio
  const [monthlyRate, setMonthlyRate] = useState<number>(1.2); // interest rate %
  const [tenure, setTenure] = useState<number>(6); // months
  const [activeTab, setActiveTab] = useState<'savings' | 'schedule'>('savings');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [selectedScheme, setSelectedScheme] = useState<string>('Standard');

  // Realistic historical gold rate points for the 7-day trend graph
  const [chartData, setChartData] = useState<number[]>([]);

  // Generate simulated historic price points for the selected karat
  useEffect(() => {
    const baseRate = GOLD_RATES[purity];
    // Seeded variations to make the graph look natural but consistent
    const variations = [0.985, 0.992, 1.005, 0.998, 1.012, 1.003, 1.0];
    setChartData(variations.map(v => Math.round(baseRate * v)));
  }, [purity]);

  const currentRatePerGram = GOLD_RATES[purity];
  const totalGoldValue = Math.round(weight * currentRatePerGram);
  const maxLoanAmount = Math.round(totalGoldValue * (ltv / 100));
  const monthlyInterest = Math.round(maxLoanAmount * (monthlyRate / 100));
  const totalInterestOverTenure = monthlyInterest * tenure;
  const totalRepayable = maxLoanAmount + totalInterestOverTenure;

  // Comparison savings (Traditional money lenders charge 3.0% to 4.0% per month!)
  const traditionalMonthlyRate = 3.0;
  const traditionalInterest = Math.round(maxLoanAmount * (traditionalMonthlyRate / 100));
  const traditionalTotalInterest = traditionalInterest * tenure;
  const traditionalSavings = traditionalTotalInterest - totalInterestOverTenure;

  // Handler for Scheme selection
  const applyScheme = (schemeName: string, rate: number, ltvValue: number) => {
    setSelectedScheme(schemeName);
    setMonthlyRate(rate);
    setLtv(ltvValue);
  };

  // Generate table rows for the repayment schedule
  const scheduleRows = Array.from({ length: tenure }, (_, i) => {
    const month = i + 1;
    const interestAccrued = monthlyInterest * month;
    const balance = maxLoanAmount + interestAccrued;
    return { month, principal: maxLoanAmount, interestAccrued, balance };
  });

  return (
    <div id="calculator" className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
      {/* Left Input Side */}
      <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Sparkles className="w-5 h-5 text-[#D28F1B]" />
          </span>
          <div>
            <h3 className="text-lg font-black text-[#0A1A36]">Instant Gold Valuation & Loan Suite</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">Premium Estimate & Pricing Engine</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Provide dynamic estimations, calculate real-time savings over unorganized financiers, and review month-on-month principal interest schedules instantly.
        </p>

        <div className="space-y-5">
          {/* Gold Weight */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-black text-[#0A1A36] uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#D28F1B]" /> Gold Weight (Grams)
              </label>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setWeight(prev => Math.max(5, prev - 1))}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-sm font-black text-slate-800 shrink-0 w-12 text-center">
                  {weight} g
                </span>
                <button 
                  type="button" 
                  onClick={() => setWeight(prev => Math.min(500, prev + 1))}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="1"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5 uppercase font-mono">
              <span>5g</span>
              <span>100g</span>
              <span>250g</span>
              <span>500g</span>
            </div>
          </div>

          {/* Gold Purity & Live Ticker Row */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#0A1A36] uppercase tracking-wider block">
              Purity Level & Live Price Ticker
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['24K', '22K', '18K'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setPurity(k)}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all border text-center flex flex-col items-center justify-center relative ${
                    purity === k
                      ? 'bg-gradient-to-br from-[#DF9F28] to-[#D28F1B] border-amber-500 text-[#0A1A36] shadow-md scale-[1.02]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {purity === k && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                  <span className="font-extrabold text-sm">{k} Gold</span>
                  <span className={`text-[10px] mt-0.5 font-mono ${purity === k ? 'text-[#0A1A36]/80 font-bold' : 'text-slate-400'}`}>
                    ₹{GOLD_RATES[k]}/g
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Market Trend Chart Mockup (SVG) */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold tracking-widest text-amber-400 uppercase flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {purity} 7-Day Market Trend
              </span>
              <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                +1.4% (Live)
              </span>
            </div>
            
            {/* Custom SVG Line Chart */}
            <div className="h-20 w-full relative">
              {chartData.length > 0 && (
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DF9F28" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#DF9F28" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />

                  {/* Area fill */}
                  <path
                    d={`M 0 80 
                        L 0 ${80 - ((chartData[0] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 50 ${80 - ((chartData[1] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 100 ${80 - ((chartData[2] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 150 ${80 - ((chartData[3] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 200 ${80 - ((chartData[4] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 250 ${80 - ((chartData[5] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 300 ${80 - ((chartData[6] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 300 80 Z`}
                    fill="url(#chart-grad)"
                    className="transition-all duration-500 ease-in-out"
                  />

                  {/* Line */}
                  <path
                    d={`M 0 ${80 - ((chartData[0] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 50 ${80 - ((chartData[1] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 100 ${80 - ((chartData[2] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 150 ${80 - ((chartData[3] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 200 ${80 - ((chartData[4] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 250 ${80 - ((chartData[5] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50} 
                        L 300 ${80 - ((chartData[6] - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50}`}
                    fill="none"
                    stroke="#DF9F28"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-in-out"
                  />

                  {/* Decorative Dots on values */}
                  {chartData.map((val, idx) => {
                    const x = idx * 50;
                    const y = 80 - ((val - GOLD_RATES[purity] * 0.95) / (GOLD_RATES[purity] * 0.1)) * 50;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#fff"
                        stroke="#D28F1B"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:r-4 transition-all"
                      />
                    );
                  })}
                </svg>
              )}
            </div>
            
            {/* X-axis days */}
            <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-1.5">
              <span>6 Days ago</span>
              <span>4 Days ago</span>
              <span>2 Days ago</span>
              <span>Today (Live)</span>
            </div>
          </div>

          {/* Quick SaaS Pre-Configured Loan Schemes */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#0A1A36] uppercase tracking-wider block">
              Pre-Configured Financial Schemes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { name: 'Sovereign Low Rate', rate: 0.9, ltv: 70, desc: 'Ultra safe, premium tier' },
                { name: 'Standard Liquidity', rate: 1.2, ltv: 75, desc: 'Optimized RBI compliance' },
                { name: 'Bullet Repayment', rate: 1.5, ltv: 80, desc: 'Zero monthly interest pressure' }
              ].map((sch) => (
                <button
                  key={sch.name}
                  type="button"
                  onClick={() => applyScheme(sch.name, sch.rate, sch.ltv)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedScheme === sch.name
                      ? 'border-amber-500 bg-amber-50/40 text-[#0A1A36] ring-2 ring-amber-300/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="text-[10px] font-extrabold uppercase tracking-wide leading-none">{sch.name}</p>
                  <div className="flex justify-between items-center mt-1.5 text-[9px] font-bold text-slate-500">
                    <span className="text-[#D28F1B] font-extrabold">{sch.rate}%/mo</span>
                    <span>LTV: {sch.ltv}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Sliders & Tenure side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {/* LTV */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">LTV Ratio</span>
                <span className="font-mono text-xs font-black text-slate-800">{ltv}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="85"
                step="5"
                value={ltv}
                onChange={(e) => {
                  setLtv(Number(e.target.value));
                  setSelectedScheme('Custom');
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Monthly Rate</span>
                <span className="font-mono text-xs font-black text-slate-800">{monthlyRate}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={monthlyRate}
                onChange={(e) => {
                  setMonthlyRate(Number(e.target.value));
                  setSelectedScheme('Custom');
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Tenure Selector */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Tenure Limit</span>
                <span className="font-mono text-xs font-black text-[#D28F1B]">{tenure} Months</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[3, 6, 9, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTenure(m)}
                    className={`py-1 text-[10px] rounded-lg font-black border transition-all ${
                      tenure === m
                        ? 'bg-[#0A1A36] text-white border-[#0A1A36]'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Output Side */}
      <div className="p-6 sm:p-8 lg:p-10 lg:col-span-5 bg-gradient-to-br from-[#0F2245] via-[#0A1A36] to-[#040D1E] text-white flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-[#DF9F28]/30 shadow-2xl">
        
        {/* Glowing Ambient gold accent blur */}
        <div className="absolute -right-24 -top-24 w-60 h-60 bg-[#D28F1B]/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-400 block mb-1">
                💎 VALUATION REPORT 💎
              </span>
              <h4 className="text-xl font-extrabold text-white">
                Estimated Collateral
              </h4>
            </div>
            <div className="bg-amber-500/10 text-amber-300 text-[9px] font-bold border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {purity} / LTV: {ltv}%
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-400 font-medium">Total Gold Valuation:</span>
              <span className="font-mono font-black text-amber-200 text-sm">
                ₹{totalGoldValue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-400 font-medium">LTV Approved Limit:</span>
              <span className="font-mono font-medium text-slate-300">
                ₹{Math.round(totalGoldValue * (ltv / 100)).toLocaleString('en-IN')} ({ltv}%)
              </span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-white font-extrabold">Instant Loan Offer:</span>
              <span className="font-mono font-black text-xl text-yellow-300 drop-shadow-[0_2px_10px_rgba(250,204,21,0.25)]">
                ₹{maxLoanAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 pt-2 border-t border-white/5">
              <span className="text-slate-400 font-medium">Rate of Interest:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {monthlyRate}% / month
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-400 font-medium">Interest Due Monthly:</span>
              <span className="font-mono text-amber-200 font-medium">
                ₹{monthlyInterest.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-400 font-medium">Total Interest ({tenure}M):</span>
              <span className="font-mono text-amber-200 font-medium">
                ₹{totalInterestOverTenure.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-white/10 text-white font-extrabold mt-1">
              <span>Total Repayable (Gross):</span>
              <span className="font-mono text-[#FFF2B2]">
                ₹{totalRepayable.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Tab: Savings Comparison OR Repayment Table */}
        <div className="mt-6 border-t border-white/10 pt-4 relative z-10">
          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 mb-3">
            <button
              onClick={() => setActiveTab('savings')}
              className={`flex-1 py-1.5 text-[10px] font-extrabold uppercase rounded-lg transition-colors ${
                activeTab === 'savings' ? 'bg-amber-500 text-[#0A1A36]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Savings Comparison
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-1.5 text-[10px] font-extrabold uppercase rounded-lg transition-colors ${
                activeTab === 'schedule' ? 'bg-amber-500 text-[#0A1A36]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Loan Schedule
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'savings' ? (
              <motion.div
                key="savings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 relative overflow-hidden"
              >
                <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-[10px] uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  Auspicious Savings Alert
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Compared to traditional lenders (charging 3.0%), Suvarna's pre-configured compliance system saves customers{' '}
                  <span className="text-yellow-400 font-extrabold font-mono text-xs">
                    ₹{traditionalSavings.toLocaleString('en-IN')}
                  </span>{' '}
                  in unnecessary premium charges over {tenure} months.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-950/60 border border-white/5 rounded-2xl p-3 max-h-[140px] overflow-y-auto"
              >
                <table className="w-full text-[10px] text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase font-black tracking-wider">
                      <th className="pb-1.5">M</th>
                      <th className="pb-1.5 text-right">Principal</th>
                      <th className="pb-1.5 text-right">Int. Accrued</th>
                      <th className="pb-1.5 text-right">Gross Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {scheduleRows.map((row) => (
                      <tr key={row.month} className="hover:bg-white/5 transition-colors">
                        <td className="py-1.5 text-slate-400 font-bold">M{row.month}</td>
                        <td className="py-1.5 text-right text-slate-300">₹{row.principal.toLocaleString('en-IN')}</td>
                        <td className="py-1.5 text-right text-amber-300">₹{row.interestAccrued.toLocaleString('en-IN')}</td>
                        <td className="py-1.5 text-right text-yellow-400 font-bold">₹{row.balance.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Trigger Row */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="bg-gradient-to-r from-[#DF9F28] to-[#D28F1B] hover:from-amber-400 hover:to-amber-500 text-[#0A1A36] py-2.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <FileText className="w-3.5 h-3.5" />
              Generate Quote
            </button>
            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                // Trigger dynamic trial action or contact modal from App.tsx using a custom event
                const event = new CustomEvent('openBookDemoModal');
                window.dispatchEvent(event);
              }}
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white py-2.5 px-4 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              Book ERP Demo
            </a>
          </div>
        </div>
      </div>

      {/* VALUATION & QUOTATION RECEIPT MODAL */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0A1A36]/60 backdrop-blur-xs" onClick={() => setIsQuoteModalOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative z-10 shadow-2xl border border-slate-200 text-left font-sans"
            >
              {/* Header inside Quote */}
              <div className="flex justify-between items-start border-b-2 border-dashed border-slate-200 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 32 30 L 28 14 L 38 23 L 50 8 L 62 23 L 72 14 L 68 30 Z" fill="#D28F1B" />
                      <path d="M 18 48 L 82 48 L 94 60 L 50 95 L 6 60 Z" stroke="#D28F1B" strokeWidth="3" fill="none" />
                      <path d="M 58 42 C 58 42, 53 38, 46 40 C 40 42, 38 46, 40 52 C 42 58, 48 60, 53 62 C 59 64, 63 67, 61 75 C 59 83, 50 86, 43 83" stroke="#D28F1B" strokeWidth="6" fill="none" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#0A1A36] leading-tight">Suvarna Gold Loan</h4>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Valuation Certificate</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider block mb-1">
                    APPROVED
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase block font-mono">
                    REF: SV-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>
              </div>

              {/* Watermark Logo background */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <div className="w-56 h-56 border-8 border-slate-800 rounded-full flex items-center justify-center font-black text-7xl uppercase">SV</div>
                </div>

                <p className="text-xs text-slate-500 mb-4 font-semibold italic">
                  This collateral report certifies an itemized valuation of physical ornaments pledged in standard security lockers under SaaS license rules.
                </p>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs font-semibold">
                  <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200 pb-1.5">
                    <span>Collateral Details</span>
                    <span>Metrics</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Gold Karat (Assayed Purity):</span>
                    <span className="font-bold text-slate-900 font-mono">{purity}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Certified Weight (Gross Grams):</span>
                    <span className="font-bold text-slate-900 font-mono">{weight}.00 g</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Current Spot Rate (per gram):</span>
                    <span className="font-bold text-slate-900 font-mono">₹{currentRatePerGram.toLocaleString('en-IN')}/g</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 border-b border-dashed border-slate-200 pb-2">
                    <span>Assessed Gold Market Value:</span>
                    <span className="font-bold text-slate-900 font-mono">₹{totalGoldValue.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-700 pt-1">
                    <span>Loan-To-Value Approved (LTV %):</span>
                    <span className="font-bold text-slate-900 font-mono">{ltv}%</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Sanctioned Principal Amount:</span>
                    <span className="font-black text-[#D28F1B] font-mono">₹{maxLoanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Contract Tenure (Limit):</span>
                    <span className="font-bold text-slate-900 font-mono">{tenure} Months</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Agreed Interest (Simple/mo):</span>
                    <span className="font-bold text-emerald-600 font-mono">{monthlyRate}% / Month</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Total Cumulative Interest Due:</span>
                    <span className="font-bold text-slate-900 font-mono">₹{totalInterestOverTenure.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-800 font-black border-t-2 border-dashed border-slate-200 pt-2.5 text-sm">
                    <span>Total Repayable (Gross):</span>
                    <span className="text-[#0A1A36] font-mono">₹{totalRepayable.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 text-center text-[10px] font-bold text-slate-400">
                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-slate-800 font-extrabold font-serif italic text-xs">Rajesh Verma</p>
                    <p className="uppercase tracking-wider mt-1 text-[8px]">Authorized Signatory</p>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300 rounded font-bold uppercase tracking-wider text-[8px] select-none">
                      SEAL
                    </div>
                    <p className="uppercase tracking-wider mt-1 text-[8px]">Official Stamp</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsQuoteModalOpen(false)} 
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      window.print();
                    }}
                    className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Receipt
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
