import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Shield, Zap, Info, AlertCircle, Fingerprint, User } from "lucide-react";

// Google Vector Brand Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-2.6-2.43-4.53-5.01-4.53z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

// Apple Vector Brand Icon
const AppleIcon = () => (
  <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.51 12.06 1.005 1.45 2.176 3.074 3.743 3.014 1.515-.063 2.083-.975 3.912-.975s2.34.975 3.928.94c1.614-.027 2.65-1.47 3.633-2.906 1.139-1.664 1.61-3.275 1.64-3.354-.03-.016-3.141-1.2-3.178-4.773-.03-2.984 2.45-4.417 2.56-4.484-1.393-2.033-3.541-2.261-4.291-2.316-1.92-.153-3.61 1.077-4.976 1.077zm3.17-4.498c.813-.99 1.362-2.373 1.21-3.748-1.18.047-2.613.784-3.456 1.768-.748.868-1.402 2.274-1.226 3.626 1.312.102 2.658-.654 3.472-1.646z" />
  </svg>
);

// Reusable logo component
export function LogoWidget({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const containerClass = size === "sm" 
    ? "w-8 h-8 rounded-lg" 
    : size === "lg" 
      ? "w-12 h-12 rounded-2xl" 
      : "w-10 h-10 rounded-xl";
  
  const iconClass = size === "sm" ? "w-4.5 h-4.5" : size === "lg" ? "w-6 h-6" : "w-5.5 h-5.5";

  return (
    <div className={`${containerClass} bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#6366f1] flex items-center justify-center shadow-lg shadow-blue-500/10 border border-blue-400/20`}>
      <svg className={`${iconClass} text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(255,255,255,0.08)" stroke="currentColor" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}

interface LoginViewProps {
  onLogin: (email: string) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [appleId, setAppleId] = useState("userj3c3@icloud.com");
  const [tab, setTab] = useState<"email" | "google" | "apple">("email");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your enterprise email.");
      return;
    }
    // EXACT video logic: Password must be at least 5 characters long
    if (password.length < 5) {
      setError("Password must be at least 5-characters long.");
      return;
    }
    setError("");
    onLogin(email);
  };

  const handleGoogleSubmit = () => {
    setError("");
    onLogin("devesh313uniyal@gmail.com");
  };

  const handleAppleSubmit = () => {
    setError("");
    onLogin(appleId || "userj3c3@icloud.com");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col md:flex-row font-sans">
      {/* Left Column (Hero Section) */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-900 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-950/30 via-transparent to-transparent">
        {/* Top brand */}
        <div className="flex items-center gap-3">
          <LogoWidget />
          <div>
            <h1 className="text-xl font-bold tracking-wider text-slate-100 flex items-center gap-1.5 font-sans">
              STOCKFLOW
            </h1>
            <p className="text-[10px] tracking-widest text-[#4f46e5] font-mono font-semibold uppercase">
              ENTERPRISE STOCK & STAFF LEDGER
            </p>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="my-12 md:my-auto max-w-lg">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
          >
            A single platform for decentralized business logistics.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-sm text-slate-400 leading-relaxed font-sans"
          >
            Manage complete multiversal warehouses, record live stock transfers,
            perform advanced components allocation, trace daily staff clock-ins and
            calculate accurate ledger-backed payroll.
          </motion.p>
        </div>

        {/* Bottom meta metrics */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-900/60 font-mono text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">SECURITY SYSTEM</p>
              <p className="text-slate-300 font-semibold text-xs">AES-256 Decrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">STORAGE MODE</p>
              <p className="text-slate-300 font-semibold text-xs">High Speed Session</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Dynamic Credentials Card Box) */}
      <div className="w-full md:w-1/2 p-6 md:p-16 flex items-center justify-center bg-[#070b19]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-slate-900/40 border border-slate-805/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black tracking-tight text-white font-sans">
              Ready to Start Your Shift?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Let us know who's clocking in today so we can pull up your workspace.
            </p>
          </div>

          {/* Video exact top-level Tab Switchers */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 gap-1.5">
            <button
              onClick={() => {
                setTab("email");
                setError("");
              }}
              className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all duration-200 ${
                tab === "email" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In with Email
            </button>
            <button
              onClick={() => {
                setTab("google");
                setError("");
              }}
              className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all duration-200 ${
                tab === "google" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sync via Google
            </button>
            <button
              onClick={() => {
                setTab("apple");
                setError("");
              }}
              className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all duration-200 ${
                tab === "apple" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Use Apple ID
            </button>
          </div>

          {/* Tab 1: Email Form */}
          {tab === "email" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">
                  YOUR ENTERPRISE EMAIL
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#0b1329] border border-slate-805 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1.5 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">
                  SECURITY PASSWORD
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0b1329] border border-slate-805 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1.5 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Exact Red Alert Bubble matching 00:29 video trigger error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/20 text-red-400 p-2.5 rounded-xl text-xs font-semibold mt-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span className="font-mono text-[10px] uppercase leading-none tracking-tight">
                    {error}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 mt-5 uppercase"
              >
                Enter Workspace <span className="text-indigo-200">→</span>
              </button>
            </form>
          )}

          {/* Tab 2: Sync via Google */}
          {tab === "google" && (
            <div className="space-y-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Great for managers who want to sync using secure Google Workspace.
              </p>

              {/* Integration Account visual block (from video) */}
              <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 flex gap-3.5 items-center relative overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-slate-800/80 text-white flex items-center justify-center text-xs font-bold border border-slate-700 shadow-inner relative shrink-0">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0b1329]"></span>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono tracking-wider font-extrabold text-indigo-400 leading-none">
                    DEVESH / GOOGLE ACCOUNT
                  </div>
                  <div className="text-xs font-bold text-slate-205 truncate mt-1">
                    devesh313uniyal@gmail.com
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5 leading-normal">
                    You've integrated system with Google Workspace APIs. Welcome back!
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoogleSubmit}
                className="w-full bg-[#1e293b] hover:bg-slate-700 text-white rounded-xl py-3 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2.5 border border-slate-800 uppercase"
              >
                <GoogleIcon /> Authenticate via Google
              </button>
            </div>
          )}

          {/* Tab 3: Use Apple ID */}
          {tab === "apple" && (
            <form onSubmit={(e) => { e.preventDefault(); handleAppleSubmit(); }} className="space-y-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Quick biometric secure login for managers active on Apple or iOS devices.
              </p>

              {/* Apple ID input field */}
              <div>
                <label className="block text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">
                  APPLE ID
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Fingerprint className="w-4 h-4 text-[#a78bfa]" />
                  </span>
                  <input
                    type="text"
                    value={appleId}
                    onChange={(e) => setAppleId(e.target.value)}
                    placeholder="user@icloud.com"
                    className="w-full bg-[#0b1329] border border-slate-805 rounded-xl py-3 pl-11 pr-4 text-xs font-mono text-[#a78bfa] placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-slate-900 border border-slate-800 text-white rounded-xl py-3 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 uppercase"
              >
                <AppleIcon /> Sign In with Apple
              </button>
            </form>
          )}

          {/* Bottom active state label log (from video) */}
          <div className="pt-6 border-t border-slate-900 flex flex-col gap-1.5 font-sans">
            <h4 className="text-[10px] font-mono tracking-wider font-bold text-slate-450 uppercase">
              RECORDED ACTIVE SESSION ACCESS
            </h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              Select an active user session state stored and managed locally
            </p>
            <div className="mt-2.5 bg-slate-950/60 border border-slate-900 rounded-2xl p-3 flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-650 animate-pulse"></span>
                <span>No active corporate session discovered on browser cache.</span>
              </div>
              <span className="font-mono font-bold uppercase text-[#6366f1] text-[9px] bg-indigo-950/45 px-2 py-0.5 rounded-lg border border-indigo-900/40 shrink-0">
                IDLE
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
