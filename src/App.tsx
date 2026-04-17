import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Package, TrendingUp, AlertTriangle, CheckCircle, BarChart3, 
  ShoppingCart, RefreshCw, Filter, ArrowUpRight, ArrowDownRight,
  Search, Info, Download, Calendar
} from 'lucide-react';
import { 
  generateSimulationData, 
  calculateInventoryMetrics, 
  SKUData, 
  InventoryMetrics 
} from './lib/inventory-logic';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [data, setData] = useState<SKUData[]>([]);
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Initial data generation
    const simData = generateSimulationData();
    setData(simData);
    if (simData.length > 0) setSelectedSkuId(simData[0].id);
    setLoading(false);
  }, []);

  const skuWithMetrics = useMemo(() => {
    return data.map(sku => ({
      ...sku,
      metrics: calculateInventoryMetrics(sku)
    }));
  }, [data]);

  const filteredSkus = useMemo(() => {
    return skuWithMetrics.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [skuWithMetrics, searchQuery]);

  const selectedSku = useMemo(() => {
    return skuWithMetrics.find(s => s.id === selectedSkuId) || null;
  }, [skuWithMetrics, selectedSkuId]);

  const stats = useMemo(() => {
    return {
      totalSkus: skuWithMetrics.length,
      reorderNeeded: skuWithMetrics.filter(s => s.metrics.recommendation === 'REORDER_NOW').length,
      overstocked: skuWithMetrics.filter(s => s.metrics.recommendation === 'OVERSTOCK').length,
      healthy: skuWithMetrics.filter(s => s.metrics.recommendation === 'STABLE').length,
      totalValue: skuWithMetrics.reduce((sum, s) => sum + (s.currentStock * s.unitCost), 0)
    };
  }, [skuWithMetrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-main">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 animate-spin text-accent" />
          <p className="font-medium text-text-secondary animate-pulse">Running Simulation Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main text-text-primary font-sans flex">
      {/* Sidebar - Desktop */}
      <div className="fixed lg:static left-0 top-0 bottom-0 w-[240px] bg-sidebar-bg text-[#f1f5f9] flex-shrink-0 flex flex-col py-6 hidden lg:flex overflow-y-auto">
        <div className="px-6 pb-8 flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent rounded-md" />
          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase italic">StockOptima</h1>
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2">Management</p>
          <button className="w-full flex items-center gap-3 px-6 py-3 bg-sidebar-hover text-white border-l-4 border-accent text-sm font-medium">
            <BarChart3 className="w-5 h-5 text-accent" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:bg-sidebar-hover hover:text-white transition-colors text-sm font-medium">
            <Package className="w-5 h-5" /> Inventory Grid
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:bg-sidebar-hover hover:text-white transition-colors text-sm font-medium">
            <TrendingUp className="w-5 h-5" /> Forecast Models
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:bg-sidebar-hover hover:text-white transition-colors text-sm font-medium">
            <ShoppingCart className="w-5 h-5" /> Purchase Orders
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800 space-y-1">
          <button className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:bg-sidebar-hover hover:text-white transition-colors text-sm font-medium text-left">
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:bg-sidebar-hover hover:text-white transition-colors text-sm font-medium text-left">
            Support
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-8 lg:p-10 transition-all overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1 text-text-primary">Sales Forecasting Overview</h2>
            <p className="text-sm text-text-secondary">AI-driven real-time optimization engine</p>
          </div>
          <div className="bg-white border border-border-theme px-4 py-2 rounded-lg text-xs font-medium text-text-secondary shadow-sm">
            Q4 2023 Analysis: Oct 1 - Dec 31
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-card-bg p-5 rounded-xl border border-border-theme shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Forecast Accuracy</div>
            <div className="text-2xl font-bold text-text-primary">94.2%</div>
            <div className="text-[11px] mt-1 text-success font-medium">↑ 1.4% vs last period</div>
          </div>
          <div className="bg-card-bg p-5 rounded-xl border border-border-theme shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Inventory Value</div>
            <div className="text-2xl font-bold text-text-primary">$1.24M</div>
            <div className="text-[11px] mt-1 text-danger font-medium">↓ 4.2% (Optimization gain)</div>
          </div>
          <div className="bg-card-bg p-5 rounded-xl border border-border-theme shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Out-of-Stock Risk</div>
            <div className="text-2xl font-bold text-text-primary">{stats.reorderNeeded} Items</div>
            <div className="text-[11px] mt-1 text-danger font-medium">↓ {stats.reorderNeeded} critical items active</div>
          </div>
          <div className="bg-card-bg p-5 rounded-xl border border-border-theme shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Recommended POs</div>
            <div className="text-2xl font-bold text-text-primary">$42,850</div>
            <div className="text-[11px] mt-1 text-text-secondary font-medium">8 pending approvals</div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
          {/* Main Forecasting Panel */}
          <div className="bg-card-bg p-6 rounded-xl border border-border-theme shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-base font-bold text-text-primary">Demand Forecasting</h3>
                <p className="text-xs text-text-secondary">Units sold (thousands) - Actual vs Projected</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search SKU..."
                    className="pl-8 pr-4 py-1.5 bg-slate-50 border border-border-theme rounded-md text-[11px] w-40 focus:ring-1 focus:ring-accent outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {selectedSku ? (
              <div className="h-[360px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[...selectedSku.history.slice(-30), ...selectedSku.forecast.map(f => ({ ...f, isForecast: true }))]}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" hide />
                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#0f172a" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorActual)" 
                      name="Actual Units"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      data={selectedSku.forecast.map(f => ({ ...f, isForecast: true }))}
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={0.7} 
                      fill="url(#colorForecast)" 
                      name="AI Forecast"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : null}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto border-t border-slate-50 pt-6">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[9px] font-bold text-text-secondary uppercase mb-1">Stock Level</div>
                <div className="text-base font-bold">{selectedSku?.currentStock}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[9px] font-bold text-text-secondary uppercase mb-1">Reorder Point</div>
                <div className="text-base font-bold">{selectedSku?.metrics.reorderPoint}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[9px] font-bold text-text-secondary uppercase mb-1">Safety Stock</div>
                <div className="text-base font-bold">{selectedSku?.metrics.safetyStock}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[9px] font-bold text-text-secondary uppercase mb-1">EOQ</div>
                <div className="text-base font-bold">{selectedSku?.metrics.economicOrderQuantity}</div>
              </div>
            </div>
          </div>

          {/* Side Alerts Panel */}
          <div className="bg-card-bg p-6 rounded-xl border border-border-theme shadow-sm flex flex-col min-h-[500px]">
            <div className="panel-title flex items-center justify-between mb-6">
              <span className="text-base font-bold text-text-primary">Optimization Alerts</span>
              <Filter className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-[13px] data-table">
                <thead>
                  <tr className="text-text-secondary font-medium">
                    <th className="pb-3 border-b border-border-theme">SKU / Product</th>
                    <th className="pb-3 border-b border-border-theme">Stock</th>
                    <th className="pb-3 border-b border-border-theme">Status</th>
                    <th className="pb-3 border-b border-border-theme text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSkus.slice(0, 8).map(sku => (
                    <tr 
                      key={sku.id} 
                      className={cn(
                        "hover:bg-slate-50/50 transition-colors cursor-pointer group",
                        selectedSkuId === sku.id && "bg-slate-50"
                      )}
                      onClick={() => setSelectedSkuId(sku.id)}
                    >
                      <td className="py-3 pr-2">
                        <div className="font-semibold text-text-primary group-hover:text-accent truncate max-w-[120px] transition-colors">{sku.name}</div>
                        <div className="text-[10px] text-text-secondary">{sku.category}</div>
                      </td>
                      <td className="py-3 font-mono text-slate-600">{sku.currentStock}</td>
                      <td className="py-3">
                        <StatusBadge status={sku.metrics.recommendation} />
                      </td>
                      <td className="py-3 text-right">
                        <button className="bg-bg-main border border-border-theme hover:bg-white hover:border-slate-300 px-2 py-1 rounded text-[10px] font-semibold text-text-primary transition-all">
                          {sku.metrics.recommendation === 'REORDER_NOW' ? 'Reorder' : 'Review'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-[10px] text-text-secondary italic">
                AI optimization engine updated 14 minutes ago.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: InventoryMetrics['recommendation'] }) {
  const styles = {
    REORDER_NOW: "bg-[#fee2e2] text-[#991b1b]",
    OVERSTOCK: "bg-[#fef3c7] text-[#92400e]",
    STABLE: "bg-[#d1fae5] text-[#065f46]",
  };
  const labels = {
    REORDER_NOW: "Critical",
    OVERSTOCK: "Excess",
    STABLE: "Optimal",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", styles[status])}>
      {labels[status]}
    </span>
  );
}

function MetricRow({ label, value, target, highlight = false, danger = false }: { label: string, value: any, target: string, highlight?: boolean, danger?: boolean }) {
  return (
    <tr className={cn(highlight && "bg-slate-50")}>
      <td className="px-6 py-4 font-semibold text-text-primary">{label}</td>
      <td className={cn("px-6 py-4 font-mono font-bold", danger ? "text-danger" : "text-text-primary")}>
        {value}
      </td>
      <td className="px-6 py-4 text-text-secondary italic">{target}</td>
      <td className="px-6 py-4">
        <div className={cn(
          "h-2 w-2 rounded-full",
          danger ? "bg-danger animate-pulse" : highlight ? "bg-accent" : "bg-border-theme"
        )}></div>
      </td>
    </tr>
  );
}
