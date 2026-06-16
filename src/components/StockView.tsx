import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Tag, 
  AlertTriangle, 
  Save, 
  X, 
  Barcode, 
  CheckCircle,
  Building,
  Briefcase
} from "lucide-react";
import { Godown, Department, StockItem, CharacterAdvice } from "../types";

interface StockViewProps {
  stockItems: StockItem[];
  godowns: Godown[];
  departments: Department[];
  characterAdvice: CharacterAdvice;
  currency: string;
  onAddStock: (item: StockItem) => void;
  onEditStock: (id: string, updated: StockItem) => void;
  onDeleteStock: (id: string) => void;
}

export default function StockView({
  stockItems,
  godowns,
  departments,
  characterAdvice,
  currency,
  onAddStock,
  onEditStock,
  onDeleteStock
}: StockViewProps) {
  const [search, setSearch] = useState("");
  const [selectedGodownFilter, setSelectedGodownFilter] = useState("all");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [hsn, setHsn] = useState("");
  const [category, setCategory] = useState("");
  const [openingStock, setOpeningStock] = useState<number>(0);
  const [uom, setUom] = useState("Pcs");
  const [buyingCost, setBuyingCost] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [alertThreshold, setAlertThreshold] = useState<number>(100);
  const [godownId, setGodownId] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const formatCurrency = (val: number) => {
    const symbol = currency.includes("INR") ? "₹" : currency.includes("USD") ? "$" : "€";
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const handleOpenAddModal = () => {
    setName("");
    setBarcode(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setHsn("8544.11");
    setCategory("Electronics");
    setOpeningStock(100);
    setUom("Pcs");
    setBuyingCost(10);
    setSellingPrice(15);
    setAlertThreshold(20);
    setGodownId(godowns[0]?.id || "");
    setDepartmentId(departments[0]?.id || "");
    setEditingItem(null);
    setIsOpenAddModal(true);
  };

  const handleOpenEditModal = (item: StockItem) => {
    setEditingItem(item);
    setName(item.name);
    setBarcode(item.barcode);
    setHsn(item.hsn);
    setCategory(item.category);
    setOpeningStock(item.openingStock);
    setUom(item.uom);
    setBuyingCost(item.buyingCost);
    setSellingPrice(item.sellingPrice);
    setAlertThreshold(item.alertThreshold);
    setGodownId(item.godownId);
    setDepartmentId(item.departmentId);
    setIsOpenAddModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;

    const data: StockItem = {
      id: editingItem ? editingItem.id : `item_${Date.now()}`,
      name,
      barcode,
      hsn,
      category,
      openingStock: Number(openingStock),
      uom,
      buyingCost: Number(buyingCost),
      sellingPrice: Number(sellingPrice),
      alertThreshold: Number(alertThreshold),
      godownId,
      departmentId
    };

    if (editingItem) {
      onEditStock(editingItem.id, data);
    } else {
      onAddStock(data);
    }
    setIsOpenAddModal(false);
  };

  // Filter logic
  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.barcode.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase()) ||
                          item.hsn.toLowerCase().includes(search.toLowerCase());
    const matchesGodown = selectedGodownFilter === "all" || item.godownId === selectedGodownFilter;
    const matchesDept = selectedDeptFilter === "all" || item.departmentId === selectedDeptFilter;
    return matchesSearch && matchesGodown && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Inventory & Stock Tracking Ledgers</h2>
          <p className="text-slate-500 text-xs">Real-time tracking of available balances, department allocations, safety thresholds, and structural assets with no subscription paywalls.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-2.5 px-4 text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Stock
        </button>
      </div>

      {/* Anya / Character Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex gap-4 items-center">
        <div className="text-3xl p-2 bg-slate-800/80 rounded-xl border border-slate-705 relative shrink-0">
          {characterAdvice.avatar}
        </div>
        <div>
          <h4 className="text-xs uppercase font-mono tracking-widest text-indigo-400">
            {characterAdvice.name} STOCK REGISTER SUMMARY
          </h4>
          <p className="mt-1 text-slate-300 text-xs leading-relaxed font-sans">
            &ldquo;{characterAdvice.stock}&rdquo;
          </p>
        </div>
      </div>

      {/* Filters and Inputs Controls */}
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
            placeholder="Search stock item catalog by name, sku, category or details..."
            className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-sans"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto items-center justify-end">
          <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-2 rounded-xl border border-slate-200/80 text-xs text-slate-600 font-sans w-full sm:w-auto">
            <Building className="w-4 h-4 text-slate-400" />
            <select
              value={selectedGodownFilter}
              onChange={(e) => setSelectedGodownFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-medium cursor-pointer"
            >
              <option value="all">All Warehouses</option>
              {godowns.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-2 rounded-xl border border-slate-200/80 text-xs text-slate-600 font-sans w-full sm:w-auto">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-medium cursor-pointer"
            >
              <option value="all">All Org Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                <th className="p-4 font-bold">Stock Specification & SKU</th>
                <th className="p-4 font-bold text-center">Physical Total</th>
                <th className="p-4 font-bold text-center">Allocated Stock</th>
                <th className="p-4 font-bold text-center">Balance Stock</th>
                <th className="p-4 font-bold">Org Assignment Location</th>
                <th className="p-4 font-bold text-right">Prices (Buy / Sell)</th>
                <th className="p-4 font-bold text-center">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isLow = item.openingStock < item.alertThreshold;
                  const itemGodown = godowns.find(g => g.id === item.godownId)?.name || "Default Godown";
                  const itemDept = departments.find(d => d.id === item.departmentId)?.name || "HQ Administration";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg shrink-0 flex items-center justify-center ${
                            isLow ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
                          }`}>
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block text-xs leading-normal">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5 uppercase">
                              <Barcode className="w-3 h-3 text-slate-300" /> BARCODE: {item.barcode} | HSN: {item.hsn}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center font-bold">
                        <span className={isLow ? "text-rose-500 font-bold" : "text-slate-800"}>
                          {item.openingStock.toLocaleString()} {item.uom}
                        </span>
                      </td>
                      <td className="p-4 text-center text-slate-500 font-mono">
                        {Math.round(item.openingStock * 0.15).toLocaleString()} {item.uom}
                      </td>
                      <td className="p-4 text-center text-slate-800 font-semibold font-mono">
                        {Math.round(item.openingStock * 0.85).toLocaleString()} {item.uom}
                      </td>
                      <td className="p-4 space-y-0.5">
                        <span className="text-slate-700 font-medium block text-[11px]">{itemGodown}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block tracking-wider">{itemDept}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-slate-500 block text-[10px] font-mono">Buy: {formatCurrency(item.buyingCost)}</span>
                        <span className="text-indigo-600 font-bold block text-xs font-mono mt-0.5">Sell: {formatCurrency(item.sellingPrice)}</span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStock(item.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 bg-slate-50/20">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Tag className="w-10 h-10 text-slate-300" />
                      <p className="text-xs font-medium text-slate-600">No inventory stock matchers found.</p>
                      <p className="text-[10px] text-slate-400 max-w-xs">Try resetting the filters or register a new SKU item to start.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal popup "Register Warehouse Stock Item" */}
      <AnimatePresence>
        {isOpenAddModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-2xl border border-slate-100 shadow-2xl overflow-hidden font-sans my-8"
            >
              <div className="bg-[#5046e6] text-white p-6 relative">
                <button
                  type="button"
                  onClick={() => setIsOpenAddModal(false)}
                  className="absolute top-5 right-5 text-indigo-100 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold tracking-tight">
                  {editingItem ? "Update Warehouse Stock Item" : "Register Warehouse Stock Item"}
                </h3>
                <p className="text-xs text-indigo-100/90 mt-1 leading-normal">
                  Enter details of incoming stock floor. Free of use with unlimited capacity pools.
                </p>
              </div>

              <form onSubmit={handleSaveItem} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">ITEM TITLE / NAME *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Insulated Recycled Copper Coil (Heavy-duty)"
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* SKU Barcode */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">STOCK BARCODE REFERENCE</label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="e.g. SKU-1203"
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* HSN CODE */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">HSN / SAC CODE *</label>
                    <input
                      type="text"
                      value={hsn}
                      onChange={(e) => setHsn(e.target.value)}
                      placeholder="e.g. 8473.30"
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">CATEGORY *</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Electronics, Metals"
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Opening stock */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">OPENING STOCK</label>
                    <input
                      type="number"
                      value={openingStock}
                      onChange={(e) => setOpeningStock(Number(e.target.value))}
                      placeholder="Quantity"
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Unit of measure */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">UNIT OF MEASURE</label>
                    <input
                      type="text"
                      value={uom}
                      onChange={(e) => setUom(e.target.value)}
                      placeholder="e.g. Pcs, Liters, Units"
                      className="mt-1.5 w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Alert threshold */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">ALERT THRESHOLD</label>
                    <input
                      type="number"
                      value={alertThreshold}
                      onChange={(e) => setAlertThreshold(Number(e.target.value))}
                      placeholder="e.g. 50"
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Buying Cost */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">BUYING COST ({currency.includes("INR") ? "₹" : "$"})</label>
                    <input
                      type="number"
                      value={buyingCost}
                      onChange={(e) => setBuyingCost(Number(e.target.value))}
                      placeholder="Rate"
                      className="mt-1.5 w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">SELLING PRICE ({currency.includes("INR") ? "₹" : "$"})</label>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      placeholder="Rate"
                      className="mt-1.5 w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Storage Warehouse */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">STORAGE WAREHOUSE GODOWN</label>
                    <select
                      value={godownId}
                      onChange={(e) => setGodownId(e.target.value)}
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                    >
                      {godowns.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Department Owner */}
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">OWNER DEPT DEPARTMENT</label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsOpenAddModal(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Plus className="w-4 h-4" /> Confirm and Create Now
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
