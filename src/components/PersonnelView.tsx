import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Search, 
  UserMinus, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  X, 
  Check, 
  TrendingUp, 
  DollarSign,
  User,
  Calculator
} from "lucide-react";
import { Godown, Department, Employee, CharacterAdvice } from "../types";

interface PersonnelViewProps {
  employees: Employee[];
  departments: Department[];
  characterAdvice: CharacterAdvice;
  currency: string;
  onAddEmployee: (emp: Employee) => void;
  onEditEmployee: (id: string, updated: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function PersonnelView({
  employees,
  departments,
  characterAdvice,
  currency,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee
}: PersonnelViewProps) {
  const [search, setSearch] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [joiningDate, setJoiningDate] = useState("2026-06-15");

  // Allowances (CTC Breakdown)
  const [basic, setBasic] = useState<number>(30000);
  const [hra, setHra] = useState<number>(10000);
  const [da, setDa] = useState<number>(5000);
  const [ta, setTa] = useState<number>(3000);
  const [medical, setMedical] = useState<number>(1500);
  const [special, setSpecial] = useState<number>(2000);

  // Deductions
  const [pf, setPf] = useState<number>(3600);
  const [esi, setEsi] = useState<number>(250);
  const [tds, setTds] = useState<number>(1200);

  // Auto-calculated Net Home Pay
  const [calculatedNet, setCalculatedNet] = useState<number>(0);

  useEffect(() => {
    // Net Pay = Basic + Allowances - Deductions
    const allowancesTotal = Number(hra) + Number(da) + Number(ta) + Number(medical) + Number(special);
    const deductionsTotal = Number(pf) + Number(esi) + Number(tds);
    setCalculatedNet(Number(basic) + allowancesTotal - deductionsTotal);
  }, [basic, hra, da, ta, medical, special, pf, esi, tds]);

  // Handle opening for adding
  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setName("");
    setEmail("");
    setPhone("91");
    setRole("");
    setDepartmentId(departments[0]?.id || "");
    setJoiningDate(new Date().toISOString().split("T")[0]);
    setBasic(30000);
    setHra(10000);
    setDa(5000);
    setTa(3000);
    setMedical(1500);
    setSpecial(2000);
    setPf(3600);
    setEsi(250);
    setTds(1200);
    setIsOpenModal(true);
  };

  // Handle edit
  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setEmail(emp.email);
    setPhone(emp.phone);
    setRole(emp.role);
    setDepartmentId(emp.departmentId);
    setJoiningDate(emp.joiningDate);
    setBasic(emp.ctcBreakdown.basic);
    setHra(emp.ctcBreakdown.hra);
    setDa(emp.ctcBreakdown.da);
    setTa(emp.ctcBreakdown.ta);
    setMedical(emp.ctcBreakdown.medical);
    setSpecial(emp.ctcBreakdown.special);
    setPf(emp.deductions.pf);
    setEsi(emp.deductions.esi);
    setTds(emp.deductions.tds);
    setIsOpenModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) return;

    const dataset: Employee = {
      id: editingEmployee ? editingEmployee.id : `emp_${Date.now()}`,
      name,
      email,
      phone,
      role,
      departmentId,
      joiningDate,
      ctcBreakdown: {
        basic: Number(basic),
        hra: Number(hra),
        da: Number(da),
        ta: Number(ta),
        medical: Number(medical),
        special: Number(special)
      },
      deductions: {
        pf: Number(pf),
        esi: Number(esi),
        tds: Number(tds)
      }
    };

    if (editingEmployee) {
      onEditEmployee(editingEmployee.id, dataset);
    } else {
      onAddEmployee(dataset);
    }
    setIsOpenModal(false);
  };

  const formatCurrency = (val: number) => {
    const symbol = currency.includes("INR") ? "₹" : currency.includes("USD") ? "$" : "€";
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // Filter Employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
                          emp.email.toLowerCase().includes(search.toLowerCase()) ||
                          emp.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDeptFilter === "all" || emp.departmentId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Team Member & Employee Ledgers</h2>
          <p className="text-slate-500 text-xs">Recruit unlimited members, assign operational departments, set precise base salaries, and track attendance states.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-2.5 px-4 text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Employee
        </button>
      </div>

      {/* Advice character Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex gap-4 items-center">
        <div className="text-3xl p-2 bg-slate-800/80 rounded-xl border border-slate-705 shrink-0">
          {characterAdvice.avatar}
        </div>
        <div>
          <h4 className="text-xs uppercase font-mono tracking-widest text-indigo-400">
            {characterAdvice.name} PERSONNEL PHILOSOPHY
          </h4>
          <p className="mt-1 text-slate-300 text-xs leading-relaxed font-sans">
            &ldquo;{characterAdvice.ledger}&rdquo;
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team roster by name, email, or role description..."
            className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-2 rounded-xl border border-slate-200/80 text-xs text-slate-600 w-full md:w-auto justify-end">
          <Calculator className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="bg-transparent focus:outline-none text-xs font-medium cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                <th className="p-4 font-bold">Personnel Profile</th>
                <th className="p-4 font-bold">Department Placement</th>
                <th className="p-4 font-bold">Registered Contacts</th>
                <th className="p-4 font-bold text-right font-mono">Monthly CTC (Gross)</th>
                <th className="p-4 font-bold text-right font-mono">Monthly Deductions</th>
                <th className="p-4 font-bold text-right font-mono">Estimated Take Home</th>
                <th className="p-4 font-bold text-center">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => {
                  const gross = emp.ctcBreakdown.basic + emp.ctcBreakdown.hra + emp.ctcBreakdown.da + emp.ctcBreakdown.ta + emp.ctcBreakdown.medical + emp.ctcBreakdown.special;
                  const deductions = emp.deductions.pf + emp.deductions.esi + emp.deductions.tds;
                  const takeHome = gross - deductions;
                  const dept = departments.find(d => d.id === emp.departmentId)?.name || "Unassigned Dept";

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex gap-2.5 items-center">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200/60 text-slate-700 flex items-center justify-center font-bold text-xs">
                            {emp.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">{emp.name}</span>
                            <span className="text-[11px] text-slate-400 mt-0.5 block font-semibold text-indigo-500">{emp.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-700 font-medium">{dept}</span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Joined: {emp.joiningDate}</span>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <span className="text-slate-600 font-medium flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {emp.email}</span>
                        <span className="text-slate-500 font-mono flex items-center gap-1 text-[11px]"><Phone className="w-3.5 h-3.5 text-slate-400" /> +{emp.phone}</span>
                      </td>
                      <td className="p-4 text-right font-mono text-slate-700">{formatCurrency(gross)}</td>
                      <td className="p-4 text-right font-mono text-rose-500 font-medium">-{formatCurrency(deductions)}</td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-600">{formatCurrency(takeHome)}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
                            title="Edit CTC Breakdown"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteEmployee(emp.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Release Member"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 bg-slate-50/25">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <User className="w-10 h-10 text-slate-300" />
                      <p className="text-xs font-semibold text-slate-600">No employee records found</p>
                      <p className="text-[10px] text-slate-400">Try creating a new employee using the button on top</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Popup Modal */}
      <AnimatePresence>
        {isOpenModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl border border-slate-100 shadow-2xl overflow-hidden font-sans my-8"
            >
              {/* Header block */}
              <div className="bg-[#4f46e5] text-white p-6 relative">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="absolute top-5 right-5 text-indigo-100 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold tracking-tight">
                  {editingEmployee ? "Update Employee Pay Structure & Placements" : "Register New Employee Credentials"}
                </h3>
                <p className="text-xs text-indigo-100 mt-1 lines-normal">
                  Configure department placements, roles, contact handles, and baseline pay structures with inline payroll allowances.
                </p>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                {/* Section A: Personnel details */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-1 border-b border-slate-100">
                    <User className="w-4 h-4 text-indigo-500" /> PERSONNEL DETAILS
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">FULL NAME *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Devesh Uniyal"
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">EMPLOYEE EMAIL *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="devesh@company.com"
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">PHONE *</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 919830775555"
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">ROLE TITLE *</label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Product Operation Lead"
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">DEPARTMENT ASSIGNMENT</label>
                      <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">JOINING DATE</label>
                      <input
                        type="date"
                        value={joiningDate}
                        onChange={(e) => setJoiningDate(e.target.value)}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: CTC COMPONENT BREAKDOWN */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-1 border-b border-slate-100">
                    <TrendingUp className="w-4 h-4 text-indigo-500" /> CTC COMPONENT BREAKDOWN (MONTHLY BASE & ALLOWANCE CORES)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">Basic Salary (*)</label>
                      <input
                        type="number"
                        value={basic}
                        onChange={(e) => setBasic(Number(e.target.value))}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">HRA House rent</label>
                      <input
                        type="number"
                        value={hra}
                        onChange={(e) => setHra(Number(e.target.value))}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">da Dearness index</label>
                      <input
                        type="number"
                        value={da}
                        onChange={(e) => setDa(Number(e.target.value))}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">Conveyance / travel</label>
                      <input
                        type="number"
                        value={ta}
                        onChange={(e) => setTa(Number(e.target.value))}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">Medical allowance</label>
                      <input
                        type="number"
                        value={medical}
                        onChange={(e) => setMedical(Number(e.target.value))}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">Special / other</label>
                      <input
                        type="number"
                        value={special}
                        onChange={(e) => setSpecial(Number(e.target.value))}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section C: Deductions */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-1 border-b border-slate-100">
                    <DollarSign className="w-4 h-4 text-indigo-500" /> STANDARD REDUCTIONS (DEDUCTION CORES)
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">EPF (Provident Fund)</label>
                      <input
                        type="number"
                        value={pf}
                        onChange={(e) => setPf(Number(e.target.value))}
                        className="mt-1.5 w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-1.5 px-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">TDS Encoder Tax</label>
                      <input
                        type="number"
                        value={tds}
                        onChange={(e) => setTds(Number(e.target.value))}
                        className="mt-1.5 w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-1.5 px-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">ESI Insurance</label>
                      <input
                        type="number"
                        value={esi}
                        onChange={(e) => setEsi(Number(e.target.value))}
                        className="mt-1.5 w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-1.5 px-3 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation home pay Display */}
                <div className="bg-emerald-50/50 border border-emerald-100 p-4.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600 font-bold bg-white shadow-xs p-1 rounded-lg shrink-0 border border-emerald-100" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wide">Calculated Net Home Pay:</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Calculated as: Basic + Allowances - Standard Deductions.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-600 block">{formatCurrency(calculatedNet)} / Mo</span>
                  </div>
                </div>

                {/* Submits */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsOpenModal(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5"
                  >
                    Confirm & Save Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
