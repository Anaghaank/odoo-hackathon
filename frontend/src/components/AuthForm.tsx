import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/2fa');
  };

  const inputClass = (field: string) =>
    `w-full pl-12 pr-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 outline-none border ${
      focused === field
        ? 'bg-slate-800 border-lime-400 text-white placeholder-slate-600 shadow-lg shadow-lime-400/10'
        : 'bg-slate-800/60 border-slate-700 text-slate-200 placeholder-slate-600 hover:border-slate-600'
    }`;

  return (
    <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-16 justify-center overflow-y-auto" style={{ background: '#0f172a' }}>
      {/* Subtle top-right glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400 opacity-5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-md mx-auto w-full relative z-10">
        {/* Animated entry */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
            Welcome back
          </h2>
          <p className="text-slate-500 mb-10 text-sm">
            No account?{' '}
            <Link to="/signup" className="text-lime-400 font-bold hover:text-lime-300 transition-colors">
              Create one free
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === 'email' ? 'text-lime-400' : 'text-slate-600'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inputClass('email')}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-slate-500 hover:text-lime-400 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === 'password' ? 'text-lime-400' : 'text-slate-600'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass('password')} pr-12`}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-lime-400 rounded"
              />
              <label htmlFor="remember" className="text-sm font-medium text-slate-500 cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Security badge */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-lime-400/20 bg-lime-400/5">
              <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-lime-600">
                256-bit SSL · SOC 2 Certified
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group w-full py-4 bg-lime-400 text-slate-900 font-black rounded-xl shadow-lg shadow-lime-400/20 hover:bg-lime-300 hover:shadow-lime-300/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            >
              Sign in to dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </form>

          <footer className="mt-10 flex justify-center gap-6 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Help</a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
