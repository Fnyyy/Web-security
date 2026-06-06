import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Globe, Cpu, MemoryStick, Clock, ChevronRight, X } from 'lucide-react';
import { MOCK_NODES } from '../constants';
import { NetworkNode } from '../types';
import { cn } from '@/src/lib/utils';

export function TopologyGrid() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {MOCK_NODES.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => setSelectedNode(node)}
            className={cn(
              "glass-panel p-4 cursor-pointer transition-all hover:scale-105 active:scale-95 group relative overflow-hidden",
              selectedNode?.id === node.id && "ring-2 ring-cyber-cyan/50 bg-cyber-cyan/5"
            )}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={cn(
                "p-2 rounded-lg bg-slate-800/50",
                node.status === 'online' && "text-cyber-cyan",
                node.status === 'high-load' && "text-cyber-amber",
                node.status === 'packet-loss' && "text-cyber-rose"
              )}>
                <Server className="w-5 h-5" />
              </div>
              <div className={cn(
                "w-2 h-2 rounded-full",
                node.status === 'online' && "bg-cyber-cyan shadow-[0_0_8px_rgba(34,211,238,0.5)]",
                node.status === 'high-load' && "bg-cyber-amber shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse",
                node.status === 'packet-loss' && "bg-cyber-rose shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-bounce"
              )} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold truncate group-hover:text-cyber-cyan transition-colors">{node.name}</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{node.type}</p>
            </div>
            
            <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-4 h-4 text-cyber-cyan" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-y-0 right-0 w-80 glass-panel border-l border-cyber-border shadow-2xl z-50 p-6 flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold font-mono text-cyber-cyan flex items-center gap-2">
                <Server className="w-5 h-5" />
                NODE INFO
              </h2>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-white/5">
                <p className="text-xs text-slate-500 uppercase">Hostname</p>
                <p className="font-mono font-bold text-sm tracking-widest">{selectedNode.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    selectedNode.status === 'online' && "bg-cyber-cyan/10 text-cyber-cyan",
                    selectedNode.status === 'high-load' && "bg-cyber-amber/10 text-cyber-amber",
                    selectedNode.status === 'packet-loss' && "bg-cyber-rose/10 text-cyber-rose"
                  )}>
                    {selectedNode.status.replace('-', ' ')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoItem icon={<Globe className="w-3 h-3"/>} label="REGION" value={selectedNode.region} />
                <InfoItem icon={<Clock className="w-3 h-3"/>} label="UPTIME" value={selectedNode.uptime} />
                <InfoItem icon={<Cpu className="w-3 h-3"/>} label="CPU" value={`${selectedNode.cpu}%`} />
                <InfoItem icon={<MemoryStick className="w-3 h-3"/>} label="MEMORY" value={`${selectedNode.memory}%`} />
              </div>

              <div className="mt-8">
                <p className="text-[10px] text-slate-500 mb-2 tracking-widest uppercase">Health Pulse</p>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "flex-1",
                        i < 15 ? "bg-cyber-cyan" : "bg-slate-700",
                        selectedNode.status === 'high-load' && i > 12 && "bg-cyber-amber animate-pulse"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button className="mt-auto w-full py-3 glass-panel hover:bg-cyber-cyan/20 text-cyber-cyan font-mono text-xs tracking-widest transition-all">
              EXECUTE REMOTE CONNECT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-3 bg-slate-800/30 rounded-lg border border-white/5">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        {icon}
        <span className="text-[8px] font-bold tracking-widest uppercase">{label}</span>
      </div>
      <p className="text-xs font-mono font-medium">{value}</p>
    </div>
  );
}
