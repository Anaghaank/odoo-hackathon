import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthSidebar from '../components/AuthSidebar';
import { signupOrganisation } from '../services/odooService';
import { User, Building2, Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
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

  if (isSuccess) {
    return (
      <div className="flex min-h-screen font-sans antialiased text-slate-900 h-screen overflow-hidden">
        <AuthSidebar logoUrl="/HeroLogo.webp" />
        <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-white items-center text-center">
          <div className="max-w-md mx-auto w-full space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Building2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 font-display">Success!</h2>
              <p className="text-slate-500 text-lg">
                Your organisation <strong>{formData.organisation}</strong> has been created successfully.
              </p>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              Go to Login <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans antialiased text-slate-900 h-screen overflow-hidden">
      <AuthSidebar logoUrl="/HeroLogo.webp" />
      
      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-white overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-2 font-display">Create an account</h2>
            <p className="text-slate-500">
              Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  name="name"
                  type="text" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Organisation Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  name="organisation"
                  type="text" 
                  value={formData.organisation}
                  onChange={handleChange}
                  placeholder="Acme Corp" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@acme.com" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    name="phone"
                    type="tel" 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get started free <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-xs text-slate-400 font-medium">
              By signing up, you agree to our <a href="#" className="text-slate-600 underline">Terms</a> and <a href="#" className="text-slate-600 underline">Privacy Policy</a>.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
