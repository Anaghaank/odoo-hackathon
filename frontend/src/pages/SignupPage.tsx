import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthSidebar from '../components/AuthSidebar';
import { signupOrganisation } from '../services/odooService';
import { User, Building2, Mail, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    organisation: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signupOrganisation(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = (field: string) =>
    `w-full pl-11 pr-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 outline-none border ${focused === field
      ? 'bg-slate-800 border-lime-400 text-white placeholder-slate-600 shadow-lg shadow-lime-400/10'
      : 'bg-slate-800/60 border-slate-700 text-slate-200 placeholder-slate-600 hover:border-slate-600'
    }`;

  const iconClass = (field: string) =>
    `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === field ? 'text-lime-400' : 'text-slate-600'
    }`;

  /* ── Success State ── */
  if (isSuccess) {
    return (
      <div className="flex min-h-screen font-sans antialiased h-screen overflow-hidden" style={{ background: '#0f172a' }}>
        <AuthSidebar logoUrl="/HeroLogo.webp" />
        <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-16 justify-center items-center" style={{ background: '#0f172a' }}>
          <div className="max-w-md mx-auto w-full text-center animate-in zoom-in-95 fade-in duration-500 space-y-6">
            <div className="w-20 h-20 rounded-full bg-lime-400/10 border border-lime-400/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-lime-400" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-3">Account Created!</h2>
              <p className="text-slate-400">
                Organisation <strong className="text-lime-400">{formData.organisation}</strong> is ready to go.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="group w-full py-4 bg-lime-400 text-slate-900 font-black rounded-xl shadow-lg shadow-lime-400/20 hover:bg-lime-300 transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-sm"
            >
              Go to Login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans antialiased h-screen overflow-hidden" style={{ background: '#0f172a' }}>
      <AuthSidebar logoUrl="/HeroLogo.webp" />

      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-16 justify-center overflow-y-auto relative" style={{ background: '#0f172a' }}>
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400 opacity-5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-md mx-auto w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Create account</h2>
          <p className="text-slate-500 mb-8 text-sm">
            Already have one?{' '}
            <Link to="/login" className="text-lime-400 font-bold hover:text-lime-300 transition-colors">
              Log in
            </Link>
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">Full Name</label>
              <div className="relative">
                <User className={iconClass('name')} />
                <input
                  required name="name" type="text"
                  value={formData.name} onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClass('name')}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            {/* Organisation */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">Organisation Name</label>
              <div className="relative">
                <Building2 className={iconClass('organisation')} />
                <input
                  required name="organisation" type="text"
                  value={formData.organisation} onChange={handleChange}
                  placeholder="Acme Corp"
                  className={inputClass('organisation')}
                  onFocus={() => setFocused('organisation')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            {/* Email + Phone row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">Email</label>
                <div className="relative">
                  <Mail className={iconClass('email')} />
                  <input
                    required name="email" type="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="john@acme.com"
                    className={inputClass('email')}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">Phone</label>
                <div className="relative">
                  <Phone className={iconClass('phone')} />
                  <input
                    name="phone" type="tel"
                    value={formData.phone} onChange={handleChange}
                    placeholder="+1 234 567 890"
                    className={inputClass('phone')}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group w-full py-4 bg-lime-400 text-slate-900 font-black rounded-xl shadow-lg shadow-lime-400/20 hover:bg-lime-300 hover:shadow-lime-300/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <>Get started free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" /></>
                }
              </button>
            </div>
          </form>

          <footer className="mt-6 text-center">
            <p className="text-xs text-slate-600 font-medium">
              By signing up, you agree to our{' '}
              <a href="#" className="text-slate-500 hover:text-slate-300 underline transition-colors">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-slate-500 hover:text-slate-300 underline transition-colors">Privacy Policy</a>.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
