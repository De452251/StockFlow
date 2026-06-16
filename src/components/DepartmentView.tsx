import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Plus, 
  Layers, 
  Briefcase, 
  X, 
  Users, 
  FileText 
} from "lucide-react";
import { Department, Employee, CharacterAdvice } from "../types";

interface DepartmentViewProps {
  departments: Department[];
  employees: Employee[];
  characterAdvice: CharacterAdvice;
  onAddDepartment: (dept: Department) => void;
}

export default function DepartmentView({
  departments,
  employees,
  characterAdvice,
  onAddDepartment
}: DepartmentViewProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const handleOpenAdd = () => {
    setName("");
    setCode("");
    setDescription("");
    setIsOpenModal(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    const data: Department = {
      id: `d_${Date.now()}`,
      name,
      code: code || name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 4),
      description
    };

    onAddDepartment(data);
    setIsOpenModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Org Department Structures</h2>
          <p className="text-slate-500 text-xs">Build unlimited custom departments, manage team allocations, budget baseline payroll costs, and check operational balances.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 px-4 text-xs font-semibold shadow-md shadow-indigo-600/10 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Department
        </button>
      </div>

      {/* Character advice dialogue */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex gap-4 items-center">
        <div className="text-3xl p-2 bg-slate-800/80 rounded-xl border border-slate-705 shrink-0">
          {characterAdvice.avatar}
        </div>
        <div>
          <h4 className="text-xs uppercase font-mono tracking-widest text-indigo-400">
            {characterAdvice.name} ORG STRATEGY
          </h4>
          <p className="mt-1 text-slate-300 text-xs leading-relaxed font-sans">
            &ldquo;{characterAdvice.department}&rdquo;
          </p>
        </div>
      </div>

      {/* Grid of registered departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          // Count headcount
          const members = employees.filter(emp => emp.departmentId === dept.id);
          const totalSalaries = members.reduce((acc, m) => acc + m.ctcBreakdown.basic, 0);

          return (
            <motion.div
              layout
              key={dept.id}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-100/50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase py-1 px-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
                    {dept.code}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 tracking-tight">{dept.name}</h3>
                
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-sans">
                  {dept.description}
                </p>
              </div>

              {/* Stats line */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">{members.length} team members</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase block tracking-wider leading-none">BASE BUDGET</span>
                  <span className="font-bold text-slate-800">₹{totalSalaries.toLocaleString()}/mo</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal Popup creation */}
      <AnimatePresence>
        {isOpenModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md border border-slate-100 shadow-2xl overflow-hidden font-sans text-slate-705 p-6 space-y-4"
            >
              <div className="bg-[#4f46e5] text-white p-5 -m-6 mb-4 relative">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="absolute top-5 right-5 text-indigo-100"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-base font-bold tracking-tight">Register Corporate Department</h3>
                <p className="text-xs text-indigo-100 mt-1 lines-normal">
                  Configure department placements, roles, and manage inventory assignments dynamically.
                </p>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">DEPARTMENT NAME *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sales & Regional Distribution"
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">CODE SHORT-HAND (OPTIONAL)</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SRD, COT"
                    maxLength={5}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">DESCRIPTION / OPERATING FOCUS *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Talent acquisition and payroll tracking, system execution & technical support..."
                    rows={3}
                    className="mt-1.5 w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    required
                  />
                </div>

                {/* Submits */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsOpenModal(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-250 text-slate-600 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20"
                  >
                    Create Department
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
