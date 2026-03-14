import React, { useState, useEffect } from 'react';
import { X, Box, User, ArrowRight, Plus } from 'lucide-react';
import { inventoryService } from '../../services/api';
import type { ProductData } from '../../services/api';

interface CreateOperationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateOperationModal: React.FC<CreateOperationModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [type, setType] = useState<'incoming' | 'outgoing' | 'internal' | 'adjustment'>('incoming');
    const [partner, setPartner] = useState('');
    const [products, setProducts] = useState<ProductData[]>([]);
    const [lines, setLines] = useState<{product_id: number, qty: number}[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            inventoryService.getProducts().then(setProducts);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const addLine = () => {
        if (products.length > 0) {
            setLines([...lines, { product_id: products[0].id, qty: 1 }]);
        }
    };

    const removeLine = (index: number) => {
        setLines(lines.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (type === 'adjustment') {
                for (const line of lines) {
                    await inventoryService.applyAdjustment({ 
                        product_id: line.product_id, 
                        quantity: line.qty 
                    });
                }
            } else {
                await inventoryService.createOperation({
                    type,
                    partner,
                    lines,
                    origin: 'Manual Creation'
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating operation:", error);
            alert("Failed to create operation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl" onClick={onClose}></div>
            <div className="glass-card w-full max-w-2xl rounded-[3rem] p-10 relative animate-in slide-in-from-bottom-10 duration-500 border-white/10">
                <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="mb-10">
                    <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Initialize Operation</h2>
                    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                        {(['incoming', 'outgoing', 'internal', 'adjustment'] as const).map(t => (
                            <button 
                                key={t}
                                onClick={() => setType(t)}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    type === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {type !== 'adjustment' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                                {type === 'incoming' ? 'Vendor / Source' : type === 'outgoing' ? 'Customer / Destination' : 'Entity'}
                            </label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input 
                                    required
                                    value={partner}
                                    onChange={e => setPartner(e.target.value)}
                                    placeholder="Enter entity name..."
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Asset Manifest</label>
                            <button 
                                type="button" 
                                onClick={addLine}
                                className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 hover:text-blue-300"
                            >
                                <Plus className="w-3 h-3" /> Add Product
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                            {lines.map((line, index) => (
                                <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="flex-1 relative">
                                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <select 
                                            value={line.product_id}
                                            onChange={e => {
                                                const newLines = [...lines];
                                                newLines[index].product_id = parseInt(e.target.value);
                                                setLines(newLines);
                                            }}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        >
                                            {products.map(p => (
                                                <option key={p.id} value={p.id} className="bg-[#020617]">{p.name} ({p.sku})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-32">
                                        <input 
                                            type="number"
                                            value={line.qty}
                                            onChange={e => {
                                                const newLines = [...lines];
                                                newLines[index].qty = parseFloat(e.target.value);
                                                setLines(newLines);
                                            }}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-center focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            placeholder="Qty"
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeLine(index)}
                                        className="p-3 text-slate-600 hover:text-red-400 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {lines.length === 0 && (
                                <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-[2rem] text-slate-600 font-bold text-sm uppercase tracking-widest">
                                    No items manifest yet
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-4 border border-white/10 rounded-2xl text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || lines.length === 0}
                            className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? "Syncing..." : (
                                <>
                                    Validate {type} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOperationModal;
