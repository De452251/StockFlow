import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Plus, 
  MapPin, 
  X, 
  Database, 
  TrendingUp, 
  Box, 
  Layers 
} from "lucide-react";
import { Godown, StockItem, CharacterAdvice } from "../types";

interface WarehouseViewProps {
  godowns: Godown[];
  stockItems: StockItem[];
  characterAdvice: CharacterAdvice;
  onAddGodown: (godown: Godown) => void;
}

export default function WarehouseView({
  godowns,
  stockItems,
  characterAdvice,
  onAddGodown
}: WarehouseViewProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [maxCapacity, setMaxCapacity] = useState<number>(10000);

  const handleOpenAdd = () => {
    setName("");
    setAddress("");
    setMaxCapacity(10000);
    setIsOpenModal(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    const data: Godown = {
      id: `g_${Date.now()}`,
      name,
      address,
      maxCapacity: Number(maxCapacity)
    };

    onAddGodown(data);
    setIsOpenModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Warehouse & Godown Registries</h2>
          <p className="text-slate-500 text-xs">Configure unlimited physical storage facilities to host item categories, allocate capacities, and monitor local asset valuations.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 px-4 text-xs font-semibold shadow-md shadow-indigo-600/10 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Godown
        </button>
      </div>

      {/* Anya character dialogue */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex gap-4 items-center">
        <div className="text-3xl p-2 bg-slate-800/80 rounded-xl border border-slate-705 shrink-0">
          {characterAdvice.avatar}
        </div>
        <div>
          <h4 className="text-xs uppercase font-mono tracking-widest text-indigo-400">
            {characterAdvice.name} WAREHOUSE SUPPORT
          </h4>
          <p className="mt-1 text-slate-300 text-xs leading-relaxed font-sans">
            &ldquo;{characterAdvice.warehouse}&rdquo;
          </p>
        </div>
      </div>

      {/* Grid of registered warehouses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {godowns.map((g) => {
          // Calculate stats for this warehouse
          const itemsInGodown = stockItems.filter(item => item.godownId === g.id);
          const totalUnits = itemsInGodown.reduce((acc, item) => acc + item.openingStock, 0);
          const valuation = itemsInGodown.reduce((acc, item) => acc + (item.openingStock * item.buyingCost), 0);
          const capacityPercentage = Math.min(100, Math.round((totalUnits / g.maxCapacity) * 100));

          return (
            <motion.div
              layout
              key={g.id}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-100/50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase py-0.5 px-2 bg-slate-150 rounded-lg text-slate-500">
                    ID: {g.id.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 tracking-tight">{g.name}</h3>
                
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1 leading-normal">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-300" /> {g.address}
                </p>

                {/* Capacity slider representation */}
                <div className="space-y-1.5 mt-6">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                    <span>Capacity Allocated</span>
                    <span className="font-mono">{totalUnits.toLocaleString()} / {g.maxCapacity.toLocaleString()} ({capacityPercentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        capacityPercentage > 90 ? "bg-rose-500" : capacityPercentage > 70 ? "bg-amber-500" : "bg-emerald-500"
                      }`} 
                      style={{ width: `${capacityPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Stats line */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-normal">CATEGORIES</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{itemsInGodown.length} mapped SKUs</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-normal">VALUATION</p>
                  <p className="font-bold text-indigo-600 mt-0.5">₹{valuation.toLocaleString()}</p>
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
                <h3 className="text-base font-bold tracking-tight">Register Storage Godown</h3>
                <p className="text-xs text-indigo-100 mt-1 lines-normal">
                  Establish storage yards. Support unlimited physical warehouses without premium subscription.
                </p>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">GODOWN NAME *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. West Coast Supply Hub"
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">PHYSICAL LOCATION ADDRESS *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 104 Terminal Blvd, Deck 4"
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">MAX STORAGE UNIT CAPACITY</label>
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(Number(e.target.value))}
                    placeholder="Quantity Limit e.g. 10000"
                    className="mt-1.5 w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    required
                  />
                </div>

                {/* Confirmations */}
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
                    Confirm and Launch Location
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
