import React, { useState, useEffect } from 'react';
import { Warehouse, MapPin, Plus, Globe } from 'lucide-react';
import { inventoryService } from '../../services/api';

const WarehousePage: React.FC = () => {
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const data = await inventoryService.getWarehouses();
                setWarehouses(data);
            } catch (error) {
                console.error("Error fetching warehouses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWarehouses();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[500px]">
            <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">Network <span className="text-blue-500">Nodes</span></h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Global Asset Distribution Map</p>
                </div>
                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-slate-300 font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all flex items-center gap-3 group">
                    <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Register New Hub
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {warehouses.map((wh) => (
                    <div key={wh.id} className="glass-card p-10 rounded-[3rem] relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 border-white/10">
                        <div className="stat-glow-dark opacity-50"></div>
                        
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="p-5 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
                                <Warehouse className="w-8 h-8 text-white" />
                            </div>
                            <span className="px-4 py-1.5 border border-white/10 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest bg-white/5">
                                Sector: {wh.code}
                            </span>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter mb-2">{wh.name}</h3>
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    {wh.address || 'Geo-Location Undefined'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Storage Zones</div>
                                    <div className="text-2xl font-black text-white tracking-tight">12 Segments</div>
                                </div>
                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Capacity</div>
                                    <div className="text-2xl font-black text-white tracking-tight">84% Alpha</div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Link</span>
                                </div>
                                <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">Configure Matrix</button>
                            </div>
                        </div>

                        <Globe className="absolute -bottom-10 -right-10 w-48 h-48 text-white opacity-[0.02] group-hover:opacity-[0.05] group-hover:rotate-45 transition-all duration-1000" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WarehousePage;
