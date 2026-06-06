import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, Send, Command, Bug, Cpu, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface TerminalLine {
  id: string;
  kind: 'prompt' | 'output' | 'processing' | 'system';
  text: string;
  color?: string; // tailwind text-* class override
}

// ──────────────────────────────────────────────
// Command Logic
// ──────────────────────────────────────────────
type CommandResult =
  | { type: 'instant'; lines: string[] }
  | { type: 'delayed'; processingMs: number; lines: string[] };

function resolveCommand(raw: string): CommandResult {
  const cmd = raw.trim().toLowerCase();

  if (cmd === 'ping wvr-primary') {
    return {
      type: 'instant',
      lines: [
        'PING WVR-PRIMARY (10.0.1.5) 56 bytes of data.',
        '64 bytes from 10.0.1.5: icmp_seq=1 ttl=64 time=12.4 ms',
        '64 bytes from 10.0.1.5: icmp_seq=2 ttl=64 time=11.9 ms',
        '64 bytes from 10.0.1.5: icmp_seq=3 ttl=64 time=14.2 ms',
        '64 bytes from 10.0.1.5: icmp_seq=4 ttl=64 time=13.1 ms',
        '--- WVR-PRIMARY ping statistics ---',
        '4 packets transmitted, 4 received, 0% packet loss, time 3004ms',
        'rtt min/avg/max/mdev = 11.9/12.9/14.2/0.9 ms',
      ],
    };
  }

  if (cmd === 'analyze node sql-st-01') {
    return {
      type: 'delayed',
      processingMs: 1500,
      lines: [
        '━━━ ROOT CAUSE ANALYSIS: SQL-ST-01 ━━━',
        '⚠  Packet loss detected at edge router (eth0 → WAN).',
        '⚠  High CPU load observed: 94% sustained > 5 min.',
        '',
        '✦  RECOMMENDATION:',
        '   Reroute traffic to secondary node (SQL-ST-REPO).',
        '   Initiate auto-scaling policy: MIN 2 / MAX 6 replicas.',
        '   Schedule index rebuild during off-peak window.',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      ],
    };
  }

  return {
    type: 'instant',
    lines: ['Command received. Awaiting authorization...'],
  };
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2);
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
export function AICopilot() {
  const [input, setInput]     = useState('');
  const [busy, setBusy]       = useState(false);
  const [lines, setLines]     = useState<TerminalLine[]>([
    {
      id: uid(),
      kind: 'system',
      text: '╔══════════════════════════════════════════╗',
    },
    {
      id: uid(),
      kind: 'system',
      text: '║   NETPULSE SYSADMIN TERMINAL  v1.0.4     ║',
    },
    {
      id: uid(),
      kind: 'system',
      text: '╚══════════════════════════════════════════╝',
    },
    {
      id: uid(),
      kind: 'output',
      text: 'AI Copilot online. Type a command to begin.',
    },
    {
      id: uid(),
      kind: 'output',
      text: 'Try: "ping WVR-PRIMARY"  or  "analyze node SQL-ST-01"',
      color: 'text-cyan-600',
    },
  ]);

  const scrollRef     = useRef<HTMLDivElement>(null);
  const inputRef      = useRef<HTMLInputElement>(null);

  // Auto-scroll on new lines
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const pushLines = useCallback((newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const cmd = input.trim();
    if (!cmd || busy) return;

    setInput('');
    setBusy(true);

    // Echo the prompt
    pushLines([{ id: uid(), kind: 'prompt', text: `> ${cmd}` }]);

    const result = resolveCommand(cmd);

    if (result.type === 'instant') {
      pushLines(
        result.lines.map(t => ({ id: uid(), kind: 'output' as const, text: t }))
      );
      pushLines([{ id: uid(), kind: 'output', text: '', color: 'text-slate-700' }]); // spacer
      setBusy(false);
    } else {
      // Show [PROCESSING...] indicator
      const processingId = uid();
      setLines(prev => [
        ...prev,
        { id: processingId, kind: 'processing', text: '[PROCESSING...]' },
      ]);

      await new Promise(r => setTimeout(r, result.processingMs));

      // Remove the processing line, append real output
      setLines(prev => {
        const filtered = prev.filter(l => l.id !== processingId);
        const output: TerminalLine[] = result.lines.map(t => ({
          id: uid(),
          kind: 'output',
          text: t,
        }));
        return [...filtered, ...output, { id: uid(), kind: 'output', text: '' }];
      });

      setBusy(false);
    }

    // Re-focus input
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleQuickAction = (cmd: string) => {
    setInput(cmd);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full border-0 rounded-none md:rounded-l-2xl shadow-2xl overflow-hidden"
         style={{ background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(20px)' }}>

      {/* ── Header ── */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0"
           style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded border" style={{ background: 'rgba(34,211,238,0.15)', borderColor: 'rgba(34,211,238,0.3)' }}>
            <Sparkles className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono tracking-normal text-white">
              AI COPILOT <span className="text-[10px] text-slate-500 font-normal">v1.0.4-stable</span>
            </h2>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[8px] text-emerald-500/80 font-mono tracking-widest uppercase">Terminal Ready</span>
            </div>
          </div>
        </div>
        <Terminal className="w-4 h-4 text-slate-600" />
      </div>

      {/* ── Terminal Output ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 terminal-scrollbar"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence initial={false}>
          {lines.map(line => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`text-[11px] leading-5 whitespace-pre-wrap break-all ${
                line.kind === 'prompt'
                  ? 'text-cyber-cyan font-bold mt-2'
                  : line.kind === 'processing'
                  ? 'text-yellow-400 animate-pulse'
                  : line.kind === 'system'
                  ? 'text-cyan-600/70'
                  : line.color
                  ? line.color
                  : 'text-emerald-400'
              }`}
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blinking cursor when idle */}
        {!busy && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[11px] text-cyber-cyan font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{'>'}</span>
            <span className="inline-block w-2 h-3 bg-cyber-cyan opacity-75 animate-pulse" />
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5 shrink-0">
        <QuickBtn icon={<Bug size={10} />}      label="ping WVR-PRIMARY"     onClick={() => handleQuickAction('ping WVR-PRIMARY')} />
        <QuickBtn icon={<ShieldAlert size={10} />} label="analyze SQL-ST-01" onClick={() => handleQuickAction('analyze node SQL-ST-01')} />
        <QuickBtn icon={<Cpu size={10} />}      label="status all"           onClick={() => handleQuickAction('status all')} />
      </div>

      {/* ── Input ── */}
      <div className="p-4 border-t border-white/5 shrink-0" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
        <form onSubmit={handleSubmit} className="relative group">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-cyan text-sm font-bold select-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={busy}
            placeholder={busy ? 'Processing...' : 'Type command and press Enter...'}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-lg pl-8 pr-12 py-3 text-[11px] focus:outline-none transition-all disabled:opacity-50 placeholder:text-slate-600"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: 'rgba(2, 6, 23, 0.8)',
              border: '1px solid rgba(34,211,238,0.2)',
              color: '#22d3ee',
              boxShadow: input ? '0 0 12px rgba(34,211,238,0.15)' : 'none',
            }}
            onFocus={e => { e.target.style.border = '1px solid rgba(34,211,238,0.5)'; }}
            onBlur={e => { e.target.style.border = '1px solid rgba(34,211,238,0.2)'; }}
          />
          <button
            type="submit"
            disabled={!input.trim() || busy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all disabled:opacity-25"
            style={{ color: '#22d3ee' }}
            onMouseOver={e => { if (!busy && input.trim()) (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.15)'; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-2 text-[8px] text-slate-600 font-mono text-center tracking-widest">
          SYSTEM-LEVEL ACCESS GRANTED — USE WITH CAUTION
        </p>
      </div>
    </div>
  );
}

function QuickBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/10 hover:border-cyan-500/30 text-[9px] font-bold text-slate-400 hover:text-cyan-400 transition-all uppercase tracking-wider whitespace-nowrap"
      style={{ background: 'rgba(15, 23, 42, 0.5)', fontFamily: "'JetBrains Mono', monospace" }}
    >
      {icon}
      {label}
    </button>
  );
}
