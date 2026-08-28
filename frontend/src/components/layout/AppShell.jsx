import React, { useState } from 'react';
import {
  Shield, LayoutDashboard, Mail, Cpu, Globe, Database, FileSearch,
  Search, Bell, Settings, User, Eye, Terminal, ChevronLeft, ChevronRight,
  Activity, ShieldCheck, FileText, Layers, Lock, LogOut, Mic, Sparkles
} from 'lucide-react';
import WebThreads from '../WebThreads';
import VoiceChatModal from '../voice/VoiceChatModal';

export default function AppShell({ activeModule, setActiveModule, viewMode, setViewMode, user, onLogout, scanResult, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const mainNavTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'email-analysis', label: 'Email Analysis', icon: Mail },
    { id: 'threat-detection', label: 'Threat Detection', icon: Cpu },
    { id: 'geolocation', label: 'Geolocation Intelligence', icon: Globe },
    { id: 'digital-forensics', label: 'Digital Forensics', icon: Database },
    { id: 'investigations', label: 'Investigations', icon: FileSearch }
  ];

  const sidebarWorkspace = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'email-analysis', label: 'Email Analysis', icon: Mail },
    { id: 'threat-detection', label: 'Threat Detection', icon: Cpu },
    { id: 'geolocation', label: 'Geolocation Intel', icon: Globe },
    { id: 'digital-forensics', label: 'Digital Forensics', icon: Database },
    { id: 'investigations', label: 'Investigation Cases', icon: FileSearch }
  ];

  const sidebarIntelligence = [
    { id: 'iocs', label: 'Indicators of Compromise', icon: Shield },
    { id: 'threat-sources', label: 'Threat Sources', icon: Activity },
    { id: 'domain-intel', label: 'Domain Intelligence', icon: Layers },
    { id: 'ip-intel', label: 'IP Intelligence', icon: Globe }
  ];

  const sidebarSystem = [
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'activity-log', label: 'Activity Log', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex flex-col font-sans relative overflow-hidden">
      
      {/* Ambient React Bits WebThreads WebGL Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25">
        <WebThreads
          color1="#06B6D4"
          color2="#3B82F6"
          color3="#7C3AED"
          speed={0.15}
          threadCount={6}
          frequency={4.0}
          spread={0.2}
          taper={1.0}
          position={0.5}
          fanMode="center"
          glow={0.03}
          falloff={0.5}
          thickness={1.2}
          brightness={0.5}
          opacity={0.8}
          mirror={true}
          shimmer={false}
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseStrength={0.2}
        />
      </div>

      {/* Top Persistent Enterprise Header */}
      <header className="h-14 bg-[#0F172A]/90 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-40 shadow-sm backdrop-blur-md">
        
        {/* Brand & App Title */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="shrink-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm font-mono tracking-wider text-white whitespace-nowrap">ZETP</span>
              <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/80 uppercase font-bold tracking-wider whitespace-nowrap">
                Enterprise SOC
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans hidden sm:block whitespace-nowrap">Zero Email Threat Portal</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        {viewMode === 'analyst' && (
          <nav className="hidden lg:flex items-center space-x-1.5 px-4 overflow-x-auto scrollbar-none">
            {mainNavTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeModule === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveModule(tab.id)}
                  className={`whitespace-nowrap inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? 'bg-[#1E293B] text-cyan-400 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Action Bar */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* AI Voice Assistant Trigger Button */}
          <button
            onClick={() => setShowVoiceModal(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono font-bold text-xs rounded-lg shadow-md flex items-center space-x-1.5 transition-all shrink-0 active:scale-95"
            title="Open AI Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span className="whitespace-nowrap hidden sm:inline">AI Voice Assistant</span>
          </button>

          {/* Global Search Input */}
          <div className="relative hidden xl:block shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search IOCs, IPs, Hash..."
              className="bg-[#1E293B] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono w-44 whitespace-nowrap"
            />
          </div>

          {/* View Mode Toggle Switch */}
          <div className="bg-[#1E293B] p-0.5 rounded-lg border border-slate-700/80 flex items-center shrink-0">
            <button
              onClick={() => setViewMode('analyst')}
              className={`whitespace-nowrap flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'analyst' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">SOC Analyst</span>
            </button>
            <button
              onClick={() => setViewMode('employee')}
              className={`whitespace-nowrap flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'employee' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Employee View</span>
            </button>
          </div>

          {/* Analyst Profile */}
          <div className="flex items-center space-x-2 border-l border-slate-800 pl-3 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:block text-left shrink-0">
              <p className="text-xs font-semibold text-slate-200 leading-tight whitespace-nowrap">Security Analyst</p>
              <p className="text-[10px] text-slate-400 leading-tight whitespace-nowrap">Investigation Team</p>
            </div>
            {onLogout && (
              <button onClick={onLogout} title="Sign Out" className="text-slate-400 hover:text-red-400 p-1 shrink-0">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </header>

      {/* Main Body with Collapsible Sidebar */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Collapsible Left Sidebar */}
        {viewMode === 'analyst' && (
          <aside className={`bg-[#0F172A]/90 border-r border-slate-800 flex flex-col justify-between transition-all duration-200 backdrop-blur-sm ${
            sidebarCollapsed ? 'w-14' : 'w-56'
          }`}>
            
            <div className="p-3 space-y-5 overflow-y-auto">
              
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Workspace Nav
                  </span>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800"
                >
                  {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* Workspace Navigation */}
              <div className="space-y-1">
                {sidebarWorkspace.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-800 text-cyan-400 border border-slate-700/60 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Intelligence Section */}
              <div className="space-y-1 pt-2 border-t border-slate-800/80">
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block px-2 mb-1">
                    Intelligence
                  </span>
                )}
                {sidebarIntelligence.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule('digital-forensics')}
                      title={sidebarCollapsed ? item.label : undefined}
                      className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>

              {/* System Section */}
              <div className="space-y-1 pt-2 border-t border-slate-800/80">
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block px-2 mb-1">
                    System
                  </span>
                )}
                {sidebarSystem.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule('overview')}
                      title={sidebarCollapsed ? item.label : undefined}
                      className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Bottom Status */}
            <div className="p-3 border-t border-slate-800/80 bg-[#0A0E1A]/50">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold truncate">
                    All services operational
                  </span>
                )}
              </div>
            </div>

          </aside>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>

      </div>

      {/* AI Voice Assistant Modal */}
      {showVoiceModal && (
        <VoiceChatModal
          onClose={() => setShowVoiceModal(false)}
          scanResult={scanResult}
        />
      )}

    </div>
  );
}
