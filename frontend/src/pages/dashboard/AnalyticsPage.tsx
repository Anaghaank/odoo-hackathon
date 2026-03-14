import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Package, PieChart, ArrowUpRight } from 'lucide-react';
import { inventoryService } from '../../services/api';

const AnalyticsPage: React.FC = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await inventoryService.getAnalytics();
                setAnalytics(data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">Stock Analytics</h1>
                <p className="text-slate-500 font-medium">Insights and growth metrics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                Growth Overview
                            </h3>
                            <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-bold flex items-center gap-1">
                                <ArrowUpRight className="w-4 h-4" />
                                +{analytics?.growth}%
                            </span>
                        </div>
                        <div className="h-64 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-medium italic">
                            Growth Chart Visualization Coming Soon
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-indigo-600" />
                                Category Performance
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">{analytics?.top_category}</span>
                                    <span className="text-slate-900 font-bold">Top Performing</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-indigo-600 h-full rounded-full w-4/5"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-orange-600" />
                                Stock Turnover
                            </h3>
                            <div className="text-4xl font-black text-slate-900 mb-2">{analytics?.stock_turnover}x</div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Turnover Ratio</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between">
                    <div>
                        <BarChart3 className="w-12 h-12 mb-6 opacity-80" />
                        <h2 className="text-2xl font-bold mb-2">Annual Forecast</h2>
                        <p className="opacity-80 font-medium mb-8">Detailed projections based on current consumption patterns.</p>
                    </div>
                    <button className="w-full py-4 bg-white/10 backdrop-blur-md rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/20">
                        View Detailed Forecast
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
