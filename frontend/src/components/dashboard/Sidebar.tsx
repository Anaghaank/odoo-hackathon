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
        { icon: ShoppingCart, label: 'Orders', path: '/orders' },
        { icon: History, label: 'Move History', path: '/history' },
        { icon: Users, label: 'People', path: '/people' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: FileText, label: 'Invoice', path: '/invoice' },
    ];

    const bottomItems = [
        { icon: MessageSquare, label: 'Support', path: '/message' },
        { icon: Settings, label: 'Settings', path: '/setting' },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 glass-sidebar flex flex-col z-50 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-24' : 'w-72'}`}>
            {/* Branding */}
            <div className="p-8 pb-10 flex items-center justify-between">
                <div className={`flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible'}`}>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                        <Box className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-[900] text-slate-900 tracking-tighter font-display">CoreStock</span>
                </div>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 group relative"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5 text-blue-600" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-5 py-2 space-y-10 overflow-y-auto no-scrollbar">
                <div>
                    {!isCollapsed && (
                        <h3 className="px-4 text-[11px] font-[900] uppercase tracking-[0.2em] text-slate-400 mb-6 font-display">
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
                                            ? 'glass-nav-active shadow-xl shadow-blue-100' 
                                            : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-900'
                                    }`
                                }
                            >
                                <item.icon className="w-6 h-6 flex-shrink-0" />
                                {!isCollapsed && <span className="font-[600] tracking-tight">{item.label}</span>}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div>
                    {!isCollapsed && (
                        <h3 className="px-4 text-[11px] font-[900] uppercase tracking-[0.2em] text-slate-400 mb-6 font-display">
                            System
                        </h3>
                    )}
                    <div className="space-y-2">
                        {bottomItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                title={isCollapsed ? item.label : ''}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                                        isActive 
                                            ? 'glass-nav-active shadow-xl shadow-blue-100' 
                                            : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-900'
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
            <div className="p-5 mt-auto bg-slate-50/30 backdrop-blur-md">
                <button 
                    onClick={handleLogout}
                    title={isCollapsed ? "Logout" : ""}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group shadow-sm bg-white border border-slate-100"
                >
                    <LogOut className="w-6 h-6 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                    {!isCollapsed && <span className="font-[700] tracking-tight">End Session</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
