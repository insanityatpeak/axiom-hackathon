import React, { useState, useEffect } from 'react';
import { Play, Square, FileCode, CheckCircle2, AlertCircle, TerminalSquare, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskPanelProps {
  repoConnected: boolean;
  onRunTask: (running: boolean) => void;
  isRunning: boolean;
}

export function TaskPanel({ repoConnected, onRunTask, isRunning }: TaskPanelProps) {
  const [taskText, setTaskText] = useState('Add token-bucket rate limiting (60 req/min per user) to POST /api/upload');
  const [logs, setLogs] = useState<{time: string, msg: string}[]>([]);

  useEffect(() => {
    if (isRunning) {
      const demoLogs = [
        "Initializing Band SDK room...",
        "Planner Agent: Analyzing task decomposition",
        "Memory Curator: Querying prior rate-limiting patterns...",
        "Architect Agent: Validating approach against ADRs",
        "Engineer Agent (x3): Fan-out implementation started",
        "Code Review Agent: Running 3-lens review (Correctness/Perf/Sec)",
        "Consensus Mediator: Debate triggered between Architect and Reviewer",
        "Test Intelligence: Generating mutation-aware coverage",
        "CI/CD Coordinator: Building impact-scoped matrix",
        "Release Manager: Computing Readiness Score",
      ];
      
      let i = 0;
      setLogs([{ time: new Date().toLocaleTimeString(), msg: "Task started" }]);
      
      const interval = setInterval(() => {
        if (i < demoLogs.length) {
          setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: demoLogs[i] }]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => onRunTask(false), 2000); // End after a bit
        }
      }, 1500);
      
      return () => clearInterval(interval);
    } else if (logs.length > 0) {
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: "Task completed. PR Generated." }]);
    }
  }, [isRunning]);

  return (
    <div className="glass-panel h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-800 bg-gray-800/20 flex items-center gap-2">
        <TerminalSquare className="w-5 h-5 text-indigo-400" />
        <h2 className="font-semibold text-gray-200">Task Control</h2>
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Objective
          </label>
          <textarea 
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            disabled={isRunning || !repoConnected}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all h-28 resize-none"
            placeholder="Describe the feature, bug fix, or refactor..."
          />
        </div>

        <button
          onClick={() => onRunTask(!isRunning)}
          disabled={!repoConnected || (!isRunning && taskText.length === 0)}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            !repoConnected 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : isRunning 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
          }`}
        >
          {isRunning ? (
            <>
              <Square className="w-4 h-4" />
              Stop Execution
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run AXIOM
            </>
          )}
        </button>

        {!repoConnected && (
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500/80 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Connect a GitHub repository or load the Demo Repo to begin.</p>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0 border-t border-gray-800 bg-gray-950/50">
        <div className="p-3 border-b border-gray-800 bg-gray-900/50">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Execution Log
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {logs.length === 0 && !isRunning && (
            <div className="text-gray-600 text-center mt-10">Awaiting task...</div>
          )}
          {logs.map((log, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={idx} 
              className="flex gap-3 text-gray-300"
            >
              <span className="text-gray-600 flex-shrink-0">[{log.time}]</span>
              <span className={log?.msg?.includes("completed") ? "text-green-400 font-bold" : ""}>
                {log?.msg || ""}
              </span>
            </motion.div>
          ))}
          {isRunning && (
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex gap-3 text-indigo-400"
            >
              <span>...</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
