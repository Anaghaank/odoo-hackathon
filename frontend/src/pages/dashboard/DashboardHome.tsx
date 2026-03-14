import React from 'react';
import { 
  Users, 
  ShoppingBag, 
  Clock, 
  RefreshCcw, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Download,
  Printer,
  Plus
} from 'lucide-react';

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
      <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'} bg-opacity-10 px-2 py-1 rounded-lg`}>
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {percentage}%
      </div>
    </div>
  </div>
);

const DashboardHome: React.FC = () => {
  const stats = [
    { label: 'Total Order', value: '4,584', percentage: '11.5', trend: 'up', icon: ShoppingBag, color: 'bg-blue-600' },
    { label: 'Cancel Order', value: '4,584', percentage: '3.5', trend: 'down', icon: Clock, color: 'bg-orange-500' },
    { label: 'Product', value: '4,584', percentage: '12.5', trend: 'up', icon: ShoppingBag, color: 'bg-indigo-500' },
    { label: 'Refunds', value: '4,584', percentage: '5.5', trend: 'down', icon: RefreshCcw, color: 'bg-green-500' },
  ];

  const recentOrders = [
    { id: '#INV-123412', product: 'College Bag', size: 'Small', customer: 'Lucila Alexander', price: '$12.55', status: 'Completed', color: 'text-green-600 bg-green-50' },
    { id: '#INV-123413', product: 'College Bag', size: 'Small', customer: 'Lucila Alexander', price: '$12.55', status: 'Pending', color: 'text-blue-600 bg-blue-50' },
    { id: '#INV-123414', product: 'College Bag', size: 'Small', customer: 'Lucila Alexander', price: '$12.55', status: 'Inprogress', color: 'text-orange-600 bg-orange-50' },
    { id: '#INV-123415', product: 'College Bag', size: 'Small', customer: 'Lucila Alexander', price: '$12.55', status: 'Cancel', color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Overview</h1>
          <p className="text-slate-500 font-medium">9 Jan 2024</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
            <Plus className="w-4 h-4" /> Create Order
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts and Map placeholder */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-[400px] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="z-10 text-center">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-xl font-bold text-slate-900 mb-2">Commercial Hub Analysis</div>
              <p className="text-slate-500 font-medium max-w-xs">Visualizing global operations and market trends.</p>
            </div>
            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-50 to-transparent"></div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Recent Orders</h3>
              <button className="text-sm font-bold text-blue-600 hover:underline px-4 py-2 bg-blue-50 bg-opacity-50 rounded-lg">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 font-bold text-xs uppercase tracking-widest px-8">
                    <th className="px-8 py-4">Order ID</th>
                    <th className="px-8 py-4">Product Name</th>
                    <th className="px-8 py-4">Customer Name</th>
                    <th className="px-8 py-4">Price</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-900 tracking-tight">{order.id}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{order.product}</div>
                            <div className="text-xs font-semibold text-slate-400 uppercase">{order.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-medium text-slate-600">{order.customer}</td>
                      <td className="px-8 py-5 font-bold text-slate-900">{order.price}</td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.color}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Weekly Earnings placeholder */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Weekly Earnings</h3>
              <div className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">This Week</div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 border-2 border-dashed border-slate-100 rounded-2xl relative overflow-hidden group">
              <div className="text-center z-10 transition-transform group-hover:scale-110">
                <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-bold text-2xl shadow-sm mb-4">$8,750K</div>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Revenue Growth</p>
              </div>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-300 via-transparent to-transparent"></div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Store</h3>
            <div className="space-y-6">
              {[
                { name: 'Amazon', value: 85, color: 'bg-orange-400' },
                { name: 'Facebook', value: 35, color: 'bg-blue-500' },
                { name: 'Instagram', value: 55, color: 'bg-pink-500' },
                { name: 'Pinterest', value: 15, color: 'bg-red-600' }
              ].map((store, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold items-center">
                    <span className="text-slate-900">{store.name}</span>
                    <span className="text-slate-500">{store.value}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full ${store.color} transition-all duration-1000 delay-${i*200}`} style={{ width: `${store.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
