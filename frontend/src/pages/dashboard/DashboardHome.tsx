import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  RefreshCcw, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Download,
  Plus,
  AlertTriangle,
  Package,
  Truck
} from 'lucide-react';
import { inventoryService } from '../../services/api';
import type { DashboardData, OperationData } from '../../services/api';

const StatCard = ({ label, value, percentage, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
    
    <div className="mb-2 text-slate-400 font-semibold text-sm tracking-wide uppercase">{label}</div>
    <div className="flex items-end justify-between">
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {percentage && (
        <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'} bg-opacity-10 px-2 py-1 rounded-lg`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {percentage}%
        </div>
      )}
    </div>
  </div>
);

const DashboardHome: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [operations, setOperations] = useState<OperationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, opData] = await Promise.all([
          inventoryService.getDashboard(),
          inventoryService.getOperations()
        ]);
        setDashboard(dashData);
        setOperations(opData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Products', value: dashboard?.total_products || '0', trend: 'up', icon: Package, color: 'bg-blue-600' },
    { label: 'Low Stock Items', value: dashboard?.low_stock_items || '0', trend: 'down', icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Pending Receipts', value: dashboard?.pending_receipts || '0', trend: 'up', icon: ArrowDownRight, color: 'bg-green-500' },
    { label: 'Pending Deliveries', value: dashboard?.pending_deliveries || '0', trend: 'up', icon: Truck, color: 'bg-indigo-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Inventory Overview</h1>
          <p className="text-slate-500 font-medium">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
            <Plus className="w-4 h-4" /> New Operation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Recent Operations</h3>
              <button className="text-sm font-bold text-blue-600 hover:underline px-4 py-2 bg-blue-50 bg-opacity-50 rounded-lg">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 font-bold text-xs uppercase tracking-widest px-8">
                    <th className="px-8 py-4">Reference</th>
                    <th className="px-8 py-4">Type</th>
                    <th className="px-8 py-4">Origin</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Schedule Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {operations.map((op, i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-900 tracking-tight">{op.name}</td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          op.picking_type === 'receipt' ? 'bg-green-100 text-green-700' : 
                          op.picking_type === 'delivery' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {op.picking_type}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-medium text-slate-600">{op.origin}</td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          op.state === 'done' ? 'bg-green-100 text-green-700' : 
                          op.state === 'ready' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {op.state}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-medium text-slate-900">{op.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Inventory Health</h3>
            <div className="flex-1 flex flex-col justify-center space-y-8">
              <div className="text-center">
                <div className="text-4xl font-black text-blue-600 mb-2">92%</div>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Efficiency Rate</p>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold items-center">
                        <span className="text-slate-900">Stock Availability</span>
                        <span className="text-slate-500">85%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '85%' }}></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold items-center">
                        <span className="text-slate-900">On-time Delivery</span>
                        <span className="text-slate-500">94%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '94%' }}></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
