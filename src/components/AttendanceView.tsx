import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Briefcase,
  XCircle,
  HelpCircle
} from "lucide-react";
import { Employee, Department, AttendanceRecord, AttendanceStatus, CharacterAdvice } from "../types";

interface AttendanceViewProps {
  employees: Employee[];
  departments: Department[];
  attendance: AttendanceRecord[];
  characterAdvice: CharacterAdvice;
  onUpdateAttendance: (date: string, empId: string, status: AttendanceStatus) => void;
}

export default function AttendanceView({
  employees,
  departments,
  attendance,
  characterAdvice,
  onUpdateAttendance
}: AttendanceViewProps) {
  const [selectedDate, setSelectedDate] = useState("2026-06-15");
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  // Format date helper to show something pretty in input
  const handlePrevDate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleSetToday = () => {
    setSelectedDate("2026-06-15"); // Keeps mock session consistent
  };

  // Calculations for current date
  const employeesCount = employees.length;
  const recordsForDate = attendance.filter(r => r.date === selectedDate);
  const markedCount = recordsForDate.length;
  const unmarkedCount = employeesCount - markedCount;

  const presentCount = recordsForDate.filter(r => r.status === "Present").length;
  const halfDayCount = recordsForDate.filter(r => r.status === "Half Day").length;
  const paidLeaveCount = recordsForDate.filter(r => r.status === "Paid Leave").length;
  const absentCount = recordsForDate.filter(r => r.status === "Absent").length;

  const presentPercent = employeesCount > 0 ? Math.round((presentCount / employeesCount) * 100) : 0;
  const halfDayPercent = employeesCount > 0 ? Math.round((halfDayCount / employeesCount) * 100) : 0;
  const paidLeavePercent = employeesCount > 0 ? Math.round((paidLeaveCount / employeesCount) * 100) : 0;
  const absentPercent = employeesCount > 0 ? Math.round((absentCount / employeesCount) * 100) : 0;

  // Average presence rate (Present is 100%, Half Day is 50%, Paid Leave is 100% as credited paid work as per Anya screenshot, Absent is 0%)
  const presenceWeight = presentCount + (halfDayCount * 0.5) + paidLeaveCount;
  const presenceRate = employeesCount > 0 ? Math.round((presenceWeight / employeesCount) * 100) : 0;

  // Filter roster
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                          emp.email.toLowerCase().includes(search.toLowerCase()) ||
                          emp.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === "all" || emp.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Daily Shift Roster Register</h2>
          <p className="text-slate-500 text-xs">Track operational on-site staff attendance, approve leaves, and insert timing details.</p>
        </div>
        
        {/* Date picking Widget */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 p-1.5 rounded-xl shadow-xs self-start sm:self-center font-mono text-xs">
          <button onClick={handlePrevDate} className="p-1 px-2.5 bg-slate-50 border border-slate-150 rounded-lg hover:bg-slate-100 transition text-slate-600">
            &lt;
          </button>
          <div className="flex items-center gap-2 px-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none font-semibold text-slate-700 cursor-pointer text-xs"
            />
          </div>
          <button onClick={handleNextDate} className="p-1 px-2.5 bg-slate-50 border border-slate-150 rounded-lg hover:bg-slate-100 transition text-slate-600">
            &gt;
          </button>
          <button onClick={handleSetToday} className="p-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition font-medium text-[11px] uppercase">
            Today
          </button>
        </div>
      </div>

      {/* Advice character dialogue */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex gap-4 items-center">
        <div className="text-3xl p-2 bg-slate-800/80 rounded-xl border border-slate-705 shrink-0">
          {characterAdvice.avatar}
        </div>
        <div>
          <h4 className="text-xs uppercase font-mono tracking-widest text-indigo-400">
            {characterAdvice.name} SHIFT ADVICE
          </h4>
          <p className="mt-1 text-slate-300 text-xs leading-relaxed font-sans">
            &ldquo;{characterAdvice.attendance}&rdquo;
          </p>
        </div>
      </div>

      {/* Performance Analytics & Breakdowns split view (from design image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Workforce Presence Ratio (Violet circle) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 text-white rounded-3xl p-7 shadow-xl border border-indigo-400/20 flex flex-col justify-between min-h-[300px]">
          <div>
            <span className="text-[10px] font-bold font-mono tracking-wider bg-white/10 py-1 px-2.5 rounded-full uppercase">PERFORMANCE ANALYTICS</span>
            <h3 className="text-lg font-bold tracking-tight mt-3">Workforce Presence Ratio</h3>
            <p className="text-xs text-indigo-100/80 mt-1 lines-relaxed">
              Currently compiling statistics for the date <span className="font-bold underline">{selectedDate}</span>. Leaves are recorded as credited paid work.
            </p>
          </div>

          {/* Large circular progress */}
          <div className="my-6 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-indigo-400/30 flex flex-col items-center justify-center relative shadow-inner bg-indigo-800/20">
              {/* Spinning/progress visual indicator border */}
              <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-indigo-200/40 border-b-indigo-200/20 border-l-transparent animate-spin-slow"></div>
              <span className="text-2xl font-black text-white">{presenceRate}%</span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-indigo-200">AVG RATE</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-center text-[10px] text-indigo-200 uppercase font-mono tracking-wider">
            Marked: <span className="text-white font-bold">{markedCount}</span> / {employeesCount} • Unmarked: <span className="text-white font-bold">{unmarkedCount}</span> personnel profiles.
          </div>
        </div>

        {/* Right Card: Attendance Allocation Breakdowns */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-7 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Attendance Allocation Breakdowns</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Presents, leaves and absent profiles. Unmarked members default to &ldquo;Present&rdquo; once posted.
            </p>

            <div className="space-y-4 mt-6">
              {/* Present */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Present ({presentCount})</span>
                  <span className="text-slate-500">{presentPercent}%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${presentPercent}%` }}></div>
                </div>
              </div>

              {/* Half Day */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Half Day ({halfDayCount})</span>
                  <span className="text-slate-500">{halfDayPercent}%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${halfDayPercent}%` }}></div>
                </div>
              </div>

              {/* Paid Leave */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Paid Leave ({paidLeaveCount})</span>
                  <span className="text-slate-500">{paidLeavePercent}%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${paidLeavePercent}%` }}></div>
                </div>
              </div>

              {/* Absent */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span> Absent ({absentCount})</span>
                  <span className="text-slate-500">{absentPercent}%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${absentPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-[10px] text-amber-600 font-bold tracking-widest font-mono uppercase text-center mt-4">
            ⭐ INTERACTIVE DAILY REGISTER LOG SYSTEM - MARKS AUTO-SAVE LOCALLY INSTANTLY.
          </div>
        </div>
      </div>

      {/* Roster Table List */}
      <div className="space-y-4">
        {/* Search & filters for table */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team register..."
              className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-2 rounded-xl border border-slate-200/80 text-xs text-slate-600 w-full md:w-auto justify-end">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="all">Filter by Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Attendance Entries Grid/Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  <th className="p-4 font-bold">Personnel Profile (Employee)</th>
                  <th className="p-4 font-bold">Department & Role Placement</th>
                  <th className="p-4 font-bold text-center">Status Marker Actions</th>
                  <th className="p-4 font-bold text-center">Current Status Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#334155] text-xs">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => {
                    // Find actual status for current day
                    const currentRecord = attendance.find(r => r.date === selectedDate && r.employeeId === emp.id);
                    const activeStatus = currentRecord ? currentRecord.status : null;
                    const deptName = departments.find(d => d.id === emp.departmentId)?.name || "Default Dept";

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex gap-2.5 items-center">
                            <div className="w-8.5 h-8.5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase border border-slate-200/50">
                              {emp.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block text-xs">{emp.name}</span>
                              <span className="text-[10px] text-slate-400 block font-mono uppercase mt-0.5">{emp.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-700 font-medium">{deptName}</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{emp.role}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => onUpdateAttendance(selectedDate, emp.id, "Present")}
                              className={`py-1.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                                activeStatus === "Present" 
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-xs shadow-emerald-500/10" 
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Present
                            </button>
                            <button
                              onClick={() => onUpdateAttendance(selectedDate, emp.id, "Half Day")}
                              className={`py-1.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                                activeStatus === "Half Day" 
                                  ? "bg-blue-500 border-blue-500 text-white shadow-xs shadow-blue-500/10" 
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5 shrink-0" /> Half Day
                            </button>
                            <button
                              onClick={() => onUpdateAttendance(selectedDate, emp.id, "Paid Leave")}
                              className={`py-1.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                                activeStatus === "Paid Leave" 
                                  ? "bg-amber-500 border-amber-500 text-white shadow-xs shadow-amber-500/10" 
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Paid Leave
                            </button>
                            <button
                              onClick={() => onUpdateAttendance(selectedDate, emp.id, "Absent")}
                              className={`py-1.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                                activeStatus === "Absent" 
                                  ? "bg-rose-500 border-rose-500 text-white shadow-xs shadow-rose-500/10" 
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5 shrink-0" /> Absent
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {activeStatus ? (
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider ${
                              activeStatus === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              activeStatus === "Half Day" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                              activeStatus === "Paid Leave" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                              "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {activeStatus}
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                              Unmarked
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400 bg-slate-50/20">
                      <p className="text-xs">No active employee profiles matching criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
