import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  BarChart3,
  FileText,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Box, label: 'Products', path: '/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: Users, label: 'People', path: '/people' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: FileText, label: 'Invoice', path: '/invoice' },
  ];

  const otherItems = [
    { icon: MessageSquare, label: 'Message', path: '/message' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: Settings, label: 'Setting', path: '/setting' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 flex flex-col z-30"
      style={{ background: '#0f172a' }}>

      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-lime-400 flex items-center justify-center shadow-lg shrink-0">
            <Box className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black text-white tracking-tight">InventEdge</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-6">

        {/* Main Menu */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Menu
          </p>
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-lime-400 text-slate-900 shadow-lg shadow-lime-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`w-4.5 h-4.5 shrink-0 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-white'
                          }`}
                        style={{ width: '1.1rem', height: '1.1rem' }}
                      />
                      <span className={`text-sm font-semibold ${isActive ? 'text-slate-900' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <ChevronRight
                        className="w-3.5 h-3.5 text-slate-700 opacity-60"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Other Menu */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Other
          </p>
          <div className="space-y-0.5">
            {otherItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-lime-400 text-slate-900 shadow-lg shadow-lime-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`shrink-0 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-white'
                          }`}
                        style={{ width: '1.1rem', height: '1.1rem' }}
                      />
                      <span className={`text-sm font-semibold ${isActive ? 'text-slate-900' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-700 opacity-60" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-white/5">
        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center text-slate-900 font-black text-xs shrink-0 shadow-md">
            JC
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate leading-none mb-0.5">
              Jane Cooper
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none">
              Admin
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut
            className="group-hover:text-red-400 transition-colors shrink-0"
            style={{ width: '1.1rem', height: '1.1rem' }}
          />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
