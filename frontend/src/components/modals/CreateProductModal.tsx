import React, { useState } from 'react';
import { X, Package, Tag, Layers, Truck, CheckCircle2 } from 'lucide-react';
import { inventoryService } from '../../services/api';

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: 'Electronics',
        price: '',
        initial_stock: '0',
        uom: 'Units'
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await inventoryService.createProduct(formData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl" onClick={onClose}></div>
            <div className="glass-card w-full max-w-xl rounded-[3rem] p-10 relative animate-in zoom-in duration-300 border-white/10">
                <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter">Manifest New Item</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Add product to central database</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Asset Name</label>
                            <input 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-bold"
                                placeholder="Quantum Processor X1" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Serial SKU</label>
                            <input 
                                required
                                value={formData.sku}
                                onChange={e => setFormData({...formData, sku: e.target.value})}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-bold"
                                placeholder="SKU-QP-001" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Sector Category</label>
                            <select 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-bold appearance-none"
                            >
                                <option className="bg-[#020617]" value="Electronics">Electronics</option>
                                <option className="bg-[#020617]" value="Computer Parts">Computer Parts</option>
                                <option className="bg-[#020617]" value="Hardware">Hardware</option>
                                <option className="bg-[#020617]" value="Raw Materials">Raw Materials</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Unit of Measure</label>
                            <input 
                                required
                                value={formData.uom}
                                onChange={e => setFormData({...formData, uom: e.target.value})}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-bold"
                                placeholder="Units / kg / meters" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Valuation (USD)</label>
                            <input 
                                type="number"
                                required
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-bold"
                                placeholder="0.00" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Initial Stock Arrival</label>
                            <input 
                                type="number"
                                value={formData.initial_stock}
                                onChange={e => setFormData({...formData, initial_stock: e.target.value})}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-bold"
                                placeholder="0" 
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-4 border border-white/10 rounded-2xl text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                        >
                            Abort
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? "Processing..." : <>Confirm Entry <CheckCircle2 className="w-4 h-4" /></>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProductModal;
