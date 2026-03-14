import React, { useEffect, useState } from 'react';
import { Plus, Search, Package, CheckCircle2 } from 'lucide-react';
import { inventoryService } from '../../services/api';
import type { OperationData } from '../../services/api';
import CreateOperationModal from '../../components/modals/CreateOperationModal';

const OrdersPage: React.FC = () => {
    const [operations, setOperations] = useState<OperationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOperations = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (selectedType) params.type = selectedType;
            if (selectedStatus) params.status = selectedStatus;
            
            const data = await inventoryService.getOperations(params);
            setOperations(data);
        } catch (error) {
            console.error("Error fetching operations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = async (id: number) => {
        try {
            await inventoryService.validateOperation(id);
            fetchOperations();
        } catch (error) {
            console.error("Validation error:", error);
            alert("Validation failed");
        }
    };

    useEffect(() => {
        fetchOperations();
    }, [selectedType, selectedStatus]);

    const filteredOps = operations.filter(op => 
        op.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
        op.partner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && operations.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">Inventory <span className="text-blue-500">Logistics</span></h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Synchronized Movement Ledger</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-blue-600 text-white font-black rounded-[1.5rem] shadow-2xl shadow-blue-500/30 hover:bg-blue-500 transition-all flex items-center gap-3 group uppercase tracking-widest text-xs"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                        Initialize Transfer
                    </button>

                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                        <select 
                            className="bg-transparent px-4 py-2 text-slate-400 font-black uppercase text-[10px] tracking-widest outline-none border-r border-white/10"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="receipt">Receipts</option>
                            <option value="delivery">Deliveries</option>
                            <option value="internal">Transfers</option>
                            <option value="adjustment">Adjustments</option>
                        </select>

                        <select 
                            className="bg-transparent px-4 py-2 text-slate-400 font-black uppercase text-[10px] tracking-widest outline-none"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">Status</option>
                            <option value="draft">Draft</option>
                            <option value="ready">Ready</option>
                            <option value="done">Done</option>
                            <option value="cancel">Cancelled</option>
                        </select>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Reference..." 
                            className="pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white/10 focus:border-blue-500/20 w-48 text-white text-xs font-black transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <CreateOperationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchOperations} 
            />

            <div className="glass-card rounded-[3rem] border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] px-10 border-b border-white/5">
                                <th className="px-10 py-6">Reference</th>
                                <th className="px-10 py-6">Type</th>
                                <th className="px-10 py-6">Source/Dest</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6">Date</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOps.map((op) => (
                                <tr key={op.id} className="hover:bg-white/[0.02] transition-all group">
                                    <td className="px-10 py-6 font-black text-white tracking-tight">{op.reference}</td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            op.type.toLowerCase().includes('receipt') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                            op.type.toLowerCase().includes('delivery') ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                        }`}>
                                            {op.type}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-slate-400 font-bold text-sm tracking-tight">{op.partner || '-'}</td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            op.state === 'done' ? 'bg-green-500/10 text-green-400' : 
                                            op.state === 'assigned' || op.state === 'ready' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-500'
                                        }`}>
                                            {op.state}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-slate-500 text-xs font-black uppercase tracking-widest">{op.date}</td>
                                    <td className="px-10 py-6 text-right">
                                        {(op.state === 'assigned' || op.state === 'confirmed' || op.state === 'ready') && (
                                            <button 
                                                onClick={() => handleValidate(op.id)}
                                                className="px-6 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-500 transition-all shadow-lg shadow-green-500/20 flex items-center gap-2 ml-auto"
                                            >
                                                Validate <CheckCircle2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOps.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <Package className="w-16 h-16 text-slate-800 mx-auto" />
                        <div className="text-slate-500 font-black uppercase tracking-widest text-sm">No operations found in this sector</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
