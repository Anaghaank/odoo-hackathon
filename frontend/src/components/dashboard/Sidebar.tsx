import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  History,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { inventoryService } from '../../services/api';
import { useState } from 'react';

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        inventoryService.logout();
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Box, label: 'Products', path: '/products' },
        { icon: ShoppingCart, label: 'Operations', path: '/orders' },
        { icon: History, label: 'Move History', path: '/history' },
        { icon: Users, label: 'People', path: '/people' },
    ];

    const systemItems = [
        { icon: Settings, label: 'Warehouse Settings', path: '/setting' },
        { icon: Users, label: 'My Profile', path: '/profile' },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 glass-sidebar flex flex-col z-50 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-24' : 'w-72'}`}>
            {/* Branding */}
            <div className="p-8 pb-10 flex items-center justify-between">
                <div className={`flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible'}`}>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-blue-500/20">
                        <Box className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-[900] text-white tracking-tighter font-display">CoreStock</span>
                </div>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 group relative"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5 text-blue-400" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-5 py-2 space-y-10 overflow-y-auto no-scrollbar">
                <div>
                    {!isCollapsed && (
                        <h3 className="px-4 text-[11px] font-[900] uppercase tracking-[0.2em] text-slate-500 mb-6 font-display opacity-50">
                            Core Navigation
                        </h3>
                    )}
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                title={isCollapsed ? item.label : ''}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                                        isActive 
                                            ? 'glass-nav-active' 
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : ''}`} />
                                {!isCollapsed && <span className="font-[600] tracking-tight">{item.label}</span>}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div>
                    {!isCollapsed && (
                        <h3 className="px-4 text-[11px] font-[900] uppercase tracking-[0.2em] text-slate-500 mb-6 font-display opacity-50">
                            System
                        </h3>
                    )}
                    <div className="space-y-2">
                        {systemItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                title={isCollapsed ? item.label : ''}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                                        isActive 
                                            ? 'glass-nav-active' 
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="w-6 h-6 flex-shrink-0" />
                                {!isCollapsed && <span className="font-[600] tracking-tight">{item.label}</span>}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Logout Section */}
            <div className="p-5 mt-auto border-t border-white/5 bg-black/20 backdrop-blur-md">
                <button 
                    onClick={handleLogout}
                    title={isCollapsed ? "Logout" : ""}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group bg-white/5 border border-white/5"
                >
                    <LogOut className="w-6 h-6 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    {!isCollapsed && <span className="font-[700] tracking-tight">End Session</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
