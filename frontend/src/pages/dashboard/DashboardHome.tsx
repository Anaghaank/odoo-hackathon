import React, { useEffect, useState } from 'react';
import { 
    Package, 
    ArrowUpRight, 
    ArrowDownRight, 
    Truck, 
    Layers, 
    AlertCircle, 
    Activity,
    CheckCircle2
} from 'lucide-react';
import { inventoryService } from '../../services/api';
import type { DashboardData, OperationData } from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color, bg, trend, trendValue }: { 
    title: string, value: string | number, icon: any, color: string, bg: string, trend?: 'up' | 'down', trendValue?: string 
}) => (
    <div className="glass-card p-6 rounded-[2rem] relative overflow-hidden group hover:brightness-125 transition-all duration-500">
        <div className="stat-glow-dark"></div>
        <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl ${bg}/20 ${color} shadow-lg shadow-current/10`}>
                <Icon className="w-6 h-6" strokeWidth={2.5} />
            </div>
            {trend && (
                <span className={`flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                    trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trendValue}
                </span>
            )}
        </div>
        <div className="relative z-10">
            <h3 className="text-slate-500 font-bold text-xs mb-1 uppercase tracking-[0.2em]">{title}</h3>
            <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
        </div>
        {/* Subtle background icon for depth */}
        <Icon className="absolute -bottom-4 -right-4 w-24 h-24 text-white opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700" />
    </div>
);

const DashboardHome: React.FC = () => {
    const [stats, setStats] = useState<DashboardData | null>(null);
    const [recentOps, setRecentOps] = useState<OperationData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [statData, opsData] = await Promise.all([
                    inventoryService.getDashboard(),
                    inventoryService.getOperations()
                ]);
                setStats(statData);
                setRecentOps(opsData.slice(0, 6));
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[600px]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
                        Commander <span className="text-blue-500">Center</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#020617] bg-slate-800"></div>
                            ))}
                        </div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                            Live Odoo Nexus Active
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-4 bg-white/5 border border-white/5 rounded-[1.5rem] font-black text-slate-300 hover:bg-white/10 transition-all text-sm uppercase tracking-widest">
                        Intelligence
                    </button>
                    <button onClick={() => window.location.reload()} className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 text-sm uppercase tracking-widest group">
                        Sync Network
                        <Activity className="inline-block ml-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatCard 
                    title="Total Stock" 
                    value={stats?.total_products || 0} 
                    icon={Package} 
                    color="text-blue-400"
                    bg="bg-blue-600"
                    trend="up"
                    trendValue="12%"
                />
                <StatCard 
                    title="Low Stock" 
                    value={stats?.low_stock_items || 0} 
                    icon={AlertCircle} 
                    color="text-red-400"
                    bg="bg-red-600"
                    trend="down"
                    trendValue="5%"
                />
                <StatCard 
                    title="Receipts" 
                    value={stats?.pending_receipts || 0} 
                    icon={ArrowDownRight} 
                    color="text-green-400"
                    bg="bg-green-600"
                />
                <StatCard 
                    title="Deliveries" 
                    value={stats?.pending_deliveries || 0} 
                    icon={ArrowUpRight} 
                    color="text-orange-400"
                    bg="bg-orange-600"
                />
                <StatCard 
                    title="Transfers" 
                    value={stats?.internal_transfers || 0} 
                    icon={Layers} 
                    color="text-indigo-400"
                    bg="bg-indigo-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Chart Placeholder */}
                <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] relative group border-white/10 hover:border-blue-500/50 transition-colors duration-500">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                <Layers className="w-7 h-7 text-blue-500" />
                                Logistics Matrix
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">Real-time throughput analysis</p>
                        </div>
                        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                            {['Flow', 'Volume', 'Heat'].map(tab => (
                                <button key={tab} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    tab === 'Flow' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'
                                }`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="aspect-[16/9] bg-black/40 rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 animate-pulse">
                                <Activity className="w-10 h-10 text-blue-500" />
                            </div>
                            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Processing Nexus Data Fields</p>
                        </div>
                    </div>
                </div>

                {/* Operations Feed */}
                <div className="glass-card rounded-[3rem] flex flex-col border-white/10 overflow-hidden">
                    <div className="p-10 border-b border-white/5">
                        <h3 className="text-2xl font-black text-white">Event Log</h3>
                        <p className="text-slate-500 text-sm mt-1">Synchronized Activity Pipeline</p>
                    </div>
                    <div className="flex-1 p-6 space-y-3 overflow-y-auto no-scrollbar">
                        {recentOps.map((op) => (
                            <div key={op.id} className="flex items-center gap-5 p-5 hover:bg-white/5 rounded-[1.5rem] transition-all border border-transparent hover:border-white/5 group relative overflow-hidden">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-12 ${
                                    op.state === 'done' 
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {op.state === 'done' ? <CheckCircle2 className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-white truncate">{op.reference}</p>
                                    <p className="text-[11px] text-slate-500 font-bold truncate group-hover:text-slate-400 transition-colors">{op.partner}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">{op.date}</div>
                                    <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                        op.state === 'done' ? 'text-green-400' : 'text-orange-400'
                                    }`}>
                                        {op.state}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 border-t border-white/5">
                        <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 rounded-2xl transition-all border border-blue-500/10">
                            Logistics Protocol
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
