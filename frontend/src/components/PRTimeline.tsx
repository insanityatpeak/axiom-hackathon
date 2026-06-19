import React from 'react';
import { GitPullRequest, GitMerge, FileDiff, ShieldCheck, CheckCircle, RefreshCcw } from 'lucide-react';

export function PRTimeline() {
  return (
    <div className="glass-panel flex-1 flex flex-col p-6 overflow-hidden">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <GitPullRequest className="w-6 h-6 text-green-400" />
            Auto-Generated Pull Request
          </h2>
          <p className="text-sm text-gray-400 mt-1">End-to-end trace of AXIOM feature implementation</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold flex items-center gap-2">
          <GitMerge className="w-4 h-4" /> Ready to Merge
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-2">
        <div className="bg-gray-900/80 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-200 mb-2">feat(api): Add token-bucket rate limiting to /api/upload</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-3xl">
            This PR introduces a Redis-backed token-bucket rate limiter for the upload endpoint. 
            Implemented via middleware to restrict users to 60 requests/minute. 
            Includes mutation-tested unit suite and OpenAPI spec updates.
          </p>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-700 before:to-transparent">
            
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border-2 border-indigo-500 text-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <FileDiff className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-800 bg-gray-950/80 shadow-sm">
                <div className="font-bold text-gray-300 flex justify-between items-center mb-1">
                  Code Synthesis
                  <span className="text-xs font-mono text-gray-500">+142 -12 lines</span>
                </div>
                <div className="text-xs text-gray-400">
                  <ul className="list-disc list-inside space-y-1">
                    <li>src/middleware/rateLimit.ts</li>
                    <li>src/routes/upload.ts</li>
                    <li>src/config/redis.ts</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border-2 border-pink-500 text-pink-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <RefreshCcw className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-800 bg-gray-950/80 shadow-sm">
                <div className="font-bold text-gray-300 flex justify-between items-center mb-1">
                  Test Intelligence
                  <span className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-400">Mutations: 87%</span>
                </div>
                <div className="text-xs text-gray-400">
                  Generated 14 unit tests, 2 integration tests. Mutation score 87%. Coverage +4.2% overall.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border-2 border-cyan-500 text-cyan-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-800 bg-gray-950/80 shadow-sm">
                <div className="font-bold text-gray-300 flex justify-between items-center mb-1">
                  Security Sentinel
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">0 Findings</span>
                </div>
                <div className="text-xs text-gray-400">
                  Architecture-aware threat model clear. No taint propagation vectors detected on new surface.
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 text-green-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-green-500/30 bg-green-900/10 shadow-sm">
                <div className="font-bold text-green-400 flex justify-between items-center mb-1">
                  Release Readiness
                  <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-mono">94 / 100</span>
                </div>
                <div className="text-xs text-gray-400">
                  CI Pipeline green. Impact-scoped tests complete (4.2s runtime). Documentation updated.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
