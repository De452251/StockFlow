import { Godown, Department, Employee, StockItem, AttendanceRecord } from "./types";

export const DEFAULT_GODOWNS: Godown[] = [
  { id: "g1", name: "West Coast Supply Hub", address: "101 Terminal Blvd, Dock 4", maxCapacity: 10000 },
  { id: "g2", name: "Metro Express Depot", address: "Sec 12, Industrial Area, Noida", maxCapacity: 5000 },
  { id: "g3", name: "South Gate Logistics Yard", address: "Plot 42, Port Ring Road, Chennai", maxCapacity: 7500 }
];

export const DEFAULT_DEPARTMENTS: Department[] = [
  { id: "d1", name: "Sales & Regional Distribution", code: "SRD", description: "Handles client stock deliveries, sales channels, and customer pipelines." },
  { id: "d2", name: "Quality Assurance & Inspection", code: "QAI", description: "Verifies stock standards, certification checkups, and safety protocols." },
  { id: "d3", name: "Core Operations & Tech", code: "COT", description: "Manages backend inventory machinery, scanners, and tech ledgers." }
];

export const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: "emp1",
    name: "Devesh Uniyal",
    email: "devesh313uniyal@gmail.com",
    phone: "919830775555",
    role: "Lead Stock Manager",
    departmentId: "d3",
    joiningDate: "2026-01-10",
    ctcBreakdown: { basic: 45000, hra: 15000, da: 8000, ta: 4000, medical: 2000, special: 6000 },
    deductions: { pf: 5400, esi: 350, tds: 2500 }
  },
  {
    id: "emp2",
    name: "Aarav Sharma",
    email: "aarav_sharma@company.com",
    phone: "919876543210",
    role: "Quality Inspector",
    departmentId: "d2",
    joiningDate: "2026-03-15",
    ctcBreakdown: { basic: 30000, hra: 10000, da: 5000, ta: 3000, medical: 1500, special: 4500 },
    deductions: { pf: 3600, esi: 250, tds: 1200 }
  },
  {
    id: "emp3",
    name: "Sophia Rodriguez",
    email: "sophia.r@company.com",
    phone: "919012345678",
    role: "Sales Logistics Coordinator",
    departmentId: "d1",
    joiningDate: "2026-04-01",
    ctcBreakdown: { basic: 32000, hra: 12000, da: 6000, ta: 5000, medical: 1500, special: 5000 },
    deductions: { pf: 3840, esi: 280, tds: 1500 }
  }
];

export const DEFAULT_STOCK_ITEMS: StockItem[] = [
  {
    id: "item1",
    name: "Insulated Recycled Copper Coil (Heavy duty)",
    barcode: "CU-COIL-78",
    hsn: "8473.30",
    category: "Electronics/Metal",
    openingStock: 2435,
    uom: "Pcs",
    buyingCost: 120,
    sellingPrice: 185,
    alertThreshold: 500,
    godownId: "g1",
    departmentId: "d3"
  },
  {
    id: "item2",
    name: "Silicon Semi-conductor Boards V4",
    barcode: "SEMI-V4-99",
    hsn: "8542.31",
    category: "Electronics",
    openingStock: 4500,
    uom: "Units",
    buyingCost: 450,
    sellingPrice: 720,
    alertThreshold: 1000,
    godownId: "g1",
    departmentId: "d3"
  },
  {
    id: "item3",
    name: "Aluminium Support Struts L-300",
    barcode: "ALU-STRUT-30",
    hsn: "7604.29",
    category: "Structural Support",
    openingStock: 120,
    uom: "Bars",
    buyingCost: 25,
    sellingPrice: 48,
    alertThreshold: 300,
    godownId: "g2",
    departmentId: "d1"
  }
];

export const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
  { date: "2026-06-15", employeeId: "emp1", status: "Present" },
  { date: "2026-06-15", employeeId: "emp2", status: "Half Day" },
  { date: "2026-06-15", employeeId: "emp3", status: "Paid Leave" }
];
