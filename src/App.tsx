import { useState } from 'react';
import { InfrastructureOverview } from './components/InfrastructureOverview';
import { TopologyGrid } from './components/TopologyGrid';
import { AICopilot } from './components/AICopilot';
import { SecurityView } from './components/SecurityView';
import { SettingsView } from './components/SettingsView';
import { ToastProvider } from './components/Toast';
import { Activity, Shield, LayoutDashboard, Settings, Bell, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabType = 'dashboard' | 'monitoring' | 'security' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SectionHeader title="Infrastructure Intelligence" subtitle="Real-time telemetry & load distribution" />
            <InfrastructureOverview />
          </motion.div>
        );
      case 'monitoring':
        return (
          <motion.div
            key="monitoring"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SectionHeader title="Active Node Topology" subtitle="Mesh network status & resource localization" />
            <TopologyGrid />
          </motion.div>
        );
      case 'security':
        return (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SectionHeader title="Cyber-Security Gate" subtitle="Active threat detection & firewall status" />
            <SecurityView />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SectionHeader title="NOC Control Panel" subtitle="Live system configuration — changes apply immediately" />
            <SettingsView />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <ToastProvider>
    <div className="flex flex-col md:flex-row h-screen overflow-hidden text-slate-200">
      {/* Vertical Navigation Bar (Technical Side) */}
      <aside className="w-16 md:w-20 glass-panel border-0 border-r border-white/5 flex flex-col items-center py-6 gap-8 z-20 relative">
        <div 
          className="p-3 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 animate-pulse-cyan cursor-pointer"
          onClick={() => setActiveTab('dashboard')}
        >
          <Activity className="w-6 h-6" />
        </div>
        
        <nav className="flex flex-col gap-6">
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem 
            icon={<Activity className="w-5 h-5" />} 
            active={activeTab === 'monitoring'} 
            onClick={() => setActiveTab('monitoring')}
          />
          <NavItem 
            icon={<Shield className="w-5 h-5" />} 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          />
          <NavItem 
            icon={<Settings className="w-5 h-5" />} 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          />
        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <NavItem 
            icon={<Bell className="w-5 h-5" />} 
            badge 
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
          />
          <button 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className={`w-10 h-10 rounded-full border overflow-hidden hover:border-cyber-cyan transition-colors cursor-pointer bg-slate-800 flex items-center justify-center relative ${
              isProfileOpen ? 'border-cyber-cyan ring-2 ring-cyber-cyan/30' : 'border-white/10'
            }`}
          >
            <User className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Floating Notification Popover */}
        <AnimatePresence>
          {isNotifOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-18 md:left-22 bottom-24 w-80 glass-panel p-4 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col gap-3 bg-slate-950/90 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-mono font-bold text-cyber-cyan tracking-wider uppercase flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" /> SYSTEM ALERTS (3)
                </span>
                <button 
                  onClick={() => setIsNotifOpen(false)}
                  className="text-slate-500 hover:text-slate-300 text-[10px] font-mono hover:underline"
                >
                  Dismiss All
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="p-2.5 rounded bg-rose-950/20 border border-rose-500/20 flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 animate-ping shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono font-bold text-rose-400">CRITICAL: CA-01 PACKET LOSS</p>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5">Latency spikes detected @ 120ms on RD-CACHE-01</p>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/20 flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono font-bold text-amber-400">WARNING: HIGH CPU DETECTED</p>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5">WVR-PRIMARY utilization reached 88%</p>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-cyber-cyan/5 border border-cyber-cyan/10 flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono font-bold text-cyber-cyan">INFO: AUTOSCALING COMPLETE</p>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5">Job-Runner-A added 2 new child nodes</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating User Profile Popover */}
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-18 md:left-22 bottom-6 w-64 glass-panel p-4 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col gap-3 bg-slate-950/90 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <div className="w-8 h-8 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-cyber-cyan" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">ADMIN_OMEGA</p>
                  <p className="text-[8px] font-mono text-cyber-cyan/80 uppercase tracking-widest">Level 4 Operator</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 font-mono text-[10px]">
                <button className="flex items-center justify-between px-2.5 py-2 hover:bg-white/5 text-slate-300 hover:text-white rounded transition-colors text-left">
                  <span>System Preferences</span>
                  <span className="text-[8px] opacity-40">CTRL+,</span>
                </button>
                <button className="flex items-center justify-between px-2.5 py-2 hover:bg-white/5 text-slate-300 hover:text-white rounded transition-colors text-left">
                  <span>Access Logs</span>
                  <span className="text-[8px] opacity-40">LEVEL 4</span>
                </button>
                <div className="h-px bg-white/5 my-1" />
                <button className="flex items-center justify-between px-2.5 py-2 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded transition-colors text-left">
                  <span>Sign Out</span>
                  <span className="text-[8px] opacity-60 font-bold">BYE</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pt-6 px-4 md:px-8 pb-24 relative">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold text-cyber-cyan tracking-[0.3em] uppercase">Security Level: Omega</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              NETPULSE <span className="text-cyber-cyan opacity-80">V1.0</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-lg">Global Infrastructure monitoring active. 12/12 clusters operational. Latency levels within 5ms variance.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-slate-900/50 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyber-cyan/30 w-64 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 glass-panel text-[10px] font-bold font-mono text-emerald-400">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              SYSTEMS OPTIMAL
            </div>
          </div>
        </header>

        {/* Dashboard Sections */}
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>

        {/* Footer Metrics */}
        <footer className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-8 text-[10px] font-mono text-slate-600 tracking-widest uppercase pb-12">
          <div>DB CONNECTION: <span className="text-emerald-500">ACTIVE (4ms)</span></div>
          <div>API VERSION: <span className="text-slate-400">2.4.1-STABLE</span></div>
          <div>REGION: <span className="text-slate-400">MULTIZONE-AWS</span></div>
          <div>ENCRYPTION: <span className="text-cyber-cyan">AES-256-GCM</span></div>
        </footer>
      </main>

      {/* AI Side Panel - Desktop Only sticky or drawer on mobile */}
      <aside className="w-full md:w-80 lg:w-96 order-first md:order-last border-b md:border-b-0 md:border-l border-white/5 bg-slate-950/20 sticky top-0 h-screen">
        <AICopilot />
      </aside>
    </div>
    </ToastProvider>
  );
}

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white/90 mb-1">{title}</h2>
      <div className="flex items-center gap-4">
        <p className="text-xs text-slate-500">{subtitle}</p>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>
    </div>
  );
}

function NavItem({ icon, active = false, badge = false, onClick }: { icon: any, active?: boolean, badge?: boolean, onClick?: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-3 rounded-xl transition-all duration-300 cursor-pointer ${
        active 
          ? 'bg-cyber-cyan/15 text-cyber-cyan shadow-[0_0_28px_rgba(34,211,238,0.55),inset_0_0_12px_rgba(34,211,238,0.1)] ring-1 ring-cyber-cyan/60 border border-cyber-cyan/40' 
          : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'
      }`}
    >
      {icon}
      {badge && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-cyber-midnight shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
      )}
      {active && (
        <motion.div 
          layoutId="active-nav"
          className="absolute inset-0 rounded-xl border border-cyber-cyan/50 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]"
        />
      )}
    </motion.button>
  );
}


