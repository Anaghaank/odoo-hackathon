import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/api';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [resetStep, setResetStep] = useState<'login' | 'forgot' | 'otp' | 'newpass'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login.length < 3 || login.length > 20) {
      setError('Login ID must be between 3 and 20 characters.');
      return;
    }

    try {
      setLoading(true);
      await inventoryService.login(login, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      setResetStep('newpass');
      setError('');
    } else {
      setError('Invalid OTP. Use 123456 for demo.');
    }
  };

  const containerClass = "flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-[#020617] relative overflow-hidden";
  const glowClass = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none";

  if (resetStep === 'forgot') {
    return (
      <div className={containerClass}>
        <div className={glowClass}></div>
        <div className="max-w-md mx-auto w-full animate-in slide-in-from-right duration-500 relative z-10">
          <button onClick={() => setResetStep('login')} className="mb-8 text-blue-400 font-[900] flex items-center gap-2 hover:translate-x-[-4px] transition-all uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>
          <h2 className="text-5xl font-black text-white mb-3 tracking-tighter">Identity Breach?</h2>
          <p className="text-slate-500 mb-10 font-bold">Initiate recovery protocol for your station credentials.</p>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setResetStep('otp'); }}>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Commander ID</label>
              <input 
                type="text" 
                placeholder="Enter Station ID" 
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white/10 text-white font-bold transition-all"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 uppercase tracking-widest text-sm hover:bg-blue-500 transition-all">Request Flux Key</button>
          </form>
        </div>
      </div>
    );
  }

  if (resetStep === 'otp') {
    return (
      <div className={containerClass}>
        <div className={glowClass}></div>
        <div className="max-w-md mx-auto w-full animate-in zoom-in duration-500 relative z-10">
          <h2 className="text-5xl font-black text-white mb-3 tracking-tighter">Flux Code</h2>
          <p className="text-slate-500 mb-10 font-bold tracking-tight">Signal sent to encrypted device. <span className="text-blue-400">Time sync: 01:59</span></p>
          {error && <div className="mb-6 p-4 bg-red-400/10 text-red-400 border border-red-400/20 rounded-2xl text-[11px] font-black uppercase tracking-widest">{error}</div>}
          <form className="space-y-8" onSubmit={verifyOtp}>
            <input 
              type="text" 
              maxLength={6}
              placeholder="000 000" 
              className="w-full text-center py-6 text-4xl font-black tracking-[0.5em] bg-white/5 border border-white/10 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 outline-none text-white focus:bg-white/10 transition-all"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 uppercase tracking-widest text-sm hover:bg-blue-500 transition-all">Decrypt Access</button>
            <p className="text-center text-xs font-black text-slate-600 uppercase tracking-widest">Signal lost? <button className="text-blue-400">Resend Burst</button></p>
          </form>
        </div>
      </div>
    );
  }

  if (resetStep === 'newpass') {
    return (
      <div className={containerClass}>
        <div className={glowClass}></div>
        <div className="max-w-md mx-auto w-full animate-in slide-in-from-bottom duration-500 relative z-10">
          <h2 className="text-5xl font-black text-white mb-3 tracking-tighter">Recalibrate</h2>
          <p className="text-slate-500 mb-10 font-bold">Secure your sector with new neural patterns.</p>
          <form className="space-y-6" onSubmit={() => {setResetStep('login'); setError('Access Restored! Initiating Login.')}}>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">New Sequence</label>
              <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-white transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Confirm Sequence</label>
              <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-white transition-all" required />
            </div>
            <button type="submit" className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl shadow-green-500/20 uppercase tracking-widest text-sm hover:bg-green-500 transition-all">Lock Sector</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={glowClass}></div>
      <div className="max-w-md mx-auto w-full relative z-10">
        <h2 className="text-6xl font-black text-white mb-4 tracking-tighter leading-none animate-in fade-in slide-in-from-top-4 duration-1000">Commence <br/><span className="text-blue-500">Operation</span></h2>
        <p className="text-slate-500 mb-12 font-bold text-lg tracking-tight"> Access your <span className="text-white border-b-2 border-blue-600/50 pb-0.5">CoreStock</span> localized network.</p>

        {error && (
          <div className={`mb-8 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border animate-shake ${error.includes('successfully') || error.includes('Restored') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Station ID</label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </span>
              <input 
                type="text" 
                placeholder="Ex: Admin-Alpha" 
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white/10 focus:border-blue-500/30 transition-all text-white font-bold placeholder:text-slate-700"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Access Key</label>
              <button 
                type="button" 
                onClick={() => {setResetStep('forgot'); setError('')}}
                className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
              >
                Key Lost?
              </button>
            </div>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors">
                <Lock className="w-5 h-5" />
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white/10 focus:border-blue-500/30 transition-all text-white font-bold"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.5rem] shadow-2xl shadow-blue-500/30 hover:bg-blue-500 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm group"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>Initiate Link <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <footer className="mt-16 flex justify-center gap-10 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
          <a href="#" className="hover:text-blue-500 transition-colors">Safety</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Protocol</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Link</a>
        </footer>
      </div>
    </div>
  );
};

export default AuthForm;
