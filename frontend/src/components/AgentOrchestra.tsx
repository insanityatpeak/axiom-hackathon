import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building, Map, Settings, Search, TestTube, Bug, 
  RefreshCw, FileText, Shield, Rocket, Package, BrainCircuit,
  MessageSquare
} from 'lucide-react';

const agents = [
  { id: 'arch', name: 'Architect', icon: Building, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'plan', name: 'Planner', icon: Map, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'eng', name: 'Engineer (x3)', icon: Settings, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  { id: 'rev', name: 'Reviewer', icon: Search, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'test', name: 'Test Intel', icon: TestTube, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  { id: 'debug', name: 'Debugger', icon: Bug, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { id: 'refact', name: 'Refactor', icon: RefreshCw, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'doc', name: 'Documentation', icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { id: 'sec', name: 'Security', icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { id: 'cicd', name: 'CI/CD Coord', icon: Rocket, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30' },
  { id: 'rel', name: 'Release Mgr', icon: Package, color: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/30' },
  { id: 'mem', name: 'Memory Curator', icon: BrainCircuit, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' }
];

export function AgentOrchestra({ isRunning }: { isRunning: boolean }) {
  return (
    <div className="glass-panel flex-1 flex flex-col overflow-hidden relative p-6">
      <div className="flex items-center justify-between mb-8 z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            Band SDK Orchestra
          </h2>
          <p className="text-sm text-gray-400">Real-time visualization of agent coordination</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-gray-800 rounded-full border border-gray-700 text-xs font-mono flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
            {isRunning ? 'EXECUTION IN PROGRESS' : 'IDLE'}
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-10 grid grid-cols-4 grid-rows-3 gap-6">
        {agents.map((agent, i) => {
          const isActive = isRunning && Math.random() > 0.5; // Mock active state
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative flex flex-col p-4 rounded-xl border transition-all duration-500 ${agent.bg} ${agent.border} ${
                isActive ? 'shadow-[0_0_20px_rgba(0,0,0,0.2)] shadow-' + agent.color.split('-')[1] + '-500/20' : 'opacity-70 grayscale'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gray-900 border border-gray-800 ${agent.color}`}>
                  <agent.icon className="w-6 h-6" />
                </div>
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <MessageSquare className={`w-4 h-4 ${agent.color} opacity-70`} />
                  </motion.div>
                )}
              </div>
              <h3 className="font-semibold text-gray-200">{agent.name}</h3>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono">
                {isActive ? 'Processing...' : 'Standby'}
              </p>
              
              {/* Fake message particles */}
              {isActive && (
                <motion.div 
                  className={`absolute -right-2 top-1/2 w-1.5 h-1.5 rounded-full ${agent.color.replace('text-', 'bg-')}`}
                  animate={{ 
                    x: [0, 50, 100], 
                    y: [0, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
                    opacity: [1, 0, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Background connection lines mock */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-gray-800" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}
