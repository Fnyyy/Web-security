import { ShieldAlert, ShieldCheck, Lock, Globe, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { MetricCard } from './MetricCard';

const BLOCKED_IPS = [
  { ip: '192.168.1.45', origin: 'RU', threat: 'DDoS Attempt', time: '2s ago' },
  { ip: '45.33.21.102', origin: 'CN', threat: 'SQL Injection', time: '12s ago' },
  { ip: '102.44.11.9', origin: 'UNKNOWN', threat: 'Port Scan', time: '1m ago' },
  { ip: '210.12.33.4', origin: 'DE', threat: 'Brute Force', time: '5m ago' },
];

export function SecurityView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Threat Protection" icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-mono font-bold text-emerald-400 text-glow-cyan">
              99.8<span className="text-lg opacity-50 ml-1">%</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Active Shield Efficiency</p>
          </div>
        </MetricCard>

        <MetricCard title="Blocked Threats" icon={<ShieldAlert className="w-4 h-4 text-rose-500" />}>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-mono font-bold text-rose-500">
              1,284
            </div>
            <p className="text-xs text-slate-500 mt-2">Last 24 Hours</p>
          </div>
        </MetricCard>

        <MetricCard title="Firewall Latency" icon={<Zap className="w-4 h-4 text-cyber-cyan" />}>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-mono font-bold text-cyber-cyan text-glow-cyan">
              0.8<span className="text-lg opacity-50 ml-1">ms</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Filter Response Time</p>
          </div>
        </MetricCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyber-cyan" />
            REAL-TIME INTRUSION LOG
          </h3>
          <div className="space-y-4">
            {BLOCKED_IPS.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-white/5 hover:border-rose-500/30 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-rose-500 p-2 rounded bg-rose-500/10">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold">{item.ip}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{item.threat}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono">
                    <Globe className="w-3 h-3" />
                    {item.origin}
                  </div>
                  <p className="text-[10px] text-rose-500/70 font-mono mt-1">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-cyber-cyan/5 animate-pulse" />
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full border-4 border-cyber-cyan/20 flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 rounded-full border-t-4 border-cyber-cyan animate-spin" />
              <ShieldCheck className="w-10 h-10 text-cyber-cyan glow-cyan" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white mb-2 uppercase tracking-tighter">AES-256 ENCRYPTION ACTIVE</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6 italic font-mono">"Adaptive heuristic filtering is monitoring all incoming packets across 48 edge nodes."</p>
            <button className="px-6 py-2 glass-panel border-cyber-cyan/30 text-cyber-cyan text-xs font-bold font-mono tracking-widest hover:bg-cyber-cyan/10 transition-all uppercase">
              Download Audit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
