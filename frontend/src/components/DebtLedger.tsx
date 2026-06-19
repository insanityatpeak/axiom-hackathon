import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';

const data = [
  { sprint: 'Sprint 41', debt: 120, interest: 10, resolved: 30 },
  { sprint: 'Sprint 42', debt: 100, interest: 12, resolved: 40 },
  { sprint: 'Sprint 43', debt: 72, interest: 8, resolved: 50 },
  { sprint: 'Sprint 44', debt: 90, interest: 15, resolved: 20 },
  { sprint: 'Sprint 45', debt: 65, interest: 7, resolved: 45 },
  { sprint: 'Sprint 46 (Current)', debt: 45, interest: 5, resolved: 35 },
];

const openDebtItems = [
  { id: 'TD-092', component: 'Auth Middleware', principal: '12h', interest: 'High', projected: '36h in 6mo', trend: 'up' },
  { id: 'TD-104', component: 'Legacy Upload Handler', principal: '8h', interest: 'Med', projected: '14h in 6mo', trend: 'stable' },
  { id: 'TD-112', component: 'Redundant CSS Tokens', principal: '4h', interest: 'Low', projected: '5h in 6mo', trend: 'down' },
];

export function DebtLedger() {
  return (
    <div className="glass-panel flex-1 flex flex-col p-6 overflow-hidden">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-400" />
            Technical Debt Ledger
          </h2>
          <p className="text-sm text-gray-400 mt-1">Compound interest model for repository health</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 px-4">
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Principal</div>
            <div className="text-2xl font-bold text-gray-200">45<span className="text-sm text-gray-500 font-normal">hrs</span></div>
          </div>
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 px-4">
            <div className="text-xs text-orange-500/70 uppercase font-bold tracking-wider">Accrued Interest</div>
            <div className="text-2xl font-bold text-orange-400">+5<span className="text-sm text-orange-500/70 font-normal">hrs/mo</span></div>
          </div>
        </div>
      </div>

      <div className="h-64 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="sprint" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
              itemStyle={{ color: '#f3f4f6' }}
            />
            <Area type="monotone" dataKey="debt" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorDebt)" name="Active Debt (hrs)" />
            <Area type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved (hrs)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 overflow-auto">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Prioritized Liabilities</h3>
        <div className="space-y-3">
          {openDebtItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${item.interest === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-800 text-gray-400'}`}>
                  {item.interest === 'High' ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500">{item.id}</span>
                    <span className="font-semibold text-gray-200">{item.component}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex gap-4">
                    <span>Principal: <strong className="text-gray-300">{item.principal}</strong></span>
                    <span>Projected: <strong className="text-red-400">{item.projected}</strong></span>
                  </div>
                </div>
              </div>
              <div>
                <button className="px-3 py-1.5 rounded bg-indigo-600/20 text-indigo-400 text-xs font-semibold hover:bg-indigo-600/30 transition-colors border border-indigo-500/20">
                  Refactor Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
