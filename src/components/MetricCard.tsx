import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface MetricCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MetricCard({ title, icon, children, className, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("glass-panel p-5 flex flex-col gap-4 overflow-hidden group", className)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <div className="w-2 h-2 rounded-full bg-cyber-cyan glow-cyan animate-pulse" />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </motion.div>
  );
}
