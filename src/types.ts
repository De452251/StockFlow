export type AttendanceStatus = "Present" | "Half Day" | "Paid Leave" | "Absent";

export interface Godown {
  id: string;
  name: string;
  address: string;
  maxCapacity: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface CtcBreakdown {
  basic: number;
  hra: number;
  da: number;
  ta: number;
  medical: number;
  special: number;
}

export interface DeductionsBreakdown {
  pf: number;
  esi: number;
  tds: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  departmentId: string;
  joiningDate: string;
  ctcBreakdown: CtcBreakdown;
  deductions: DeductionsBreakdown;
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  employeeId: string;
  status: AttendanceStatus;
}

export interface StockItem {
  id: string;
  name: string;
  barcode: string;
  hsn: string;
  category: string;
  openingStock: number;
  uom: string;
  buyingCost: number;
  sellingPrice: number;
  alertThreshold: number;
  godownId: string;
  departmentId: string;
}

export interface PayrollRecord {
  id: string;
  month: string; // YYYY-MM
  employeeId: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  calculatedNetPay: number;
  status: "Pending" | "Paid";
}

export type ToneType = "Anya" | "Mac" | "Dexter" | "Sal";

export interface CharacterAdvice {
  avatar: string;
  name: string;
  title: string;
  hub: string;
  stock: string;
  ledger: string;
  attendance: string;
  payroll: string;
  warehouse: string;
  department: string;
}

export const CHARACTERS: Record<ToneType, CharacterAdvice> = {
  Anya: {
    avatar: "👩‍💼",
    name: "Anya (The Friendly Director)",
    title: "Creative Facilitator & Ops Coach",
    hub: "Good morning! Anya here. Welcome to our shared space! I'm absolutely delighted to look over things with you. Our operational footprint is doing beautifully.",
    stock: "Keep an eye on the low stock amber highlights. It's our job to make sure the team has everything they need before they start their day of work! Let me know if you need to adjust any minimum thresholds.",
    ledger: "The heart of StockFlow is its people! Creating a supportive workplace is how we achieve operations perfection. We should review basic pay structures regularly.",
    attendance: "Remember to mark leaves with warm respect—some workers have families and personal sick days to handle! Keep our roster supportive.",
    payroll: "Disbursing wages is our chance to thank the team for their dedication! Make sure to process salary adjustments with extreme care and warmth.",
    warehouse: "Our storage yards are where our physical materials rest. Keep the bays safe and clean so our loaders don't experience any issues on the floor.",
    department: "Dividing ourselves into supportive departments allows team members to master distinct aspects of our enterprise. Let me know if you need to optimize anyone's desk assignment!"
  },
  Mac: {
    avatar: "👨‍💻",
    name: "Mac (The Operations Chief)",
    title: "Pragmatic CTO & Systems Architect",
    hub: "System logs check out. Memory utilization at 4%. Ready to commit ledger transitions to disk. Let's make sure the entry schemas are clean today.",
    stock: "Inventory is an optimization game of buffering. Run lean but never hit a pipeline stall. Check those HSN mappings to ensure accurate tracking.",
    ledger: "Personnel details should reflect clean, normalized constraints. Each ID must be mapped to exactly one department entry to prevent joins from breaking.",
    attendance: "Raw data shows attendance logs are 100% synchronized. Unmarked records default to present to speed up operations. Optimize your roster inputs.",
    payroll: "Calculate net pay = basic + allowances - deductions. Keep formulas deterministic to avoid manual override edge cases. Verify variables before commit.",
    warehouse: "Capacity constraints are real. Don't let total inventory volume violate maximum warehouse volume ceilings. Safety index is paramount.",
    department: "Silos are bad, but separation of concerns is good. Keep department structures balanced to ensure optimized communications throughput."
  },
  Dexter: {
    avatar: "👨‍🔬",
    name: "Dexter (The Auditor)",
    title: "Lead Compliance & Risk Controller",
    hub: "Status report: All assets verified. Daily checks are active. We'll be closely reviewing today's stock transfers and wage payouts for alignment.",
    stock: "Under-stocking creates critical project lag, while over-stocking locks up valuable capital. Keep the alert threshold higher than standard lead time demand.",
    ledger: "Each payroll and CTC node must have precise tax deduction details. Unverified roles are a material regulatory risk. Input each record carefully.",
    attendance: "Cross-referencing hours is critical. Verify marked paid leaves are back-supported by legitimate, approved operational leave logs.",
    payroll: "TDS, PF, and ESI are legal requirements. Check that calculated CTC breakdown adds up precisely, down to the last integer amount.",
    warehouse: "Physical safety regulations are non-negotiable. Inspect godown coordinates and storage classifications quarterly under ISO guidelines.",
    department: "An organized ledger has verified corporate structural trees. Do not create placeholder departments without budget authorization."
  },
  Sal: {
    avatar: "😎",
    name: "Sal (The Dealmaker)",
    title: "Global Supply Chain Optimizer",
    hub: "Rise and grind! The market is hot today. Let's shift some stock, clear out slow items, and keep our capital flowing. What are we moving today?",
    stock: "Margins are won in buying cheap and selling at a premium. Watch the delta between buy cost and sale price. That's where your real profits hide!",
    ledger: "Hire the best, incentivize them with high commissions, and let's expand! A bigger workforce means we can scale up our logisitic volumes.",
    attendance: "Worry less about precise minutes, and more about output metrics! Make sure the active team has high energy and is ready to crush goals.",
    payroll: "Commission and bonuses keep players in the game. Make sure our key departments are rewarded well to maximize supply chain velocities.",
    warehouse: "Empty space is wasted money! We want high inventory turnover rates. Fill up those godowns and empty them out quickly with big sales orders.",
    department: "Each department should run like a high-profit startup inside our hub. Align team leaders with bottom-line revenue goals!"
  }
};
