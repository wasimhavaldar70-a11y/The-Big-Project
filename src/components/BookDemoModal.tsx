import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Building, User, Mail, Phone, CheckCircle, Sparkles } from 'lucide-react';
import { DemoBooking } from '../types';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00');
  const [isSuccess, setIsSuccess] = useState(false);
  const [pastBookings, setPastBookings] = useState<DemoBooking[]>([]);

  // Load existing bookings from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('suvarnaloan_bookings');
      if (stored) {
        try {
          setPastBookings(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shopName || !phone || !email || !date || !time) return;

    const newBooking: DemoBooking = {
      name,
      shopName,
      phone,
      email,
      date,
      time
    };

    const updated = [newBooking, ...pastBookings];
    localStorage.setItem('suvarnaloan_bookings', JSON.stringify(updated));
    setPastBookings(updated);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setName('');
    setShopName('');
    setPhone('');
    setEmail('');
    setDate('');
    setTime('11:00');
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gold-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-none">
        
        {/* Left Informational Side */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 md:p-8 md:w-5/12 flex flex-col justify-between select-none shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-gold-500/10 border border-gold-500/30 text-gold-400 font-bold text-[10px] tracking-wider uppercase px-2 py-1 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Live Demo
            </div>
            <h4 className="text-xl font-bold text-gold-100 leading-tight mb-3">
              See SuvarnaLoan in Action
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Our gold-finance specialists will show you how to automate interest rates, streamline customer KYC, and secure branch cash flows.
            </p>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-gold-400 font-bold font-mono">1</div>
              <span>15-Minute Screen Walkthrough</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-gold-400 font-bold font-mono">2</div>
              <span>Custom Pricing Fit Proposal</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-gold-400 font-bold font-mono">3</div>
              <span>Free 7-Day Branch Pilot Trial</span>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="flex-1 p-6 md:p-8 relative flex flex-col justify-between overflow-y-auto">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="mb-2">
                <h4 className="text-lg font-bold text-slate-800">Secure Your Session Slot</h4>
                <p className="text-xs text-slate-400">Fill in details to instantly log a demo schedule.</p>
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jewellery Shop / Brand Name</label>
                <div className="relative">
                  <Building className="absolute left-2.5 top-2.5 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Suvarna Gold Palace"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Grid for Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Anand Sen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 text-slate-400 w-4 h-4" />
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 text-slate-400 w-4 h-4" />
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. owner@suvarnagold.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Grid for Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 text-slate-400 w-4 h-4" />
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time Slot</label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 text-slate-400 w-4 h-4" />
                    <select 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 appearance-none"
                    >
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-gold-500/10 transition-colors mt-2"
              >
                Secure Free Demo Slot
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">Demo Confirmed!</h4>
                <p className="text-xs text-slate-400 leading-normal px-4">
                  Awesome! We have logged your slot for <strong>{date}</strong> at <strong>{time}</strong>. A gold finance specialist will email you a secure Meet calendar invite.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 max-h-44 overflow-y-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Logged Appointments</span>
                <div className="space-y-2">
                  {pastBookings.map((b, i) => (
                    <div key={i} className="text-[11px] bg-white p-2 rounded-lg border border-slate-100 flex justify-between items-center">
                      <div>
                        <strong className="text-slate-800 block">{b.shopName}</strong>
                        <span className="text-slate-500">{b.name}</span>
                      </div>
                      <span className="font-mono bg-gold-50 text-gold-700 px-1.5 py-0.5 rounded font-bold text-[10px]">
                        {b.date} • {b.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleReset}
                className="text-xs text-gold-600 hover:underline font-bold"
              >
                Book another appointment
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
