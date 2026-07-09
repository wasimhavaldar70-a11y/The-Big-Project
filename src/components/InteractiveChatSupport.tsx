import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Scale, Info, Play, ShieldCheck, HelpCircle } from 'lucide-react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export default function InteractiveChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Namaste! I am your SuvarnaLoan AI Assistant. How can I help you transform your jewelry shop today?"
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    // Simulated responses based on keywords
    setTimeout(() => {
      let responseText = "Thank you for asking! SuvarnaLoan ERP is a cloud-based software tailored for jewellers to manage customer KYC, gold loans, automate monthly interest calculations, and secure vaults. Would you like to schedule a free live screen demo?";

      const lower = userMsg.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) {
        responseText = "Our pricing starts at ₹1,999/month for single branches, including unlimited customer records, automated interest schedules, and daily encrypted cloud backups. We also offer enterprise packages for chain-stores. Can I schedule a callback?";
      } else if (lower.includes('safety') || lower.includes('secure') || lower.includes('safe') || lower.includes('backup')) {
        responseText = "Data safety is our top priority. We employ banking-grade TLS/SSL encryption, ISO 27001 certified hosting infrastructure, and daily hourly automated backups. No local storage is lost if a device breaks! Would you like a technical security brochure?";
      } else if (lower.includes('interest') || lower.includes('calculate')) {
        responseText = "SuvarnaLoan automates simple, compound, slab-wise, and penalty interest rates. It handles grace periods, installment logs, and auto-disbursals. Try our live calculator on the homepage to see it in action!";
      } else if (lower.includes('interest rate') || lower.includes('rate')) {
        responseText = "You can customize interest rates directly inside the Live Settings tab in our laptop dashboard preview above. Go ahead and toggle rates to see calculations update!";
      }

      setMessages(prev => [...prev, { sender: 'assistant', text: responseText }]);
    }, 800);
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl border border-gold-500/20 flex items-center justify-center transition-all duration-300 relative group glow-gold cursor-pointer"
        >
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-500 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-500 rounded-full"></div>
          <MessageSquare className="w-6 h-6 text-gold-400 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* CHATBOX PANEL */}
      {isOpen && (
        <div className="bg-white rounded-2xl w-80 sm:w-96 h-[460px] shadow-2xl border border-gold-100 flex flex-col justify-between overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-slate-950 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-500/50">
                <Sparkles className="w-4 h-4 text-gold-400" />
              </div>
              <div className="text-left">
                <h5 className="font-bold text-xs text-white">SuvarnaLoan Advisor</h5>
                <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online Support
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* MESSAGES INNER SCROLL */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-left">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gold-500 text-white rounded-br-none font-medium'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-xs'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          {/* QUICK TOPIC SUGGESTIONS */}
          <div className="bg-white px-3 py-2 border-t border-slate-100 flex gap-1.5 overflow-x-auto select-none no-scrollbar shrink-0">
            <button 
              onClick={() => handleQuickQuestion("What is the software price?")}
              className="text-[10px] bg-slate-50 hover:bg-gold-50 text-slate-500 hover:text-gold-700 font-bold px-2 py-1.5 rounded-full border border-slate-100 transition-colors shrink-0 cursor-pointer"
            >
              💰 System Cost?
            </button>
            <button 
              onClick={() => handleQuickQuestion("Is jewelry data secure?")}
              className="text-[10px] bg-slate-50 hover:bg-gold-50 text-slate-500 hover:text-gold-700 font-bold px-2 py-1.5 rounded-full border border-slate-100 transition-colors shrink-0 cursor-pointer"
            >
              🛡️ Data Safety?
            </button>
            <button 
              onClick={() => handleQuickQuestion("How do you calculate interest?")}
              className="text-[10px] bg-slate-50 hover:bg-gold-50 text-slate-500 hover:text-gold-700 font-bold px-2 py-1.5 rounded-full border border-slate-100 transition-colors shrink-0 cursor-pointer"
            >
              📈 Interest Rates?
            </button>
          </div>

          {/* INPUT FORM */}
          <form onSubmit={handleSend} className="bg-white p-3 border-t border-slate-100 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask anything about the ERP..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
            <button 
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 text-gold-400" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
