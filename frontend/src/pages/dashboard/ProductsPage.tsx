import React, { useEffect, useState } from 'react';
import { Package, Search, Filter, ArrowUpDown, AlertCircle } from 'lucide-react';
import { inventoryService } from '../../services/api';
import type { ProductData } from '../../services/api';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await inventoryService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
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
                    <h1 className="text-3xl font-bold text-slate-900">Products</h1>
                    <p className="text-slate-500">Manage your inventory stock and SKUs</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search SKU or Name..." 
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50">
                        <Filter className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 font-bold text-xs uppercase tracking-widest px-8">
                            <th className="px-8 py-4">Product</th>
                            <th className="px-8 py-4">Category</th>
                            <th className="px-8 py-4">
                                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
                                    Stock <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-8 py-4">Min Qty</th>
                            <th className="px-8 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <Package className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{product.name}</div>
                                            <div className="text-xs font-semibold text-slate-400">SKU: {product.sku}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 text-sm font-medium">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-8 py-5 font-bold text-slate-900">{product.stock_qty}</td>
                                <td className="px-8 py-5 text-slate-500">{product.min_qty}</td>
                                <td className="px-8 py-5">
                                    {product.is_low_stock ? (
                                        <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full w-fit text-xs font-bold uppercase tracking-wider">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            Low Stock
                                        </div>
                                    ) : (
                                        <div className="text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit text-xs font-bold uppercase tracking-wider">
                                            In Stock
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div className="p-12 text-center text-slate-400 font-medium">
                        No products found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
