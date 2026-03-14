import React from 'react';
import { Box } from 'lucide-react';

/* Animated floating blob */
const Blob = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse ${className}`} />
);

const AuthSidebar: React.FC = () => {
  const stats = [
    { value: '99%', label: 'Accuracy' },
    { value: '340+', label: 'Warehouses' },
    { value: '1.2M', label: 'SKUs Tracked' },
  ];

  const avatars = ['AK', 'MJ', 'SC', 'RP'];
  const avatarColors = ['bg-lime-400', 'bg-emerald-500', 'bg-teal-500', 'bg-green-500'];

  return (
    <div className="hidden lg:flex flex-col w-1/2 p-12 relative overflow-hidden" style={{ background: '#0f172a' }}>
      {/* Animated background blobs */}
      <Blob className="w-96 h-96 bg-lime-400 -top-20 -left-20 animation-delay-0" />
      <Blob className="w-72 h-72 bg-emerald-500 bottom-10 right-10 animation-delay-2000" />
      <Blob className="w-48 h-48 bg-teal-400 top-1/2 left-1/3 animation-delay-1000" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Logo */}
      <div className="flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center shadow-lg shadow-lime-400/30">
          <Box className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-black text-white tracking-tight">InventEdge</span>
      </div>

      {/* Main copy */}
      <div className="z-10 mt-5 mb-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-lime-400/30 bg-lime-400/10">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-xs  font-bold tracking-widest text-lime-400 uppercase">Live Tracking</span>
        </div>

        <h1 className="text-6xl font-black leading-[1.05] text-white mb-6 tracking-tight">
          Smarter<br />
          inventory,<br />
          <span className="text-lime-400">zero<br />guesswork.</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
          Real-time stock levels, automated reorders, and multi-warehouse visibility — all in one place.
        </p>
      </div>

      {/* Stat cards */}
      <div className="flex gap-3 mt-auto z-10">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="flex-1 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <div className="text-3xl font-black text-lime-400">{value}</div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Social proof */}
      <div className="mt-6 flex items-center gap-4 z-10">
        <div className="flex -space-x-2">
          {avatars.map((initials, i) => (
            <div
              key={i}
              className={`w-9 h-9 rounded-full border-2 border-slate-900 ${avatarColors[i]} flex items-center justify-center text-xs text-slate-900 font-black`}
            >
              {initials}
            </div>
          ))}
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Trusted by <span className="text-white font-bold">8,400+</span> teams
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;
