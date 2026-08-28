import React from 'react';
import { ShieldAlert, ShieldCheck, User, LogOut, Terminal, Users, Eye } from 'lucide-react';

export default function Navbar({ user, onLogout, activeTab, setActiveTab }) {
  return (
    <header className="bg-[#0F172A] border-b border-slate-800 sticky top-0 z-50 shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-[#0A0E1A] rounded-[10px] flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-wider text-white font-mono">ZETP</h1>
              <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                v1.0 Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Zero Email Threat Portal</p>
          </div>
        </div>

        {/* View Mode Switcher (Employee View vs Investigator View) */}
        <div className="flex items-center bg-[#1E293B] p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setActiveTab('investigator')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'investigator'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Investigator Workbench</span>
          </button>
          
          <button
            onClick={() => setActiveTab('employee')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'employee'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Employee Safety View</span>
          </button>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <div className="h-7 w-7 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-200">{user.full_name}</p>
                <p className="text-[10px] text-cyan-400 font-mono capitalize">{user.role}</p>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-slate-700/50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-mono">Demo Session</span>
          )}
        </div>

      </div>
    </header>
  );
}
