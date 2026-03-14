import React, { useEffect, useState } from 'react';
import { Package, Search, ArrowUpDown, AlertCircle } from 'lucide-react';
import { inventoryService } from '../../services/api';
import type { ProductData } from '../../services/api';

import CreateProductModal from '../../components/modals/CreateProductModal';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Products</h1>
                    <p className="text-slate-500 font-medium">Manage your inventory stock and SKUs</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 uppercase tracking-widest text-[11px] hover:bg-blue-500 transition-all flex items-center gap-2 group"
                    >
                        <Package className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        New Product
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find SKU or Name..." 
                            className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white/10 focus:border-blue-500/20 w-64 text-white transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <CreateProductModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchProducts} 
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Stock Index</div>
                    <div className="flex items-end gap-3">
                        <div className="text-4xl font-black text-white tracking-tighter">{products.length}</div>
                        <div className="text-xs font-bold text-blue-400 mb-1">SKU ACTIVE</div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[70%]" />
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inventory Health</div>
                    <div className="flex items-end gap-3">
                        <div className="text-4xl font-black text-white tracking-tighter">94%</div>
                        <div className="text-xs font-bold text-green-400 mb-1">STABLE</div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[94%]" />
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">Critical Alert</div>
                    <div className="flex items-end gap-3">
                        <div className="text-4xl font-black text-white tracking-tighter">{products.filter(p => p.is_low_stock).length}</div>
                        <div className="text-xs font-bold text-red-500 mb-1">DEPLETED</div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[15%]" />
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Market Value</div>
                    <div className="flex items-end gap-3">
                        <div className="text-4xl font-black text-white tracking-tighter">1.2M</div>
                        <div className="text-xs font-bold text-indigo-400 mb-1">USD</div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[45%]" />
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-[2rem] border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] px-6 border-b border-white/5">
                                <th className="px-6 py-5">Product Information</th>
                                <th className="px-6 py-5">Classification</th>
                                <th className="px-6 py-5 text-center">
                                    <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-white transition-colors">
                                        Inventory <ArrowUpDown className="w-3.5 h-3.5" />
                                    </div>
                                </th>
                                <th className="px-6 py-5 text-center">Protocol</th>
                                <th className="px-6 py-5 text-right">Operational Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-500/5">
                                                <Package className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="font-black text-white text-base tracking-tight">{product.name}</div>
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">ID: {product.sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-slate-400 text-[11px] font-black uppercase tracking-wider">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center font-black text-white text-xl tabular-nums">
                                        {product.stock_qty}
                                    </td>
                                    <td className="px-6 py-5 text-center text-slate-500 font-bold tabular-nums">
                                        {product.min_qty}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end">
                                            {product.is_low_stock ? (
                                                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    Depleted
                                                </div>
                                            ) : (
                                                <div className="text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]">
                                                    Optimized
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProducts.length === 0 && (
                    <div className="p-20 text-center space-y-4 bg-white/[0.01]">
                        <Package className="w-16 h-16 text-slate-800 mx-auto" />
                        <div className="text-slate-500 font-black uppercase tracking-widest text-sm">No assets found</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
