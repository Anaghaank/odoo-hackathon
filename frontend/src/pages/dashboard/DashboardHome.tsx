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
    <div className="glass-card p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:border-white/20 border border-white/5">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${bg}/10 ${color}`}>
                <Icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
            {trend && (
                <span className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight ${
                    trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trendValue}
                </span>
            )}
        </div>
        <div>
            <p className="text-slate-500 font-bold text-[10px] mb-1 uppercase tracking-[0.2em]">{title}</p>
            <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
        </div>
        <Icon className="absolute -bottom-2 -right-2 w-16 h-16 text-white opacity-[0.03]" />
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
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
                        Commander <span className="text-blue-500">Center</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Live Odoo Nexus Active</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl font-black text-slate-300 hover:bg-white/10 transition-all text-xs uppercase tracking-widest">
                        Intelligence
                    </button>
                    <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 text-xs uppercase tracking-widest flex items-center gap-2">
                        Sync Network
                        <Activity className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Stats Grid — 5 columns on large screens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard title="Total Stock" value={stats?.total_products || 0} icon={Package} color="text-blue-400" bg="bg-blue-600" trend="up" trendValue="12%" />
                <StatCard title="Low Stock" value={stats?.low_stock_items || 0} icon={AlertCircle} color="text-red-400" bg="bg-red-600" trend="down" trendValue="5%" />
                <StatCard title="Receipts" value={stats?.pending_receipts || 0} icon={ArrowDownRight} color="text-green-400" bg="bg-green-600" />
                <StatCard title="Deliveries" value={stats?.pending_deliveries || 0} icon={ArrowUpRight} color="text-orange-400" bg="bg-orange-600" />
                <StatCard title="Transfers" value={stats?.internal_transfers || 0} icon={Layers} color="text-indigo-400" bg="bg-indigo-600" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Logistics Matrix Chart */}
                <div className="lg:col-span-2 glass-card p-7 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Layers className="w-5 h-5 text-blue-500" />
                                Logistics Matrix
                            </h3>
                            <p className="text-slate-500 text-xs mt-0.5">Real-time throughput analysis</p>
                        </div>
                        <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                            {['Flow', 'Volume', 'Heat'].map(tab => (
                                <button key={tab} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    tab === 'Flow' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'
                                }`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-black/30 rounded-2xl border border-white/5 flex items-center justify-center" style={{ height: '280px' }}>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 animate-pulse">
                                <Activity className="w-8 h-8 text-blue-500" />
                            </div>
                            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Processing Nexus Data Fields</p>
                        </div>
                    </div>
                </div>

                {/* Event Log */}
                <div className="glass-card rounded-2xl flex flex-col border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex-shrink-0">
                        <h3 className="text-lg font-black text-white">Event Log</h3>
                        <p className="text-slate-500 text-xs mt-0.5">Synchronized Activity Pipeline</p>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
                        {recentOps.length === 0 && (
                            <div className="py-12 text-center text-slate-600 font-bold text-xs uppercase tracking-widest">
                                No recent operations
                            </div>
                        )}
                        {recentOps.map((op) => (
                            <div key={op.id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all group">
                                <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${
                                    op.state === 'done' 
                                        ? 'bg-green-500/10 text-green-400' 
                                        : 'bg-blue-500/10 text-blue-400'
                                }`}>
                                    {op.state === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-white truncate">{op.reference}</p>
                                    <p className="text-[11px] text-slate-500 font-bold truncate">{op.partner}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                        op.state === 'done' ? 'text-green-400 bg-green-400/10' : 'text-orange-400 bg-orange-400/10'
                                    }`}>{op.state}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-white/5 flex-shrink-0">
                        <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-blue-500/10">
                            Logistics Protocol
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
