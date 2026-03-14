import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthSidebar from '../components/AuthSidebar';
import { ShieldCheck, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const TwoFactorPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* Auto-focus first box on mount */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* Countdown timer for resend */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    const newCode = [...code];
    text.split('').forEach((ch, i) => { newCode[i] = ch; });
    setCode(newCode);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
    e.preventDefault();
  };

  const handleVerify = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleResend = () => {
    setResent(true);
    setCountdown(30);
    setTimeout(() => setResent(false), 3000);
  };

  const isComplete = code.every(d => d !== '');
  const filled = code.filter(d => d !== '').length;

  return (
    <div className="flex min-h-screen font-sans antialiased h-screen overflow-hidden" style={{ background: '#0f172a' }}>
      <AuthSidebar logoUrl="/HeroLogo.webp" />

      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-16 justify-center relative" style={{ background: '#0f172a' }}>
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400 opacity-5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-md mx-auto w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Shield icon with pulse ring */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-lime-400/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
                <ShieldCheck className="w-9 h-9 text-lime-400" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mb-2 tracking-tight text-center">
            Two-step verification
          </h2>
          <p className="text-slate-500 mb-10 text-sm text-center">
            We've sent a 6-digit code to your email. Enter it below to continue.
          </p>

          {/* OTP inputs */}
          <div className="flex justify-between gap-2 mb-4" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`w-full h-16 text-center text-2xl font-black rounded-2xl border transition-all duration-200 outline-none ${
                  digit
                    ? 'bg-lime-400/10 border-lime-400 text-lime-400 shadow-lg shadow-lime-400/20'
                    : 'bg-slate-800/60 border-slate-700 text-white focus:border-lime-400 focus:bg-slate-800 focus:shadow-lg focus:shadow-lime-400/10'
                }`}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-lime-400 rounded-full transition-all duration-300"
                style={{ width: `${(filled / 6) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1.5 text-right">
              {filled}/6 digits entered
            </p>
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={!isComplete || loading}
            className={`group w-full py-4 font-black rounded-xl shadow-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm ${
              isComplete && !loading
                ? 'bg-lime-400 text-slate-900 shadow-lime-400/25 hover:bg-lime-300 hover:shadow-lime-300/35'
                : 'bg-slate-800 text-slate-600 shadow-none cursor-not-allowed'
            }`}
          >
            {loading
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <>
                  Verify &amp; Continue
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
            }
          </button>

          {/* Resend */}
          <div className="mt-6 text-center">
            {resent && (
              <p className="text-lime-400 text-xs font-bold mb-2 animate-in fade-in duration-300">
                ✓ Code resent successfully!
              </p>
            )}
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className="text-sm font-bold text-slate-500 hover:text-lime-400 disabled:text-slate-700 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className={`w-4 h-4 ${countdown > 0 ? 'animate-spin' : ''}`} />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend verification code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorPage;
