import { useEffect, useState } from 'react';
import { inventoryService, type MoveHistoryData } from '../../services/api';
import { History, ArrowRight, Package, Clock } from 'lucide-react';

export default function MoveHistoryPage() {
  const [history, setHistory] = useState<MoveHistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await inventoryService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <History className="w-8 h-8 text-blue-600" />
            Stock Ledger / Move History
          </h1>
          <p className="text-slate-500 mt-1">Audit trail of all inventory movements</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Date/Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Reference</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Product</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">From</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">To</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Qty</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((move) => (
                <tr key={move.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{move.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">{move.reference}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-slate-700">{move.product}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{move.from || 'External'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <ArrowRight className="w-3 h-3 text-slate-400" />
                       <span className="text-sm text-slate-500">{move.to || 'External'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{move.qty}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                      {move.state.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium tracking-wide bg-slate-50/50">
                    No movement records found
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
