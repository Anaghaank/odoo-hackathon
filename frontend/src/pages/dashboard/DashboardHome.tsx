import React, { useEffect, useState } from 'react';
import { 
    Package, 
    ArrowUpRight, 
    ArrowDownRight, 
    Truck, 
    Layers, 
    AlertCircle, 
    Clock, 
    Activity,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { inventoryService } from '../../services/api';
import type { DashboardData, OperationData } from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color, bg, trend, trendValue }: { 
    title: string, value: string | number, icon: any, color: string, bg: string, trend?: 'up' | 'down', trendValue?: string 
}) => (
    <div className="glass-card p-6 rounded-[2rem] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
        <div className="stat-glow"></div>
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${bg} bg-opacity-10 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                    trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trendValue}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wider">{title}</h3>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
        </div>
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
                setRecentOps(opsData.slice(0, 5));
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Inventory Overview</h1>
                    <p className="text-slate-500 font-medium text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Live synchronization with Odoo Backend
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white glass-card rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        Export Report
                    </button>
                    <button onClick={() => window.location.reload()} className="px-6 py-3 bg-black text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-blue-100">
                        Refresh Sync
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Stock" 
                    value={stats?.total_products || 0} 
                    icon={Package} 
                    color="text-blue-600"
                    bg="bg-blue-600"
                    trend="up"
                    trendValue="12%"
                />
                <StatCard 
                    title="Low Stock" 
                    value={stats?.low_stock_items || 0} 
                    icon={AlertCircle} 
                    color="text-red-600"
                    bg="bg-red-600"
                    trend="down"
                    trendValue="5%"
                />
                <StatCard 
                    title="Pending Orders" 
                    value={(stats?.pending_receipts || 0) + (stats?.pending_deliveries || 0)} 
                    icon={Clock} 
                    color="text-orange-600"
                    bg="bg-orange-600"
                />
                <StatCard 
                    title="Efficiency" 
                    value={`${stats?.efficiency_rate || 0}%`} 
                    icon={TrendingUp} 
                    color="text-green-600"
                    bg="bg-green-600"
                    trend="up"
                    trendValue="2.4%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Chart Placeholder */}
                <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <Layers className="w-6 h-6 text-blue-500" />
                            Distribution Flow
                        </h3>
                        <div className="flex gap-2">
                            {['Receipts', 'Internal', 'Delivery'].map(tab => (
                                <button key={tab} className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="aspect-[16/9] bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-indigo-50/40"></div>
                        <div className="text-center space-y-4 relative z-10">
                            <Activity className="w-12 h-12 text-slate-200 mx-auto animate-pulse" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Real-time Analytics Visualizer</p>
                        </div>
                    </div>
                </div>

                {/* Operations Feed */}
                <div className="glass-card rounded-[2.5rem] flex flex-col">
                    <div className="p-8 border-b border-slate-100/50">
                        <h3 className="text-xl font-black text-slate-900">Recent Movements</h3>
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                        {recentOps.map((op) => (
                            <div key={op.id} className="flex items-center gap-4 p-4 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm group">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    op.state === 'done' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                    {op.state === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{op.reference}</p>
                                    <p className="text-xs text-slate-400 font-medium truncate">{op.partner}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-300 mb-1">{op.date}</div>
                                    <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                        op.state === 'done' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                        {op.state}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 border-t border-slate-100/50">
                        <button className="w-full py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            View Logistics Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
