import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/api';

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

    if (password.length < 1) {
      setError('Please enter a password.');
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

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setResetStep('otp');
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

  if (resetStep === 'forgot') {
    return (
      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-white">
        <div className="max-w-md mx-auto w-full animate-in slide-in-from-right duration-300">
          <button onClick={() => setResetStep('login')} className="mb-8 text-blue-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to login
          </button>
          <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Forgot Password?</h2>
          <p className="text-slate-500 mb-10">Enter your Login ID to receive a 6-digit verification code.</p>
          <form className="space-y-6" onSubmit={handleResetRequest}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Login ID / Email</label>
              <input 
                type="text" 
                placeholder="Enter your ID" 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Send Verification Code</button>
          </form>
        </div>
      </div>
    );
  }

  if (resetStep === 'otp') {
    return (
      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-white">
        <div className="max-w-md mx-auto w-full animate-in zoom-in duration-300">
          <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Verify OTP</h2>
          <p className="text-slate-500 mb-10">A code has been sent to your registered ID. <span className="text-slate-900 font-bold">Expires in 01:59</span></p>
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>}
          <form className="space-y-8" onSubmit={verifyOtp}>
            <div className="flex justify-between gap-2">
              <input 
                type="text" 
                maxLength={6}
                placeholder="0 0 0 0 0 0" 
                className="w-full text-center py-5 text-3xl font-black tracking-[1em] bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Verify & Proceed</button>
            <p className="text-center text-sm font-bold text-slate-400">Didn't receive code? <button className="text-blue-600">Resend</button></p>
          </form>
        </div>
      </div>
    );
  }

  if (resetStep === 'newpass') {
    return (
      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-white">
        <div className="max-w-md mx-auto w-full animate-in slide-in-from-bottom duration-300">
          <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Secure Account</h2>
          <p className="text-slate-500 mb-10">Create a new password to access your dashboard.</p>
          <form className="space-y-6" onSubmit={() => {setResetStep('login'); setError('Password reset successfully! Please login.')}}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Confirm Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <button type="submit" className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg">Update Password</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-white">
      <div className="max-w-md mx-auto w-full">
        <h2 className="text-4xl font-bold text-slate-900 mb-2 font-display tracking-tight">Welcome back</h2>
        <p className="text-slate-500 mb-10">
          Access your <span className="text-blue-600 font-bold">CoreStock</span> inventory manager.
        </p>

        {error && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold animate-shake ${error.includes('successfully') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Login ID / Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="3-20 Characters" 
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
              <button 
                type="button" 
                onClick={() => {setResetStep('forgot'); setError('')}}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.882 9.882L5.146 5.147m13.71 13.71L14.857 14.857m3.583-3.601A9.96 9.96 0 0119 12c.007.41-.018.82-.075 1.223m-4.723-4.723L11.25 11.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l1.5 1.5M1.05 1.05l21.9 21.9" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Sign in to dashboard'}
          </button>
        </form>

        <footer className="mt-12 flex justify-center gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-slate-600">Privacy</a>
          <a href="#" className="hover:text-slate-600">Terms</a>
          <a href="#" className="hover:text-slate-600">Help</a>
        </footer>
      </div>
    </div>
  );
};

export default AuthForm;
