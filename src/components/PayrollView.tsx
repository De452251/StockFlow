import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DollarSign, 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Download,
  Check,
  FileText,
  X,
  UserCheck
} from "lucide-react";
import { Employee, Department, PayrollRecord, CharacterAdvice } from "../types";

interface PayrollViewProps {
  employees: Employee[];
  departments: Department[];
  payrollRecords: PayrollRecord[];
  characterAdvice: CharacterAdvice;
  currency: string;
  onInitializeLedger: (month: string) => void;
  onMarkPaid: (id: string) => void;
}

export default function PayrollView({
  employees,
  departments,
  payrollRecords,
  characterAdvice,
  currency,
  onInitializeLedger,
  onMarkPaid
}: PayrollViewProps) {
  const [selectedMonth, setSelectedMonth] = useState("2026-06");
  const [search, setSearch] = useState("");
  const [activeSlip, setActiveSlip] = useState<PayrollRecord | null>(null);

  const formatCurrency = (val: number) => {
    const symbol = currency.includes("INR") ? "₹" : currency.includes("USD") ? "$" : "€";
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // Filter payroll records for currently selected month
  const currentMonthRecords = payrollRecords.filter(r => r.month === selectedMonth);

  // Stats calculation
  const payrollValue = currentMonthRecords.reduce((acc, r) => acc + r.calculatedNetPay, 0);
  const paidSlipsCount = currentMonthRecords.filter(r => r.status === "Paid").length;
  const pendingSlipsCount = currentMonthRecords.filter(r => r.status === "Pending").length;
  const outstandingSum = currentMonthRecords.filter(r => r.status === "Pending").reduce((acc, r) => acc + r.calculatedNetPay, 0);

  // Search filter
  const filteredRecords = currentMonthRecords.filter(rec => {
    const emp = employees.find(e => e.id === rec.employeeId);
    if (!emp) return false;
    return emp.name.toLowerCase().includes(search.toLowerCase()) || 
           emp.email.toLowerCase().includes(search.toLowerCase()) ||
           emp.role.toLowerCase().includes(search.toLowerCase());
  });

  const handleInitialize = () => {
    onInitializeLedger(selectedMonth);
  };

  // Slip generation popup calculation helper
  const getEmployeeForRecord = (rec: PayrollRecord) => {
    return employees.find(e => e.id === rec.employeeId);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Operational Payroll & Salary Management</h2>
          <p className="text-slate-500 text-xs">Generate monthly payroll summaries, adjust employee credits, track payment transfers, and verify slips.</p>
        </div>

        {/* Month Selector & Trigger Action */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="bg-white border border-slate-200/80 p-2 rounded-xl text-xs flex items-center gap-2 font-semibold">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="2026-06">June 2026 (Active)</option>
              <option value="2026-05">May 2026</option>
              <option value="2026-04">April 2026</option>
            </select>
          </div>

          <button
            onClick={handleInitialize}
            className="bg-[#3a5bf0] hover:bg-indigo-700 text-white rounded-xl py-2.5 px-4 text-xs font-semibold shadow-md shadow-indigo-500/10 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Initialize Monthly Ledger
          </button>
        </div>
      </div>

      {/* Anya banner advice */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex gap-4 items-center">
        <div className="text-3xl p-2 bg-slate-800/80 rounded-xl border border-slate-705 shrink-0">
          {characterAdvice.avatar}
        </div>
        <div>
          <h4 className="text-xs uppercase font-mono tracking-widest text-indigo-400">
            {characterAdvice.name} PAYROLL COMPASS
          </h4>
          <p className="mt-1 text-slate-300 text-xs leading-relaxed font-sans">
            &ldquo;{characterAdvice.payroll}&rdquo;
          </p>
        </div>
      </div>

      {/* Stats Cards (4 items matching design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">PAYROLL VALUE</p>
            <h4 className="text-lg font-black text-slate-800 mt-1">{formatCurrency(payrollValue)}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">{selectedMonth} Summary</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">TRANSFERS PAID</p>
            <h4 className="text-lg font-black text-slate-850 mt-1">{paidSlipsCount} Paid slips</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">{currentMonthRecords.length} total generated entries</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">PAYMENTS PENDING</p>
            <h4 className="text-lg font-black text-slate-850 mt-1">{pendingSlipsCount} Pending</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Ready for disbursement</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">OUTSTANDING SUM</p>
            <h4 className="text-lg font-black text-slate-850 mt-1">{formatCurrency(outstandingSum)}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Unresolved Ledger Balance</p>
          </div>
        </div>
      </div>

      {/* Main Table Segment */}
      <div className="space-y-4">
        {/* Search & Month signpost */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payroll records by name or title..."
              className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider font-mono shrink-0">
            Month Ledger: <span className="bg-indigo-50 border border-indigo-100 py-1 px-2.5 rounded-lg text-[11px] font-black">{selectedMonth}</span>
          </div>
        </div>

        {/* Ledger Entries List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-xs">
          {currentMonthRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    <th className="p-4 font-bold">Personnel Detail</th>
                    <th className="p-4 font-bold text-right font-mono">Base Salary</th>
                    <th className="p-4 font-bold text-right font-mono">Adjusted Allowances</th>
                    <th className="p-4 font-bold text-right font-mono">Deductions</th>
                    <th className="p-4 font-bold text-right font-mono">Calculated Net Pay</th>
                    <th className="p-4 font-bold text-center">Status</th>
                    <th className="p-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRecords.map((rec) => {
                    const emp = getEmployeeForRecord(rec);
                    if (!emp) return null;

                    const totalAl = emp.ctcBreakdown.hra + emp.ctcBreakdown.da + emp.ctcBreakdown.ta + emp.ctcBreakdown.medical + emp.ctcBreakdown.special;
                    const totalDed = emp.deductions.pf + emp.deductions.esi + emp.deductions.tds;

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex gap-2.5 items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                              {emp.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block text-xs">{emp.name}</span>
                              <span className="text-[10px] text-slate-400 block font-semibold">{emp.role}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono text-slate-700">{formatCurrency(rec.baseSalary)}</td>
                        <td className="p-4 text-right font-mono text-indigo-600 font-medium">+{formatCurrency(totalAl)}</td>
                        <td className="p-4 text-right font-mono text-rose-500 font-medium">-{formatCurrency(totalDed)}</td>
                        <td className="p-4 text-right font-mono font-bold text-slate-900">{formatCurrency(rec.calculatedNetPay)}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-widest ${
                            rec.status === "Paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {rec.status === "Pending" && (
                              <button
                                onClick={() => onMarkPaid(rec.id)}
                                className="py-1 px-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 hover:border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 uppercase"
                              >
                                <Check className="w-3.5 h-3.5" /> Mark Paid
                              </button>
                            )}
                            <button
                              onClick={() => setActiveSlip(rec)}
                              className="py-1 px-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100 text-slate-600 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                              title="Download Statement slip"
                            >
                              <FileText className="w-3.5 h-3.5" /> Slip
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty state matching the 2nd screenshot */
            <div className="p-16 text-center text-slate-400 relative bg-[#ffffff]">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  💰
                </div>
                <h4 className="text-sm font-bold text-slate-800">No payroll entries initialized</h4>
                <p className="text-[11px] text-slate-500 max-w-xs">Click &ldquo;Initialize Monthly Ledger&rdquo; above to construct the sheet.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Salary Slip Invoice/Popup Modal */}
      <AnimatePresence>
        {activeSlip && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg border border-slate-100 shadow-2xl overflow-hidden font-sans text-slate-700 p-6 space-y-4"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest font-mono">STOCKFLOW STATEMENT SLIP</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Pay slip cycle of {activeSlip.month}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSlip(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Employee brief */}
              {getEmployeeForRecord(activeSlip) && (() => {
                const emp = getEmployeeForRecord(activeSlip)!;
                const dept = departments.find(d => d.id === emp.departmentId)?.name || "Primary Dept";
                return (
                  <div className="bg-slate-50/50 p-4 rounded-2xl space-y-2 border border-slate-100">
                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400 font-mono">FULL NAME</p>
                        <p className="font-bold text-slate-800">{emp.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-mono">EMPLOYEE EMAIL</p>
                        <p className="font-semibold text-slate-700">{emp.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-mono">DEPARTMENT UNIT</p>
                        <p className="font-semibold text-slate-700">{dept}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-mono">DESIGNATION ROLE</p>
                        <p className="font-bold text-indigo-600 text-[11px]">{emp.role}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Earnings & Allowance Breakdowns</h4>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Baseline Basic Salary:</span>
                    <span>{formatCurrency(activeSlip.baseSalary)}</span>
                  </div>
                  {getEmployeeForRecord(activeSlip) && (() => {
                    const emp = getEmployeeForRecord(activeSlip)!;
                    return (
                      <>
                        <div className="flex justify-between text-slate-500">
                          <span>House Rent Allowance (HRA):</span>
                          <span>+{formatCurrency(emp.ctcBreakdown.hra)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Dearness Allowance (DA):</span>
                          <span>+{formatCurrency(emp.ctcBreakdown.da)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Travel Conveyance:</span>
                          <span>+{formatCurrency(emp.ctcBreakdown.ta)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Other Special Allowance:</span>
                          <span>+{formatCurrency(emp.ctcBreakdown.special)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Mandatory Reductions</h4>
                <div className="space-y-1.5 text-xs font-mono text-rose-500">
                  {getEmployeeForRecord(activeSlip) && (() => {
                    const emp = getEmployeeForRecord(activeSlip)!;
                    return (
                      <>
                        <div className="flex justify-between">
                          <span>Employee Provident Fund (EPF):</span>
                          <span>-{formatCurrency(emp.deductions.pf)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>TDS withholding taxes:</span>
                          <span>-{formatCurrency(emp.deductions.tds)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ESI Insurance support:</span>
                          <span>-{formatCurrency(emp.deductions.esi)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-slate-950 text-white p-4.5 rounded-2xl flex justify-between items-center mt-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">NET DISBURSED PAY</p>
                  <p className="text-xs text-indigo-300 mt-1">Transaction status: <span className="font-bold underline">{activeSlip.status}</span></p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-white">{formatCurrency(activeSlip.calculatedNetPay)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs font-sans pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSlip(null)}
                  className="py-2.5 px-4 rounded-xl border border-slate-205 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Pay slip downloaded successfully as PDF representation.");
                    setActiveSlip(null);
                  }}
                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Download className="w-4 h-4" /> Download Statement PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
