import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthSidebar from '../components/AuthSidebar';
import { ShieldCheck, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const TwoFactorPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const isComplete = code.every(digit => digit !== '');

  return (
    <div className="flex min-h-screen font-sans antialiased text-slate-900 h-screen overflow-hidden">
      <AuthSidebar logoUrl="/HeroLogo.webp" />
      
      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-white">
        <div className="max-w-md mx-auto w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl">
              <ShieldCheck className="w-12 h-12" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-slate-900 mb-2 font-display">Two-step verification</h2>
          <p className="text-slate-500 mb-10">
            We've sent a 6-digit verification code to your email. Please enter it below.
          </p>

          <div className="flex justify-between gap-2 mb-10">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-16 text-center text-2xl font-bold bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
              />
            ))}
          </div>

          <button 
            onClick={handleVerify}
            disabled={!isComplete || loading}
            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              isComplete && !loading ? 'bg-blue-600 shadow-blue-200 hover:bg-blue-700' : 'bg-slate-300 shadow-none cursor-not-allowed'
            }`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & Continue <ArrowRight className="w-5 h-5" /></>}
          </button>

          <div className="mt-8">
            <button className="text-sm font-bold text-blue-600 hover:underline flex items-center justify-center gap-2 mx-auto">
              <RefreshCw className="w-4 h-4" /> Resend verification code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorPage;
