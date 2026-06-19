import React, { useState } from 'react';
import { 
  Network, 
  LayoutDashboard, 
  GitPullRequest, 
  History, 
  BrainCircuit, 
  Activity, 
  Settings,
  GitBranch
} from 'lucide-react';
import { AgentOrchestra } from './components/AgentOrchestra';
import { TaskPanel } from './components/TaskPanel';
import { MemoryGraph } from './components/MemoryGraph';
import { ConsensusLog } from './components/ConsensusLog';
import { DebtLedger } from './components/DebtLedger';
import { PRTimeline } from './components/PRTimeline';

function App() {
  const [activeTab, setActiveTab] = useState('orchestra');
  const [repoConnected, setRepoConnected] = useState(false);
  const [taskRunning, setTaskRunning] = useState(false);

  const tabs = [
    { id: 'orchestra', label: 'Agent Orchestra', icon: Network },
    { id: 'memory', label: 'Memory Graph', icon: BrainCircuit },
    { id: 'consensus', label: 'Consensus Log', icon: History },
    { id: 'debt', label: 'Debt Ledger', icon: Activity },
    { id: 'pr', label: 'PR Timeline', icon: GitPullRequest },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-gray-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#13131a] border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-400" />
            AXIOM
          </h1>
          <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wider">Autonomous Engineering</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-lg">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-[#13131a]/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Band SDK Active
            </div>
            <div className="h-4 w-px bg-gray-700"></div>
            <div className="text-sm text-gray-400 font-mono">
              Workspace: {repoConnected ? 'your-organization/axiom' : 'No repo connected'}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!repoConnected ? (
              <button 
                onClick={() => setRepoConnected(true)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                Connect GitHub
              </button>
            ) : (
              <button 
                onClick={() => setRepoConnected(false)}
                className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-md text-sm font-medium"
              >
                <GitBranch className="w-4 h-4" />
                Connected
              </button>
            )}
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Deploy
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 flex gap-6">
          <div className="flex-1 flex flex-col gap-6 h-full min-h-0">
            {activeTab === 'orchestra' && <AgentOrchestra isRunning={taskRunning} />}
            {activeTab === 'memory' && <MemoryGraph />}
            {activeTab === 'consensus' && <ConsensusLog />}
            {activeTab === 'debt' && <DebtLedger />}
            {activeTab === 'pr' && <PRTimeline />}
          </div>

          {/* Right Sidebar - Task Panel */}
          <div className="w-96 flex-shrink-0">
            <TaskPanel 
              repoConnected={repoConnected}
              onRunTask={(running) => setTaskRunning(running)}
              isRunning={taskRunning}
            />
          </div>
        </main>
        
        {/* Background ambient light */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>
    </div>
  );
}

export default App;
