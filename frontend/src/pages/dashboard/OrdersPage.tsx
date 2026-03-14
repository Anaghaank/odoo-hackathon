import React, { useEffect, useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { inventoryService } from '../../services/api';
import type { OperationData } from '../../services/api';

const OrdersPage: React.FC = () => {
    const [operations, setOperations] = useState<OperationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

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

    useEffect(() => {
        fetchOperations();
    }, [selectedType, selectedStatus]);

    const filteredOps = operations.filter(op => 
        op.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
        op.partner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && operations.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Inventory Operations</h1>
                    <p className="text-slate-500">Track receipts, deliveries, and adjustments</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <select 
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
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
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="ready">Ready</option>
                        <option value="done">Done</option>
                        <option value="cancel">Cancelled</option>
                    </select>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 font-bold text-xs uppercase tracking-widest px-8">
                            <th className="px-8 py-4">Reference</th>
                            <th className="px-8 py-4">Type</th>
                            <th className="px-8 py-4">Origin</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4">Schedule Date</th>
                            <th className="px-8 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredOps.map((op) => (
                            <tr key={op.id} className="hover:bg-slate-50 transition-all group">
                                <td className="px-8 py-5 font-bold text-slate-900">{op.reference}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                        op.type.toLowerCase().includes('receipt') ? 'bg-green-100 text-green-700' : 
                                        op.type.toLowerCase().includes('delivery') ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                        {op.type}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-slate-600 font-medium">{op.partner || '-'}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                                        op.state === 'done' ? 'bg-green-50 text-green-600' : 
                                        op.state === 'ready' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                        {op.state}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-slate-500 text-sm font-semibold">{op.date}</td>
                                <td className="px-8 py-5">
                                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOps.length === 0 && (
                    <div className="p-12 text-center text-slate-400 font-medium">
                        No operations found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
