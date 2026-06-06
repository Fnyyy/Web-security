import { useState, useEffect, useRef } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { MetricCard } from './MetricCard';
import { Activity, BarChart3, Zap } from 'lucide-react';

// ──────────────────────────────────────────────
// Bandwidth chart: 12 rolling data points, 500 Mbps–2.5 Gbps
// ──────────────────────────────────────────────
const NODE_LABELS = ['LB-EDGE', 'WVR-PRI', 'SQL-ST', 'WVR-SEC', 'CACHE', 'JOB-RUN', 'SQL-RPO', 'LB-INT'];

function generateBandwidthData() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const t = new Date(now.getTime() - (11 - i) * 10_000);
    const hh = t.getHours().toString().padStart(2, '0');
    const mm = t.getMinutes().toString().padStart(2, '0');
    const ss = t.getSeconds().toString().padStart(2, '0');
    // Random value between 0.5 and 2.5 (Gbps)
    const bw = +(0.5 + Math.random() * 2.0).toFixed(2);
    return { time: `${hh}:${mm}:${ss}`, bandwidth: bw };
  });
}

function generateLatencyData() {
  return NODE_LABELS.map((name) => {
    // Occasional spike: 10% chance of high latency
    const spike = Math.random() < 0.1;
    const latency = spike
      ? +(80 + Math.random() * 120).toFixed(1)
      : +(5 + Math.random() * 35).toFixed(1);
    return { name, latency };
  });
}

function getLatencyColor(latency: number) {
  if (latency > 80) return '#f43f5e'; // rose - spike
  if (latency > 40) return '#f59e0b'; // amber - elevated
  return '#22d3ee';                    // cyan - normal
}

export function InfrastructureOverview() {
  const [bandwidthData, setBandwidthData] = useState(generateBandwidthData);
  const [latencyData, setLatencyData]     = useState(generateLatencyData);
  const [totalSessions, setTotalSessions] = useState(18.4);
  const [avgLatency, setAvgLatency]       = useState(24);

  useEffect(() => {
    const id = setInterval(() => {
      // Roll bandwidth: drop oldest, add newest
      setBandwidthData(prev => {
        const next = [...prev.slice(1)];
        const now  = new Date();
        const hh   = now.getHours().toString().padStart(2, '0');
        const mm   = now.getMinutes().toString().padStart(2, '0');
        const ss   = now.getSeconds().toString().padStart(2, '0');
        // Smooth transition: drift ±0.3 Gbps from previous value, clamped
        const last = prev[prev.length - 1].bandwidth;
        const drift = (Math.random() - 0.5) * 0.6;
        const bw = +Math.min(2.5, Math.max(0.5, last + drift)).toFixed(2);
        next.push({ time: `${hh}:${mm}:${ss}`, bandwidth: bw });
        return next;
      });

      // Regenerate node latency (with spike chance)
      setLatencyData(generateLatencyData());

      // Drift session count
      setTotalSessions(prev => +Math.max(10, Math.min(30, prev + (Math.random() - 0.48) * 0.3)).toFixed(1));

      // Drift avg latency
      setAvgLatency(prev => Math.max(8, Math.min(120, prev + Math.round((Math.random() - 0.5) * 6))));
    }, 1500);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
      {/* Main Bandwidth Chart */}
      <MetricCard
        title="Bandwidth Utilization — LIVE"
        icon={<Activity className="w-4 h-4 text-cyber-cyan" />}
        className="md:col-span-2 lg:col-span-3 row-span-2"
        delay={0.1}
      >
        <div className="h-full w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bandwidthData}>
              <defs>
                <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 9 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                unit=" Gb"
                domain={[0, 3]}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 11 }}
                itemStyle={{ color: '#22d3ee' }}
                formatter={(v: number) => [`${v} Gbps`, 'Bandwidth']}
              />
              <Area
                type="monotone"
                dataKey="bandwidth"
                stroke="#22d3ee"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBandwidth)"
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </MetricCard>

      {/* Avg Latency */}
      <MetricCard
        title="Avg Latency"
        icon={<Zap className="w-4 h-4 text-cyber-amber" />}
        delay={0.2}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className={`text-4xl font-mono font-bold transition-colors duration-500 ${avgLatency > 80 ? 'text-cyber-rose' : avgLatency > 40 ? 'text-cyber-amber' : 'text-cyber-amber'} glow-amber`}>
            {avgLatency}<span className="text-lg opacity-50 ml-1">ms</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {avgLatency > 80 ? '⚠ Elevated — check edge routers' : avgLatency > 40 ? 'Moderate Load' : 'Optimal Performance'}
          </p>
        </div>
      </MetricCard>

      {/* Total Sessions */}
      <MetricCard
        title="Total Sessions"
        icon={<Activity className="w-4 h-4 text-cyber-cyan" />}
        delay={0.3}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-4xl font-mono font-bold text-cyber-cyan text-glow-cyan">
            {totalSessions.toFixed(1)}<span className="text-lg opacity-50 ml-1">k</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Live active connections</p>
        </div>
      </MetricCard>

      {/* Node Latency Bar Chart */}
      <MetricCard
        title="Server Node Latency — LIVE"
        icon={<BarChart3 className="w-4 h-4 text-slate-400" />}
        className="md:col-span-2 lg:col-span-4"
        delay={0.4}
      >
        <div className="h-[150px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={latencyData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                unit="ms"
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }}
                formatter={(v: number) => [`${v} ms`, 'Latency']}
              />
              <Bar
                dataKey="latency"
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
                animationDuration={500}
                animationEasing="ease-out"
              >
                {latencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getLatencyColor(entry.latency)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-end gap-4 text-[10px] mt-1 font-mono uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-cyber-cyan rounded-full" /> Normal</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-cyber-amber rounded-full" /> Elevated</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-cyber-rose rounded-full" /> Spike</div>
        </div>
      </MetricCard>
    </div>
  );
}
