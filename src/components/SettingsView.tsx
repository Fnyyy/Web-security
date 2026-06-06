import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sliders, Globe, Zap, Shield, ToggleRight,
  Cpu, Activity, Server
} from 'lucide-react';
import { useToast } from './Toast';

// ─── Reusable Subcomponents ───────────────────────────────────────────────────

/** iOS-style neon toggle */
function CyberToggle({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/40 focus:ring-offset-2 focus:ring-offset-transparent"
      style={{
        background: checked
          ? 'linear-gradient(135deg, rgba(34,211,238,0.9), rgba(6,182,212,0.8))'
          : 'rgba(30, 41, 59, 0.8)',
        border: checked ? '1px solid rgba(34,211,238,0.6)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: checked ? '0 0 14px rgba(34,211,238,0.4), inset 0 0 8px rgba(34,211,238,0.1)' : 'none',
      }}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 35 }}
        className="absolute w-4 h-4 rounded-full"
        style={{
          left: checked ? '26px' : '3px',
          background: checked ? '#fff' : 'rgba(148,163,184,0.6)',
          boxShadow: checked ? '0 0 8px rgba(34,211,238,0.7)' : 'none',
        }}
      />
    </button>
  );
}

/** Slider with live value readout */
function CyberSlider({
  id,
  label,
  unit,
  min,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const danger = pct > 80;
  const warn   = pct > 60;

  const trackColor = danger
    ? 'rgba(244,63,94,0.8)'
    : warn
    ? 'rgba(245,158,11,0.8)'
    : 'rgba(34,211,238,0.8)';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-mono text-slate-400 tracking-wider uppercase">
          {label}
        </label>
        <div
          className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold transition-colors duration-300"
          style={{
            background: danger ? 'rgba(244,63,94,0.15)' : warn ? 'rgba(245,158,11,0.15)' : 'rgba(34,211,238,0.12)',
            color: danger ? '#f43f5e' : warn ? '#f59e0b' : '#22d3ee',
            border: `1px solid ${danger ? 'rgba(244,63,94,0.3)' : warn ? 'rgba(245,158,11,0.3)' : 'rgba(34,211,238,0.25)'}`,
          }}
        >
          {value}{unit}
        </div>
      </div>

      {/* Track + thumb */}
      <div className="relative h-2 rounded-full" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Filled portion */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-100"
          style={{ width: `${pct}%`, background: trackColor, boxShadow: `0 0 8px ${trackColor}` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-slate-600">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SettingsView() {
  const { showToast } = useToast();

  // Card 1 — Global Overrides
  const [autoScaling, setAutoScaling]   = useState(true);
  const [ddosMitigation, setDdosMitigation] = useState(true);
  const [maintenance, setMaintenance]   = useState(false);

  // Card 2 — Alert Thresholds
  const [cpuThreshold, setCpuThreshold]         = useState(80);
  const [latencyThreshold, setLatencyThreshold] = useState(150);

  // Card 3 — Routing Region
  const [region, setRegion] = useState<'asia-southeast2' | 'us-west1' | 'eu-central1'>('us-west1');

  // Toggle helper with toast
  const handleToggle = (
    label: string,
    current: boolean,
    setter: (v: boolean) => void,
  ) => {
    const next = !current;
    setter(next);
    showToast(
      'SYSTEM UPDATE',
      `${label} ${next ? 'ENABLED' : 'DISABLED'}`,
      next ? 'success' : 'warning',
    );
  };

  const handleRegion = (r: typeof region) => {
    if (r === region) return;
    setRegion(r);
    showToast('ROUTING UPDATED', r, 'info');
  };

  const REGIONS = ['asia-southeast2', 'us-west1', 'eu-central1'] as const;

  const panelStyle: React.CSSProperties = {
    background: 'rgba(8, 15, 35, 0.55)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
  };

  const divider = <div className="h-px w-full my-1" style={{ background: 'rgba(255,255,255,0.05)' }} />;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)' }}>
          <Sliders className="w-4 h-4 text-cyber-cyan" />
        </div>
        <div>
          <h2 className="text-sm font-bold font-mono tracking-[0.2em] uppercase text-white/90">NOC Control Panel</h2>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Level 4 Administrator Access — All changes are logged</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-widest">LIVE CONFIG</span>
        </div>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Card 1: Global Overrides ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={panelStyle}
          className="p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <ToggleRight className="w-4 h-4 text-cyber-cyan" />
            <h3 className="text-xs font-bold font-mono tracking-[0.2em] uppercase text-white/80">Global Overrides</h3>
          </div>

          <div className="space-y-1">
            {/* Auto-Scaling */}
            <div className="flex items-center justify-between py-3 group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded" style={{ background: 'rgba(34,211,238,0.08)' }}>
                  <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
                </div>
                <div>
                  <p className="text-xs font-semibold font-mono text-slate-200">Auto-Scaling Engine</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Dynamically adjusts compute resources</p>
                </div>
              </div>
              <CyberToggle
                id="toggle-autoscaling"
                checked={autoScaling}
                onChange={() => handleToggle('Auto-Scaling Engine', autoScaling, setAutoScaling)}
              />
            </div>

            {divider}

            {/* DDoS Mitigation */}
            <div className="flex items-center justify-between py-3 group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded" style={{ background: 'rgba(244,63,94,0.08)' }}>
                  <Shield className="w-3.5 h-3.5 text-cyber-rose" />
                </div>
                <div>
                  <p className="text-xs font-semibold font-mono text-slate-200">DDoS Mitigation Protocol</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Layer 3/4 traffic scrubbing active</p>
                </div>
              </div>
              <CyberToggle
                id="toggle-ddos"
                checked={ddosMitigation}
                onChange={() => handleToggle('DDoS Mitigation', ddosMitigation, setDdosMitigation)}
              />
            </div>

            {divider}

            {/* Maintenance Mode */}
            <div className="flex items-center justify-between py-3 group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded" style={{ background: maintenance ? 'rgba(245,158,11,0.12)' : 'rgba(100,116,139,0.08)' }}>
                  <Server className="w-3.5 h-3.5" style={{ color: maintenance ? '#f59e0b' : '#64748b' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold font-mono text-slate-200">Maintenance Mode</p>
                  <p className="text-[10px] mt-0.5" style={{ color: maintenance ? '#f59e0b' : '#64748b' }}>
                    {maintenance ? '⚠ All traffic blocked — maintenance active' : 'Traffic routing normally'}
                  </p>
                </div>
              </div>
              <CyberToggle
                id="toggle-maintenance"
                checked={maintenance}
                onChange={() => handleToggle('Maintenance Mode', maintenance, setMaintenance)}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Card 2: Alert Thresholds ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={panelStyle}
          className="p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Cpu className="w-4 h-4 text-cyber-amber" />
            <h3 className="text-xs font-bold font-mono tracking-[0.2em] uppercase text-white/80">Alert Thresholds</h3>
          </div>

          <div className="space-y-8">
            <CyberSlider
              id="slider-cpu"
              label="Max CPU Load"
              unit="%"
              min={10}
              max={100}
              value={cpuThreshold}
              onChange={setCpuThreshold}
            />
            <CyberSlider
              id="slider-latency"
              label="Latency Threshold"
              unit="ms"
              min={5}
              max={500}
              value={latencyThreshold}
              onChange={setLatencyThreshold}
            />
          </div>

          <div className="mt-6 p-3 rounded-lg" style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.1)' }}>
            <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
              Alerts fire when <span className="text-cyber-cyan">CPU &gt; {cpuThreshold}%</span> or{' '}
              <span className="text-cyber-amber">latency &gt; {latencyThreshold}ms</span> is sustained for &gt; 60s.
            </p>
          </div>
        </motion.div>

        {/* ── Card 3: Active Routing Region ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={panelStyle}
          className="p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold font-mono tracking-[0.2em] uppercase text-white/80">Active Routing Region</h3>
            <span className="ml-auto text-[10px] font-mono text-slate-500">Primary ingress point for all traffic</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {REGIONS.map(r => {
              const active = region === r;
              return (
                <motion.button
                  key={r}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleRegion(r)}
                  className="relative px-5 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 focus:outline-none"
                  style={{
                    background: active
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.15))'
                      : 'rgba(15, 23, 42, 0.5)',
                    border: active
                      ? '1px solid rgba(99,102,241,0.6)'
                      : '1px solid rgba(255,255,255,0.07)',
                    color: active ? '#a5b4fc' : '#64748b',
                    boxShadow: active
                      ? '0 0 20px rgba(99,102,241,0.3), inset 0 0 12px rgba(99,102,241,0.08)'
                      : 'none',
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="region-glow"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(34,211,238,0.06))',
                        border: '1px solid rgba(99,102,241,0.4)',
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
                    {r}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {REGIONS.map(r => (
              <div
                key={r}
                className="p-3 rounded-lg transition-all duration-300"
                style={{
                  background: region === r ? 'rgba(99,102,241,0.07)' : 'rgba(15,23,42,0.3)',
                  border: `1px solid ${region === r ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)'}`,
                }}
              >
                <p className="text-[9px] font-mono font-bold uppercase tracking-widest" style={{ color: region === r ? '#818cf8' : '#475569' }}>
                  {r.split('-')[0].toUpperCase()}
                </p>
                <p className="text-[10px] font-mono text-slate-400 mt-1">
                  {r === 'asia-southeast2' ? 'Jakarta · SIN · HKG'
                   : r === 'us-west1'      ? 'Oregon · LA · PHX'
                                           : 'Frankfurt · AMS · LON'}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: region === r ? '#4ade80' : '#334155' }} />
                  <span className="text-[9px] font-mono" style={{ color: region === r ? '#4ade80' : '#475569' }}>
                    {region === r ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
