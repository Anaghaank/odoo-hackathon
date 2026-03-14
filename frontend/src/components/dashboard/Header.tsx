import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-slate-200"></div>

        <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            JC
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-bold text-slate-900 leading-none mb-1">Jane Cooper</div>
            <div className="text-xs font-semibold text-slate-400 leading-none uppercase tracking-wider">Admin</div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors ml-1" />
        </button>
      </div>
    </header>
  );
};

export default Header;
