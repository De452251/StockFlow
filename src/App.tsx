import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Layers, 
  Users, 
  Calendar, 
  Wallet, 
  Tag, 
  Home, 
  LogOut, 
  RefreshCw, 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  User, 
  Box,
  Crown
} from "lucide-react";

// Import custom components
import LoginView from "./components/LoginView";
import DashboardView from "./components/DashboardView";
import StockView from "./components/StockView";
import PersonnelView from "./components/PersonnelView";
import AttendanceView from "./components/AttendanceView";
import PayrollView from "./components/PayrollView";
import WarehouseView from "./components/WarehouseView";
import DepartmentView from "./components/DepartmentView";

// Import types & seed defaults
import { 
  Godown, 
  Department, 
  Employee, 
  StockItem, 
  AttendanceRecord, 
  PayrollRecord, 
  AttendanceStatus, 
  ToneType, 
  CHARACTERS 
} from "./types";

import { 
  DEFAULT_GODOWNS, 
  DEFAULT_DEPARTMENTS, 
  DEFAULT_EMPLOYEES, 
  DEFAULT_STOCK_ITEMS, 
  DEFAULT_ATTENDANCE 
} from "./defaultData";

export default function App() {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("stockflow_user_email");
  });

  // Main data states
  const [godowns, setGodowns] = useState<Godown[]>(() => {
    const saved = localStorage.getItem("stockflow_godowns");
    return saved ? JSON.parse(saved) : DEFAULT_GODOWNS;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem("stockflow_departments");
    return saved ? JSON.parse(saved) : DEFAULT_DEPARTMENTS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("stockflow_employees");
    return saved ? JSON.parse(saved) : DEFAULT_EMPLOYEES;
  });

  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem("stockflow_stock_items");
    return saved ? JSON.parse(saved) : DEFAULT_STOCK_ITEMS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem("stockflow_attendance");
    return saved ? JSON.parse(saved) : DEFAULT_ATTENDANCE;
  });

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem("stockflow_payroll_records");
    return saved ? JSON.parse(saved) : [];
  });

  // System Configuration/Aesthetics States
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem("stockflow_active_tab") || "Hub";
  });
  const [activeTone, setActiveTone] = useState<ToneType>(() => {
    return (localStorage.getItem("stockflow_active_tone") as ToneType) || "Anya";
  });
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem("stockflow_currency") || "INR (₹)";
  });

  // Mobile sidebar states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem("stockflow_godowns", JSON.stringify(godowns));
  }, [godowns]);

  useEffect(() => {
    localStorage.setItem("stockflow_departments", JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem("stockflow_employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("stockflow_stock_items", JSON.stringify(stockItems));
  }, [stockItems]);

  useEffect(() => {
    localStorage.setItem("stockflow_attendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem("stockflow_payroll_records", JSON.stringify(payrollRecords));
  }, [payrollRecords]);

  useEffect(() => {
    localStorage.setItem("stockflow_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("stockflow_active_tone", activeTone);
  }, [activeTone]);

  useEffect(() => {
    localStorage.setItem("stockflow_currency", currency);
  }, [currency]);

  // Auth Operations
  const handleLogin = (email: string) => {
    setCurrentUserEmail(email);
    localStorage.setItem("stockflow_user_email", email);
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
    localStorage.removeItem("stockflow_user_email");
  };

  // Systems Restore defaults helper
  const handleRestoreDefaults = () => {
    if (window.confirm("Restore system ledgers back to factory reset values? All current inputs will be reset.")) {
      setGodowns(DEFAULT_GODOWNS);
      setDepartments(DEFAULT_DEPARTMENTS);
      setEmployees(DEFAULT_EMPLOYEES);
      setStockItems(DEFAULT_STOCK_ITEMS);
      setAttendance(DEFAULT_ATTENDANCE);
      setPayrollRecords([]);
      setActiveTab("Hub");
      setActiveTone("Anya");
      setCurrency("INR (₹)");
    }
  };

  // State manipulation interfaces
  const handleAddStock = (item: StockItem) => {
    setStockItems(prev => [item, ...prev]);
  };

  const handleEditStock = (id: string, updated: StockItem) => {
    setStockItems(prev => prev.map(item => item.id === id ? updated : item));
  };

  const handleDeleteStock = (id: string) => {
    if (window.confirm("Verify and release this stock commodity item from catalog ledger?")) {
      setStockItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddEmployee = (emp: Employee) => {
    setEmployees(prev => [emp, ...prev]);
  };

  const handleEditEmployee = (id: string, updated: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? updated : emp));
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm("Release and discharge employee credentials from payroll rosters?")) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      // Clean up attendance record links optionally if desired
    }
  };

  const handleUpdateAttendance = (date: string, empId: string, status: AttendanceStatus) => {
    setAttendance(prev => {
      const filtered = prev.filter(r => !(r.date === date && r.employeeId === empId));
      return [...filtered, { date, employeeId: empId, status }];
    });
  };

  const handleInitializePayrollLedger = (month: string) => {
    // Generate records for each employee that doesn't have an entry for this month
    const newRecords: PayrollRecord[] = employees.map(emp => {
      const gross = emp.ctcBreakdown.basic + emp.ctcBreakdown.hra + emp.ctcBreakdown.da + emp.ctcBreakdown.ta + emp.ctcBreakdown.medical + emp.ctcBreakdown.special;
      const deductions = emp.deductions.pf + emp.deductions.esi + emp.deductions.tds;
      const net = gross - deductions;

      return {
        id: `pr_${month}_${emp.id}`,
        month,
        employeeId: emp.id,
        baseSalary: emp.ctcBreakdown.basic,
        allowances: gross - emp.ctcBreakdown.basic,
        deductions,
        calculatedNetPay: net,
        status: "Pending" as const
      };
    });

    setPayrollRecords(prev => {
      const otherMonths = prev.filter(r => r.month !== month);
      return [...otherMonths, ...newRecords];
    });

    alert(`Payroll ledger generated successfully for month cycle: ${month}. populated ${newRecords.length} statements.`);
  };

  const handleMarkPaid = (id: string) => {
    setPayrollRecords(prev => prev.map(r => r.id === id ? { ...r, status: "Paid" } : r));
  };

  const handleAddGodown = (g: Godown) => {
    setGodowns(prev => [...prev, g]);
  };

  const handleAddDepartment = (d: Department) => {
    setDepartments(prev => [...prev, d]);
  };

  // Auth gate
  if (!currentUserEmail) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Get active character tone content
  const coachAdvice = CHARACTERS[activeTone];

  // Map tabs
  const navItems = [
    { id: "Hub", label: "Our Hub & Overview", icon: Home },
    { id: "Stock", label: "Our Stock & Treasures", icon: Tag },
    { id: "Personnel", label: "Personnel Ledger", icon: Users },
    { id: "Attendance", label: "Daily Attendance", icon: Calendar },
    { id: "Payroll", label: "Payroll & Salary", icon: Wallet },
    { id: "Warehouses", label: "Warehouses / Godowns", icon: Building2 },
    { id: "Departments", label: "Org Departments", icon: Layers }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased text-slate-800">
      {/* Sidebar - Desktop and Mobile adaptive drawer */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0c1524] text-white p-5 transform ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0`}>
        {/* Sidebar Top branding */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#6366f1] flex items-center justify-center shadow-lg shadow-blue-500/10 border border-blue-400/20 rounded-lg">
                <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(255,255,255,0.08)" stroke="currentColor" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-black tracking-wider text-slate-100 uppercase">
                  STOCKFLOW
                </h1>
                <p className="text-[9px] font-mono tracking-widest text-[#6366f1] leading-none uppercase mt-0.5 font-bold">
                  Free Enterprise Hub
                </p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1 bg-slate-800 hover:bg-slate-705 rounded-lg text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-8 space-y-1.5 font-sans">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? "bg-indigo-600/95 text-white shadow-md shadow-indigo-600/10 scale-[1.02]" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-all ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer details */}
        <div className="space-y-4 pt-6 border-t border-slate-800/80 mt-auto">
          {/* Subscription Panel */}
          <div className="bg-slate-900/60 border border-slate-800/60 p-3.5 rounded-xl relative overflow-hidden">
            <span className="text-[8px] font-mono tracking-wider text-slate-500 uppercase block">SUBSCRIPTION STATUS</span>
            <span className="text-[11px] font-extrabold text-white mt-1 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Totally Free (Unlimited)
            </span>
          </div>

          <button
            onClick={handleRestoreDefaults}
            className="w-full py-2 bg-slate-900/40 hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 border border-slate-800 rounded-xl text-[10px] uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3 text-rose-500" /> Restore System Defaults
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Controls bar */}
        <header className="bg-white border-b border-slate-100 shrink-0 sticky top-0 z-30 font-sans">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 bg-slate-50 border border-slate-150 text-slate-700 rounded-lg shrink-0 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Coach Characters Selector (STOCKFLOW TONE) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono hidden md:inline shrink-0 mr-1">
                STOCKFLOW TONE:
              </span>
              <div className="flex p-0.5 bg-slate-50 border border-slate-200/80 rounded-xl space-x-1 shrink-0 font-mono">
                {(["Anya", "Mac", "Dexter", "Sal"] as ToneType[]).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setActiveTone(tone)}
                    className={`py-1.5 px-3.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all text-nowrap select-none ${
                      activeTone === tone 
                        ? "bg-white text-slate-800 shadow-xs border border-slate-200/40 font-bold" 
                        : "text-slate-400 hover:text-slate-650"
                    }`}
                  >
                    <span>{CHARACTERS[tone].avatar}</span>
                    <span>{tone}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right details configuration (Cloud, Currency and Profiling) */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Cloud state */}
              <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 py-1 px-2.5 rounded-full uppercase select-none shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                STATE: Cloud Active
              </span>

              {/* Currency Selector */}
              <div className="hidden xs:flex items-center gap-1 text-[10px] font-bold font-mono text-slate-400 py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner select-none shrink-0">
                <span>CURRENCY:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer text-slate-700 font-extrabold focus:ring-0 rounded"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2 border-l border-slate-100 pl-3">
                <div className="text-right hidden sm:block font-sans">
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">Devesh313uniyal</p>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">{currentUserEmail}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-8.5 h-8.5 bg-slate-50 hover:bg-slate-1 py-1 px-2 text-slate-600 rounded-xl hover:text-rose-600 border border-slate-200 hover:border-rose-100 flex items-center justify-center transition-colors"
                  title="Shift Clock-out / Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 overflow-y-auto">
          {activeTab === "Hub" && (
            <DashboardView 
              godowns={godowns}
              departments={departments}
              employees={employees}
              stockItems={stockItems}
              attendance={attendance}
              characterAdvice={coachAdvice}
              currency={currency}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === "Stock" && (
            <StockView 
              stockItems={stockItems}
              godowns={godowns}
              departments={departments}
              characterAdvice={coachAdvice}
              currency={currency}
              onAddStock={handleAddStock}
              onEditStock={handleEditStock}
              onDeleteStock={handleDeleteStock}
            />
          )}

          {activeTab === "Personnel" && (
            <PersonnelView 
              employees={employees}
              departments={departments}
              characterAdvice={coachAdvice}
              currency={currency}
              onAddEmployee={handleAddEmployee}
              onEditEmployee={handleEditEmployee}
              onDeleteEmployee={handleDeleteEmployee}
            />
          )}

          {activeTab === "Attendance" && (
            <AttendanceView 
              employees={employees}
              departments={departments}
              attendance={attendance}
              characterAdvice={coachAdvice}
              onUpdateAttendance={handleUpdateAttendance}
            />
          )}

          {activeTab === "Payroll" && (
            <PayrollView 
              employees={employees}
              departments={departments}
              payrollRecords={payrollRecords}
              characterAdvice={coachAdvice}
              currency={currency}
              onInitializeLedger={handleInitializePayrollLedger}
              onMarkPaid={handleMarkPaid}
            />
          )}

          {activeTab === "Warehouses" && (
            <WarehouseView 
              godowns={godowns}
              stockItems={stockItems}
              characterAdvice={coachAdvice}
              onAddGodown={handleAddGodown}
            />
          )}

          {activeTab === "Departments" && (
            <DepartmentView 
              departments={departments}
              employees={employees}
              characterAdvice={coachAdvice}
              onAddDepartment={handleAddDepartment}
            />
          )}
        </main>
      </div>
    </div>
  );
}
