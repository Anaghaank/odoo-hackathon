import React from 'react';
import { Box, Sparkles, Shield, Zap } from 'lucide-react';

interface AuthSidebarProps {
  logoUrl: string;
}

const AuthSidebar: React.FC<AuthSidebarProps> = ({ logoUrl }) => {
  return (
    <div className="hidden lg:flex flex-col w-1/2 p-16 bg-[#020617] relative overflow-hidden border-r border-white/5">
      {/* Advanced Animated Mesh */}
      <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-full h-full bg-indigo-600/10 blur-[130px] rounded-full animate-pulse"></div>

      {/* Logo */}
      <div className="flex items-center gap-4 mb-24 z-10 animate-in fade-in slide-in-from-left-4 duration-1000">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-xl shadow-blue-500/20 group hover:rotate-12 transition-transform">
           <Box className="w-8 h-8 text-white" />
        </div>
        <span className="text-4xl font-[900] text-white tracking-tighter font-display uppercase">CoreStock</span>
      </div>

      {/* Content */}
      <div className="z-10 mt-auto mb-auto space-y-12">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500/5 border border-blue-500/20 rounded-full text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">
          <Sparkles className="w-4 h-4" />
          Neural Link Active
        </div>

        <h1 className="text-8xl font-black leading-[0.9] text-white tracking-tighter font-display">
          Precision <br />
          <span className="text-blue-500 italic">Inventory</span><br />
          Command.
        </h1>

        <p className="text-xl text-slate-500 max-w-lg font-bold leading-relaxed">
          High-fidelity tracking, automated logistics protocols, and multi-sector visibility — engineered for the next generation of supply chain intelligence.
        </p>

        <div className="flex gap-10">
            <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-500" />
                <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Secure Access</span>
            </div>
            <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-orange-500" />
                <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Instant Sync</span>
            </div>
        </div>
      </div>

      {/* Stats Cards - Premium Modern */}
      <div className="flex gap-6 mt-auto z-10 pt-12">
        <div className="glass-card p-8 rounded-[2rem] flex-1 border-blue-500/10 hover:border-blue-500/30 transition-all group">
          <div className="text-5xl font-black text-white group-hover:text-blue-400 transition-colors">99.9</div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-2">Accuracy Rate</div>
        </div>
        <div className="glass-card p-8 rounded-[2rem] flex-1 border-indigo-500/10 hover:border-indigo-500/30 transition-all group">
          <div className="text-5xl font-black text-white group-hover:text-indigo-400 transition-colors">1.2M</div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-2">Units Tracked</div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;
