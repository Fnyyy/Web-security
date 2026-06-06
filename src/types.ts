export interface NetworkNode {
  id: string;
  name: string;
  type: 'Load Balancer' | 'Web Server' | 'Database' | 'Worker' | 'Cache';
  status: 'online' | 'high-load' | 'packet-loss';
  latency: number;
  cpu: number;
  memory: number;
  uptime: string;
  region: string;
}

export interface MetricPoint {
  time: string;
  bandwidth: number;
  latency: number;
}

export interface LoadTestResult {
  env: string;
  success: number;
  failure: number;
}
