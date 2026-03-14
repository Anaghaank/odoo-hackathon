import { useEffect, useState } from 'react';
import { inventoryService, type MoveHistoryData } from '../../services/api';
import { History, ArrowRight, Package, Clock, ShieldCheck } from 'lucide-react';

export default function MoveHistoryPage() {
  const [history, setHistory] = useState<MoveHistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2 flex items-center gap-4">
            Stock <span className="text-blue-500">Ledger</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Immutable Record of Material Flux</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Blockchain<br/>Secured</span>
            </div>
            <button onClick={fetchHistory} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                <Clock className="w-6 h-6" />
            </button>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] px-10 border-b border-white/5">
                <th className="px-10 py-6">Timestamp / Seq</th>
                <th className="px-10 py-6">Reference</th>
                <th className="px-10 py-6">Asset Designation</th>
                <th className="px-10 py-6 text-center">Trajectory</th>
                <th className="px-10 py-6 text-center">Volume</th>
                <th className="px-10 py-6 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((move) => (
                <tr key={move.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-10 py-6">
                    <div className="text-white font-black text-xs tabular-nums mb-1 tracking-wider">{move.date.split(' ')[1]}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{move.date.split(' ')[0]}</div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest border border-blue-500/20 px-3 py-1 rounded-lg bg-blue-500/5">
                        {move.reference}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Package className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-white tracking-tight">{move.product}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-center gap-4">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-right w-20 truncate">{move.from || 'ORIGIN'}</span>
                       <ArrowRight className="w-3.5 h-3.5 text-blue-500/50" />
                       <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest w-20 truncate">{move.to || 'EXT_PORT'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="text-xl font-black text-white tabular-nums tracking-tighter">{move.qty}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20">
                      Synchronized
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <History className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                    <div className="text-slate-500 font-black uppercase tracking-[0.2em] text-sm">Clear Protocol: No moves detected in ledger.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
