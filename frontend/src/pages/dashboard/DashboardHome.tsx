import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  AlertTriangle,
  Package,
  Truck,
  ShoppingCart,
  XCircle,
  Store,
  Clock,
  CalendarDays,
  Zap,
  BarChart2,
  Printer,
} from 'lucide-react';
import { inventoryService } from '../../services/api';
import type { DashboardData, OperationData } from '../../services/api';

/* ---------- helpers ---------- */
const StatusPill = ({ label, color }: { label: string; color: string }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${color}`}
  >
    {label}
  </span>
);

const TypePill = ({ type }: { type: string }) => {
  const map: Record<string, string> = {
    receipt: 'bg-emerald-100 text-emerald-700',
    delivery: 'bg-violet-100 text-violet-700',
    internal: 'bg-sky-100 text-sky-700',
  };
  return (
    <StatusPill label={type} color={map[type] ?? 'bg-slate-100 text-slate-600'} />
  );
};

const StatePill = ({ state }: { state: string }) => {
  const map: Record<string, string> = {
    done: 'bg-green-100 text-green-700',
    ready: 'bg-blue-100 text-blue-700',
    waiting: 'bg-orange-100 text-orange-700',
    assigned: 'bg-teal-100 text-teal-700',
  };
  return (
    <StatusPill label={state} color={map[state] ?? 'bg-slate-100 text-slate-600'} />
  );
};

/* ---------- Big metric number (like "34 Deals") ---------- */
const BigMetric = ({
  value,
  label,
  icon: Icon,
  trend,
  iconColor,
}: {
  value: string | number;
  label: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  iconColor: string;
}) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-5xl font-black text-slate-900 leading-none">{value}</span>
      {trend && (
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold ${trend === 'up' ? 'bg-lime-400' : 'bg-red-400'
            }`}
        >
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
        </span>
      )}
    </div>
    <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-sm">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      {label}
    </div>
  </div>
);

/* ---------- Mock Card (Total Orders, etc.) ---------- */
const MockCard = ({
  icon: Icon,
  title,
  subtitle,
  count,
  tags,
  dark = false,
  accentGradient,
  accentColor,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  count: string | number;
  tags: string[];
  dark?: boolean;
  accentGradient: string;
  accentColor: string;
  accentColor2?: string;
  countLabel?: string;
}) => (
  <div
    className={`relative rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${
      dark
        ? 'bg-slate-900 shadow-lg shadow-slate-900/30'
        : 'bg-white border border-slate-100 shadow-sm'
    }`}
  >
    {/* Top-right glow blob */}
    <div
      className={`absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20 blur-2xl pointer-events-none ${accentGradient}`}
    />

    {/* Icon badge */}
    <div
      className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 ${accentGradient} shadow-lg`}
    >
      <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
    </div>

    {/* Count */}
    <div
      className={`text-4xl font-black leading-none mb-1 ${
        dark ? 'text-lime-400' : 'text-slate-900'
      }`}
    >
      {count}
    </div>

    {/* Title + subtitle */}
    <div className={`text-sm font-black mt-2 mb-0.5 ${dark ? 'text-white' : 'text-slate-800'}`}>
      {title}
    </div>
    <div className={`text-xs font-medium mb-5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
      {subtitle}
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            dark
              ? 'bg-white/10 text-slate-300'
              : `${accentColor} bg-opacity-10`
          }`}
        >
          {tag}
        </span>
      ))}
    </div>

    {/* Bottom accent line */}
    <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${accentGradient} opacity-60`} />
  </div>
);

/* ---------- Operation Row Card ---------- */
const OpCard = ({ op }: { op: OperationData }) => (
  <div className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-2xl transition-colors group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
        {op.picking_type === 'delivery' ? (
          <Truck className="w-5 h-5 text-violet-500" />
        ) : op.picking_type === 'receipt' ? (
          <ArrowDownRight className="w-5 h-5 text-emerald-500" />
        ) : (
          <Package className="w-5 h-5 text-sky-500" />
        )}
      </div>
      <div>
        <div className="font-bold text-slate-900 text-sm leading-tight">{op.name}</div>
        <div className="text-slate-400 text-xs font-medium mt-0.5">{op.origin || '—'}</div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <TypePill type={op.picking_type} />
      <StatePill state={op.state} />
      <div className="hidden sm:block text-slate-400 text-xs font-medium min-w-[80px] text-right">{op.date}</div>
    </div>
  </div>
);

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const DashboardHome: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [operations, setOperations] = useState<OperationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'receipt' | 'delivery' | 'internal'>(
    'all'
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, opData] = await Promise.all([
          inventoryService.getDashboard(),
          inventoryService.getOperations(),
        ]);
        setDashboard(dashData);
        setOperations(opData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });

  const filteredOps =
    activeFilter === 'all'
      ? operations
      : operations.filter((op) => op.picking_type === activeFilter);

  const handleExportPDF = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900" />
          <p className="text-slate-400 font-semibold text-sm animate-pulse">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">

      {/* ── TOP SCHEDULE HEADER BAR ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Black pill: date */}
        <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-full shadow-lg">
          <CalendarDays className="w-4 h-4 text-slate-300" />
          <span className="font-bold text-sm tracking-wide">Your Schedule</span>
          <div className="h-4 w-px bg-slate-600" />
          <span className="font-bold text-sm">{today}</span>
        </div>

        {/* Green pill: status */}
        <div className="flex items-center gap-2.5 bg-lime-400 text-slate-900 px-5 py-3 rounded-full shadow-lg">
          <Zap className="w-4 h-4" />
          <span className="font-black text-sm">Operations Active</span>
          <span className="bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {operations.length}
          </span>
        </div>

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-full text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-full text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* ── TITLE ROW ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1
            className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none uppercase"
            style={{ letterSpacing: '-0.04em' }}
          >
            INVENT<span className="text-lime-400">O</span>RY
          </h1>
          <p className="text-slate-400 font-semibold text-sm mt-2">
            Real-time warehouse overview
          </p>
        </div>

        {/* Big metric numbers */}
        <div className="flex items-end gap-10 pb-1">
          <BigMetric
            value={dashboard?.total_products ?? 0}
            label="Products"
            icon={Package}
            trend="up"
            iconColor="text-blue-500"
          />
          <BigMetric
            value={dashboard?.low_stock_items ?? 0}
            label="Low Stock"
            icon={AlertTriangle}
            trend="down"
            iconColor="text-red-400"
          />
        </div>
      </div>

      {/* ── FILTER BAR ───────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search icon button */}
        <button className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm active:scale-95">
          <Search className="w-5 h-5" />
        </button>
        {/* Filter icon button */}
        <button className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm active:scale-95">
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        <div className="h-7 w-px bg-slate-200" />

        {/* Filter pills */}
        {(['all', 'receipt', 'delivery', 'internal'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold capitalize transition-all border ${activeFilter === f
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
          >
            {f === 'all' ? '🔥 All' : f}
          </button>
        ))}

        <div className="flex-1" />

        {/* New Operation */}
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 rounded-full text-white font-bold text-sm hover:bg-slate-700 transition-all shadow-lg active:scale-95">
          <Plus className="w-4 h-4" />
          New Operation
        </button>
      </div>

      {/* ── MOCK METRIC CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MockCard
          icon={ShoppingCart}
          title="Total Orders"
          subtitle="All time purchase orders"
          count={142}
          tags={['Purchase', 'Sales']}
          accentGradient="bg-gradient-to-br from-blue-500 to-indigo-600"
          accentColor="text-blue-600"
        />
        <MockCard
          icon={XCircle}
          title="Cancelled Orders"
          subtitle="Orders voided this month"
          count={8}
          tags={['Voided', 'Refunded']}
          dark
          accentGradient="bg-gradient-to-br from-red-500 to-rose-600"
          accentColor="text-red-500"
        />
        <MockCard
          icon={Store}
          title="Order Stores"
          subtitle="Active supplier stores"
          count={24}
          tags={['Vendor', 'Retail']}
          accentGradient="bg-gradient-to-br from-violet-500 to-purple-600"
          accentColor="text-violet-600"
        />
        <MockCard
          icon={Clock}
          title="Recent Stores"
          subtitle="Last activity today"
          count={6}
          tags={['Today', 'Warehouse']}
          dark
          accentGradient="bg-gradient-to-br from-amber-400 to-orange-500"
          accentColor="text-amber-500"
        />
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Operations - 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">Recent Operations</h3>
              <p className="text-slate-400 text-sm font-medium mt-0.5">
                {filteredOps.length} operation{filteredOps.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button className="text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-all">
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-50 px-3 py-2">
            {filteredOps.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-semibold">
                No operations found
              </div>
            ) : (
              filteredOps.map((op, i) => <OpCard key={i} op={op} />)
            )}
          </div>
        </div>

        {/* Right column - 1/3 */}
        <div className="space-y-6">

          {/* Pending quick stats */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            <h3 className="text-lg font-black text-slate-900">Pending</h3>

            {/* Pending Receipts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <ArrowDownRight className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">Receipts</div>
                  <div className="text-slate-400 text-xs">Incoming stock</div>
                </div>
              </div>
              <span className="text-2xl font-black text-slate-900">
                {dashboard?.pending_receipts ?? 0}
              </span>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Pending Deliveries */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">Deliveries</div>
                  <div className="text-slate-400 text-xs">Outgoing orders</div>
                </div>
              </div>
              <span className="text-2xl font-black text-slate-900">
                {dashboard?.pending_deliveries ?? 0}
              </span>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Internal Transfers */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">Transfers</div>
                  <div className="text-slate-400 text-xs">Internal moves</div>
                </div>
              </div>
              <span className="text-2xl font-black text-slate-900">
                {dashboard?.internal_transfers ?? 0}
              </span>
            </div>
          </div>

          {/* Inventory Health */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black">Inventory Health</h3>
              <BarChart2 className="w-5 h-5 text-lime-400" />
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl font-black text-lime-400 leading-none">92%</div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                Efficiency Rate
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span className="text-slate-300">Stock Availability</span>
                  <span className="text-white">85%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-400 rounded-full"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span className="text-slate-300">On-time Delivery</span>
                  <span className="text-white">94%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-400 rounded-full"
                    style={{ width: '94%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span className="text-slate-300">Order Accuracy</span>
                  <span className="text-white">97%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: '97%' }}
                  />
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
