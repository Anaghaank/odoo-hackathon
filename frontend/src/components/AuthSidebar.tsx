import React from 'react';

interface AuthSidebarProps {
  logoUrl: string;
}

const AuthSidebar: React.FC<AuthSidebarProps> = ({ logoUrl }) => {
  return (
    <div className="hidden lg:flex flex-col w-1/2 p-12 bg-[#F0F5FF] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-green-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-16 z-10">
        <div className="bg-blue-600 p-2 rounded-lg">
          <img src={logoUrl} alt="FlowStock Logo" className="w-8 h-8 invert brightness-0" />
        </div>
        <span className="text-2xl font-bold text-blue-900 font-display">FlowStock</span>
      </div>

      {/* Content */}
      <div className="z-10 mt-auto mb-auto">
        <div className="inline-block px-4 py-1 mb-8 text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-100 rounded-full">
          • LIVE TRACKING
        </div>
        
        <h1 className="text-6xl font-bold leading-tight text-blue-900 mb-6 font-display">
          Smarter <br /> 
          inventory, <br />
          <span className="text-blue-600">zero <br /> guesswork.</span>
        </h1>
        
        <p className="text-lg text-slate-500 max-w-md">
          Real-time stock levels, automated reorders, and multi-warehouse visibility — all in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-4 mt-auto z-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
          <div className="text-4xl font-bold text-slate-900">99<span className="text-blue-500 font-normal">%</span></div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">Accuracy</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
          <div className="text-4xl font-bold text-slate-900">340<span className="text-blue-500 font-normal">+</span></div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">Warehouses</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
          <div className="text-4xl font-bold text-slate-900">1.2<span className="text-blue-500 font-normal text-3xl">M</span></div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">SKUs Tracked</div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="mt-8 flex items-center gap-4 z-10">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-blue-${i * 100 + 400} flex items-center justify-center text-xs text-white font-bold`}>
              {['AK', 'MJ', 'SC', 'RP'][i-1]}
            </div>
          ))}
        </div>
        <div className="text-sm text-slate-400 font-medium">
          Trusted by <span className="text-slate-900 font-bold">8,400+</span> teams
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;
