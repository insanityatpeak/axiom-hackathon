import React from 'react';
import { Scale, CheckCircle2, XCircle, AlertTriangle, Building, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function ConsensusLog() {
  return (
    <div className="glass-panel flex-1 flex flex-col p-6 overflow-hidden">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
          <Scale className="w-6 h-6 text-indigo-400" />
          Consensus & Debate Protocol
        </h2>
        <p className="text-sm text-gray-400 mt-1">Permanent log of agent disagreements and resolution</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-6">
        {/* Mock Debate 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-800 rounded-xl bg-gray-900/50 overflow-hidden"
        >
          <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">CONFLICT DETECTED</span>
              <span className="text-sm font-medium text-gray-300">Rate Limiting Implementation: Redis vs In-Memory LRU</span>
            </div>
            <span className="text-xs text-gray-500">Today, 10:42 AM</span>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Round 1 */}
            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-gray-900 text-purple-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Search className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-800 bg-gray-900/50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-gray-300">Reviewer Agent</div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Recommends In-Memory LRU. Zero latency, no infra cost for this scale. Redis adds unnecessary operational overhead.
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-gray-900 text-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Building className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-800 bg-gray-900/50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-gray-300">Engineer Agent</div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Recommends Redis. Distributed, survives pod restarts, scales horizontally. Best practice for stateless APIs.
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution */}
            <div className="mt-4 p-4 rounded-xl bg-indigo-900/20 border border-indigo-500/30 flex gap-4">
              <Scale className="w-8 h-8 text-indigo-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                  Architect Agent Ruling <ArrowRight className="w-4 h-4" /> Consensus Reached
                </h4>
                <p className="text-sm text-gray-300 mt-1">
                  Querying Engineering Memory Graph... Found ADR-007: "Prefer in-process cache under 10k DAU unless shared state is required."
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-green-400 font-medium">Adopted: In-Memory LRU (Reviewer)</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <XCircle className="w-4 h-4" />
                  <span>Minority Report logged for Redis approach if scale increases.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
