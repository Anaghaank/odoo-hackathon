import React from 'react';
import { 
    Search, 
    Bell, 
    ChevronDown, 
    Globe, 
    Command,
    Zap
} from 'lucide-react';

const Header: React.FC = () => {
  let user = { name: 'System Admin', login: 'admin' };
  try {
    const userStr = localStorage.getItem('core_user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
  }
  const initials = user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'SA';

  return (
    <header className="h-24 bg-transparent flex items-center justify-between px-10 sticky top-0 z-40 transition-all duration-300">
        {/* Search Bar - High End Dark */}
        <div className="flex-1 max-w-xl">
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input 
                    type="text" 
                    placeholder="Quick Search or CMD + K" 
                    className="w-full pl-12 pr-20 py-3.5 bg-white/5 border border-white/5 rounded-2xl focus:bg-white/10 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-white font-medium placeholder:text-slate-500"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-slate-900 rounded-lg border border-white/10 shadow-sm">
                    <Command className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500">K</span>
                </div>
            </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-6 ml-8">
            <div className="hidden lg:flex items-center gap-2">
                <button className="p-3 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-2xl transition-all relative group">
                    <Globe className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#020617]"></span>
                </button>
                <button className="p-3 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-2xl transition-all relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-3 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]"></span>
                </button>
            </div>

            <div className="h-8 w-[1px] bg-white/10"></div>

            {/* Profile Menu */}
            <button className="flex items-center gap-4 pl-2 pr-4 py-2 hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-white/5">
                <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-blue-500/20">
                        {initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#020617] rounded-full"></div>
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-black text-white leading-none mb-1">{user.name}</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{user.login === 'admin' ? 'Master Access' : 'Operator'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </button>
            
            <button className="lg:hidden p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20">
                <Zap className="w-6 h-6" />
            </button>
        </div>
    </header>
  );
};

export default Header;
