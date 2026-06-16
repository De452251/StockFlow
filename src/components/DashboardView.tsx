import React from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  Layers, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  Package,
  Boxes
} from "lucide-react";
import { 
  Godown, 
  Department, 
  Employee, 
  StockItem, 
  AttendanceRecord, 
  CharacterAdvice 
} from "../types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface DashboardViewProps {
  godowns: Godown[];
  departments: Department[];
  employees: Employee[];
  stockItems: StockItem[];
  attendance: AttendanceRecord[];
  characterAdvice: CharacterAdvice;
  currency: string;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({
  godowns,
  departments,
  employees,
  stockItems,
  attendance,
  characterAdvice,
  currency,
  onNavigate
}: DashboardViewProps) {

  // Calculate totals
  const totalStockWorth = stockItems.reduce((acc, item) => acc + (item.openingStock * item.buyingCost), 0);
  const totalStockUnits = stockItems.reduce((acc, item) => acc + item.openingStock, 0);

  // Physical Inventory statistics
  const totalAllocated = Math.round(totalStockUnits * 0.15); // Simulated allocation for aesthetics
  const balanceStock = totalStockUnits - totalAllocated;
  const allocationPercentage = totalStockUnits > 0 ? Math.round((totalAllocated / totalStockUnits) * 100) : 0;

  // Active Family / Daily Attendance Ratio
  const today = "2026-06-15"; // Base roster simulation date
  const todayRecords = attendance.filter(r => r.date === today);
  const presentRecords = todayRecords.filter(r => r.status === "Present" || r.status === "Half Day");
  const presentCount = presentRecords.length;
  const activeMembersCount = employees.length;
  const attendanceRatio = activeMembersCount > 0 ? Math.round((presentCount / activeMembersCount) * 100) : 0;

  // Collective compensation / payroll calculation (Monthly)
  const totalBasicPay = employees.reduce((acc, emp) => acc + emp.ctcBreakdown.basic, 0);
  const totalAllowances = employees.reduce((acc, emp) => {
    const c = emp.ctcBreakdown;
    return acc + c.hra + c.da + c.ta + c.medical + c.special;
  }, 0);
  const totalDeductions = employees.reduce((acc, emp) => {
    const d = emp.deductions;
    return acc + d.pf + d.esi + d.tds;
  }, 0);
  const totalMonthlyPayroll = totalBasicPay + totalAllowances - totalDeductions;

  // Formatter helper
  const formatCurrency = (val: number) => {
    const symbol = currency.includes("INR") ? "₹" : currency.includes("USD") ? "$" : "€";
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Prepare chart data per Warehouse
  const chartData = godowns.map(g => {
    // Find stock items in this godown
    const itemsInGodown = stockItems.filter(item => item.godownId === g.id);
    const worth = itemsInGodown.reduce((acc, item) => acc + (item.openingStock * item.buyingCost), 0);
    return {
      name: g.name,
      "Stock Value": worth,
      "Total Units": itemsInGodown.reduce((acc, item) => acc + item.openingStock, 0)
    };
  });

  // Calculate under-threshold alerts
  const lowStockAlerts = stockItems.filter(item => item.openingStock < item.alertThreshold);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Our Hub & Overview</h2>
        <p className="text-slate-500 text-xs">Real-time enterprise metrics, stock distributions, staff status, and tone-guided alerts.</p>
      </div>

      {/* Anya / Character Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900"
      >
        <div className="flex gap-4 items-start md:items-center">
          <div className="text-4xl p-2 bg-slate-800/80 rounded-xl border border-slate-700/50 relative shrink-0">
            {characterAdvice.avatar}
          </div>
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-indigo-400 flex items-center gap-2">
              {characterAdvice.name} <span className="text-[10px] py-0.5 px-2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 normal-case">{characterAdvice.title}</span>
            </h4>
            <p className="mt-2 text-slate-300 text-xs font-sans leading-relaxed max-w-2xl">
              &ldquo;{characterAdvice.hub}&rdquo;
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center text-xs text-slate-400 shrink-0 self-end md:self-center font-mono">
          <span>MEET OTHER MANAGERS HERE:</span>
          <div className="flex space-x-1.5 bg-slate-950 text-base p-1.5 rounded-lg border border-slate-800/80">
            <span>👩‍💼</span><span>👨‍💻</span><span>👨‍🔬</span><span>😎</span>
          </div>
        </div>
      </motion.div>

      {/* Grid of 4 beautiful KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Our Shared Worth */}
        <motion.div 
          onClick={() => onNavigate("Stock")}
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">OUR SHARED WORTH (STOCK VALUATION)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><TrendingUp className="w-4.5 h-4.5" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{formatCurrency(totalStockWorth)}</h3>
            <p className="text-slate-500 text-[11px] mt-1 flex items-center gap-1">
              <Package className="w-3.5 h-3.5" /> {totalStockUnits.toLocaleString()} units logged
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-blue-600 font-semibold uppercase font-mono">
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Card 2: Physical Inventory Harmony */}
        <motion.div 
          onClick={() => onNavigate("Stock")}
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">PHYSICAL INVENTORY HARMONY</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Boxes className="w-4.5 h-4.5" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{totalStockUnits.toLocaleString()} <span className="text-xs text-slate-400 font-medium font-sans">/ {totalStockUnits + 5000} units</span></h3>
            <p className="text-slate-500 text-[11px] mt-1 flex items-center gap-1.5">
              <span>Allocated: {totalAllocated.toLocaleString()} ({allocationPercentage}%)</span>
              <span className="text-slate-300">|</span>
              <span>Balance: {balanceStock.toLocaleString()}</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-indigo-600 font-semibold uppercase font-mono">
            <span>Warehouses</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Card 3: Active Family */}
        <motion.div 
          onClick={() => onNavigate("Attendance")}
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">OUR ACTIVE FAMILY PRESENCE</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><Users className="w-4.5 h-4.5" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{attendanceRatio}% <span className="text-xs text-slate-400 font-medium font-sans">Present today</span></h3>
            <p className="text-slate-500 text-[11px] mt-1 flex items-center gap-1">
              <span>{presentCount} active in field</span>
              <span className="text-slate-300">|</span>
              <span>{activeMembersCount} team ledger profiles</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-emerald-600 font-semibold uppercase font-mono">
            <span>Mark Roster</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Card 4: Collective Compensation */}
        <motion.div 
          onClick={() => onNavigate("Payroll")}
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">OUR COLLECTIVE COMPENSATION HUB</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600"><DollarSign className="w-4.5 h-4.5" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{formatCurrency(totalMonthlyPayroll)}<span className="text-xs text-slate-400 font-medium font-sans"> / mo</span></h3>
            <p className="text-slate-500 text-[11px] mt-1">
              Basic: {formatCurrency(totalBasicPay)} | Deductions: {formatCurrency(totalDeductions)}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-purple-600 font-semibold uppercase font-mono">
            <span>Payroll Ledg.</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>
      </div>

      {/* Main Section Grid for Charts and Threshold Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Godown Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Warehouse Stock Valuation Comparison</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Visualizes total worth of inventory held across configured warehouses. Click on Godowns to re-route assignments.</p>
            </div>
            <button 
              onClick={() => onNavigate("Warehouses")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 font-mono uppercase bg-indigo-50/50 py-1.5 px-3 rounded-lg"
            >
              Godown Storage
            </button>
          </div>

          <div className="h-68 w-full font-mono text-[11px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(val) => currency.includes("INR") ? `₹${val/1000}k` : `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }}
                    itemStyle={{ color: "#a5b4fc" }}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Bar dataKey="Stock Value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 font-sans bg-slate-50/50 rounded-xl">
                <Building2 className="w-8 h-8 text-slate-300" />
                <p className="text-xs">No warehouse stock data to compile representation.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Low Stock Alert checklist */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Threshold Alerts</h3>
              <span className={`text-[10px] uppercase font-mono font-bold tracking-wider py-0.5 px-2 rounded-full flex items-center gap-1 ${
                lowStockAlerts.length > 0 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
              }`}>
                {lowStockAlerts.length > 0 ? `${lowStockAlerts.length} Low` : "0 Low"}
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-normal mb-4">
              Items running below critical minimum threshold. Allocation is locked or warning issued.
            </p>

            <div className="space-y-3 overflow-y-auto max-h-48 pr-1">
              {lowStockAlerts.length > 0 ? (
                lowStockAlerts.map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50/30 border border-rose-100/60">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 leading-tight">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Stock: <span className="text-rose-600 font-bold">{item.openingStock} {item.uom}</span> / Alert min: {item.alertThreshold}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 gap-2 bg-slate-50/40 rounded-xl border border-dashed border-slate-100">
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                  <p className="text-xs font-medium text-slate-600">All inventory stocks are healthy.</p>
                  <p className="text-[10px] text-slate-400 max-w-[180px]">No commodities are presently violating safe reservation indices.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
            Real-time critical health monitors
          </div>
        </div>
      </div>

      {/* Real-Time Timeline and Recent Logs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Real-time Stock Allocation & Transaction Timeline</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Recent transactions, stock allocation entries, department lockups, and godown deliveries mapped chronologically.</p>
          </div>
          <button 
            onClick={() => onNavigate("Stock")}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 font-mono uppercase"
          >
            Review Full Ledger
          </button>
        </div>

        <div className="relative border-l border-slate-100 pl-4 space-y-4 py-2 ml-2">
          {stockItems.slice(0, 3).map((item, idx) => (
            <div key={item.id} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-100 border border-indigo-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">
                    Baseline entry verified for <span className="text-indigo-600">&ldquo;{item.name}&rdquo;</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    Stock allocated to <span className="font-bold">{godowns.find(g => g.id === item.godownId)?.name || "Main Godown"}</span> under category &ldquo;{item.category}&rdquo;. Barcode mapped: {item.barcode}.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono self-start sm:self-center">
                  <Clock className="w-3 h-3" />
                  <span>{new Date().toLocaleDateString()} {10 + idx}:30 AM</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
