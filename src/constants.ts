import { NetworkNode, MetricPoint, LoadTestResult } from './types';

export const MOCK_NODES: NetworkNode[] = [
  { id: 'lb-01', name: 'LB-EDGE-SYNC', type: 'Load Balancer', status: 'online', latency: 12, cpu: 24, memory: 45, uptime: '14d 02h', region: 'US-EAST' },
  { id: 'web-01', name: 'WVR-PRIMARY', type: 'Web Server', status: 'high-load', latency: 45, cpu: 88, memory: 92, uptime: '4d 18h', region: 'EU-CENTRAL' },
  { id: 'db-01', name: 'SQL-ST-01', type: 'Database', status: 'online', latency: 8, cpu: 32, memory: 60, uptime: '156d 12h', region: 'US-EAST' },
  { id: 'web-02', name: 'WVR-SECONDARY', type: 'Web Server', status: 'online', latency: 15, cpu: 12, memory: 40, uptime: '4d 18h', region: 'EU-CENTRAL' },
  { id: 'ca-01', name: 'RD-CACHE-01', type: 'Cache', status: 'packet-loss', latency: 120, cpu: 45, memory: 15, uptime: '22h 10m', region: 'ASIA-PACIFIC' },
  { id: 'wk-01', name: 'JOB-RUNNER-A', type: 'Worker', status: 'online', latency: 5, cpu: 55, memory: 30, uptime: '12d 04h', region: 'US-WEST' },
  { id: 'db-02', name: 'SQL-ST-REPO', type: 'Database', status: 'online', latency: 5, cpu: 10, memory: 20, uptime: '45d 01h', region: 'US-EAST' },
  { id: 'lb-02', name: 'LB-INTERNAL', type: 'Load Balancer', status: 'online', latency: 2, cpu: 5, memory: 10, uptime: '30d 22h', region: 'GLOBAL' },
];

export const MOCK_METRICS: MetricPoint[] = [
  { time: '00:00', bandwidth: 45, latency: 12 },
  { time: '04:00', bandwidth: 30, latency: 15 },
  { time: '08:00', bandwidth: 85, latency: 45 },
  { time: '12:00', bandwidth: 95, latency: 38 },
  { time: '16:00', bandwidth: 70, latency: 22 },
  { time: '20:00', bandwidth: 55, latency: 18 },
  { time: '24:00', bandwidth: 48, latency: 14 },
];

export const MOCK_LOAD_TESTS: LoadTestResult[] = [
  { env: 'Staging', success: 98.5, failure: 1.5 },
  { env: 'Production', success: 99.9, failure: 0.1 },
  { env: 'Canary', success: 85.2, failure: 14.8 },
  { env: 'DR-Site', success: 92.1, failure: 7.9 },
];
