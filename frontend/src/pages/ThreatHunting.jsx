import React, { useState, useMemo } from 'react';
import { Radar, Search, Activity, Target, Crosshair, AlertOctagon, CheckCircle2, ShieldAlert, BarChart3, ListTree, Database, Share2, Filter, ChevronRight, Zap, X, Terminal as TerminalIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function ThreatHunting() {
  const [huntModel, setHuntModel] = useState('Hypothesis-Driven');
  const [tactic, setTactic] = useState('Execution');
  const [technique, setTechnique] = useState('Command and Scripting Interpreter');
  const [showResults, setShowResults] = useState(false);
  const [activeTechnique, setActiveTechnique] = useState(null);

  // --- NEW: Long Tail Analysis State ---
  const [dataSource, setDataSource] = useState('Windows Event Logs');

  // --- NEW: Investigate Modal State ---
  const [investigateItem, setInvestigateItem] = useState(null); // stores { name, count, etc }
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic Mock Data Generator based on selected Data Source
  const getStackData = (source) => {
    let data = [];
    switch (source) {
      case 'Windows Event Logs':
        data = [
          { name: 'svchost.exe', count: 1420 },
          { name: 'explorer.exe', count: 850 },
          { name: 'taskhostw.exe', count: 210 },
          { name: 'wmic.exe', count: 45 },
          { name: 'powershell.exe', count: 12 },
          { name: 'C:\\Temp\\win_update.exe', count: 2 },
          { name: 'C:\\Users\\Public\\psexec.exe', count: 1 }
        ];
        break;
      case 'Firewall':
        data = [
          { name: 'Port 443 (HTTPS)', count: 50400 },
          { name: 'Port 80 (HTTP)', count: 23100 },
          { name: 'Port 53 (DNS)', count: 9400 },
          { name: 'Port 123 (NTP)', count: 1200 },
          { name: 'Port 22 (SSH)', count: 300 },
          { name: 'Port 3389 (RDP)', count: 45 },
          { name: 'Port 4444 (Meterpreter)', count: 3 },
          { name: 'Port 6667 (IRC)', count: 1 }
        ];
        break;
      case 'Web Proxy':
        data = [
          { name: 'google.com', count: 85000 },
          { name: 'microsoft.com', count: 62000 },
          { name: 'amazon.com', count: 14000 },
          { name: 'github.com', count: 5300 },
          { name: 'api.slack.com', count: 2100 },
          { name: 'http://103.45.x.x/payload.ps1', count: 4 },
          { name: 'http://45.33.x.x/c2/checkin', count: 2 }
        ];
        break;
      case 'Host-Based IPS':
      case 'Data Loss Protection':
      case 'Rogue System Detection':
      case 'Virus Engine':
      case 'Network Appliances':
      case 'Web Server':
      default:
        data = [
          { name: 'Standard Event A', count: 5000 },
          { name: 'Standard Event B', count: 3000 },
          { name: 'Standard Event C', count: 1000 },
          { name: 'Rare Event X', count: 5 },
          { name: 'Anomalous Event Y', count: 1 }
        ];
        break;
    }
    
    // Sort descending to create the "Long Tail" effect
    return data.sort((a, b) => b.count - a.count);
  };

  const stackData = useMemo(() => getStackData(dataSource), [dataSource]);

  const handleExecute = (tech) => {
    setActiveTechnique(tech);
    setShowResults(true);
  };

  // Recharts onClick handler
  const handleBarClick = (data) => {
    if (data && data.name) {
      setInvestigateItem(data);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="h-full p-4 flex flex-col gap-6 overflow-y-auto relative">
      {/* Header */}
      <header className="flex justify-between items-center glass-panel p-6">
        <div className="flex items-center gap-3">
          <Radar className="text-siem-primary" size={28} />
          <h1 className="text-2xl font-bold">Threat Hunter Workspace</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-siem-primary/20 text-siem-primary border border-siem-primary/30 rounded text-sm font-bold tracking-wide">
            L3 ANALYST MODE
          </span>
        </div>
      </header>

      {/* Main Layout - 3 Phases */}
      <div className="flex flex-col xl:flex-row gap-6 flex-1">
        
        {/* Left Column: Planning & Execution */}
        <div className="flex flex-col gap-6 flex-1 xl:w-2/3">
          
          {/* Phase 1: Planning */}
          <div className="glass-panel p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-siem-border pb-3">
              <Target className="text-siem-primary" size={20} />
              <h2 className="text-xl font-semibold">Phase 1: Planning (Hypothesis Builder)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-400">Hunt Model</label>
                <select 
                  value={huntModel}
                  onChange={(e) => setHuntModel(e.target.value)}
                  className="p-3 bg-[#1F2937] border border-siem-border rounded-lg text-white focus:outline-none focus:border-siem-primary transition-colors"
                >
                  <option>Hypothesis-Driven</option>
                  <option>Intel-Driven (IOCs)</option>
                  <option>Baseline / Anomaly</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-siem-border rounded-lg mt-2">
              <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Hypothesis Construction</h3>
              <div className="flex flex-wrap items-center gap-3 text-lg">
                <span>An adversary achieved</span>
                <select 
                  value={tactic}
                  onChange={(e) => setTactic(e.target.value)}
                  className="p-2 bg-siem-primary/10 border border-siem-primary/30 text-siem-primary font-semibold rounded focus:outline-none"
                >
                  <option>Initial Access</option>
                  <option>Execution</option>
                  <option>Persistence</option>
                  <option>Defense Evasion</option>
                  <option>Credential Access</option>
                </select>
                <span>via</span>
                <select 
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value)}
                  className="p-2 bg-siem-critical/10 border border-siem-critical/30 text-siem-critical font-semibold rounded focus:outline-none"
                >
                  <option>Command and Scripting Interpreter</option>
                  <option>Scheduled Task/Job</option>
                  <option>Valid Accounts</option>
                  <option>Phishing</option>
                </select>
                <span>.</span>
              </div>
            </div>
          </div>

          {/* Phase 2: Execution */}
          <div className="glass-panel p-6 flex flex-col gap-5 flex-1">
            <div className="flex items-center gap-2 border-b border-siem-border pb-3">
              <Activity className="text-blue-400" size={20} />
              <h2 className="text-xl font-semibold">Phase 2: Execution & Analytics</h2>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => handleExecute('Indicator Search')}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition-all ${
                  activeTechnique === 'Indicator Search' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-[#1F2937] border-siem-border text-gray-300 hover:bg-white/5'
                }`}
              >
                <Search size={18} /> Indicator Search
              </button>
              <button 
                onClick={() => handleExecute('Stack Counting')}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition-all ${
                  activeTechnique === 'Stack Counting' ? 'bg-siem-primary/20 border-siem-primary text-siem-primary' : 'bg-[#1F2937] border-siem-border text-gray-300 hover:bg-white/5'
                }`}
              >
                <BarChart3 size={18} /> Long Tail Analysis
              </button>
              <button 
                onClick={() => handleExecute('Clustering')}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition-all ${
                  activeTechnique === 'Clustering' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-[#1F2937] border-siem-border text-gray-300 hover:bg-white/5'
                }`}
              >
                <Database size={18} /> Data Clustering
              </button>
            </div>

            {/* Execution Results: Long Tail Analysis */}
            {showResults && activeTechnique === 'Stack Counting' && (
              <div className="mt-4 flex flex-col gap-6 animate-in fade-in duration-500">
                
                {/* Data Source Selector */}
                <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-siem-border">
                  <Database size={20} className="text-gray-400" />
                  <div className="flex flex-col flex-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Data Source</label>
                    <select 
                      value={dataSource}
                      onChange={(e) => setDataSource(e.target.value)}
                      className="bg-transparent text-white font-medium focus:outline-none text-lg border-b border-gray-600 pb-1 mt-1 cursor-pointer w-max"
                    >
                      <option className="bg-[#111827]">Windows Event Logs</option>
                      <option className="bg-[#111827]">Firewall</option>
                      <option className="bg-[#111827]">Web Proxy</option>
                      <option className="bg-[#111827]">Host-Based IPS</option>
                      <option className="bg-[#111827]">Data Loss Protection</option>
                      <option className="bg-[#111827]">Rogue System Detection</option>
                      <option className="bg-[#111827]">Virus Engine</option>
                      <option className="bg-[#111827]">Network Appliances</option>
                      <option className="bg-[#111827]">Web Server</option>
                    </select>
                  </div>
                </div>

                {/* Vertical Bar Chart */}
                <div className="p-4 bg-black/20 rounded-lg border border-siem-border">
                  <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                    <Filter size={16}/> Long Tail Distribution (Click a bar to investigate)
                  </h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stackData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9CA3AF" 
                          angle={-15} 
                          textAnchor="end" 
                          tick={{ fontSize: 11 }} 
                          interval={0}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                          cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        />
                        <Bar 
                          dataKey="count" 
                          radius={[4, 4, 0, 0]} 
                          onClick={handleBarClick}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          {stackData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.count < 50 ? '#EF4444' : '#3B82F6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="border border-siem-border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 border-b border-siem-border">
                      <tr>
                        <th className="p-3 font-semibold text-gray-300">Aggregated Item</th>
                        <th className="p-3 font-semibold text-gray-300">Occurrences</th>
                        <th className="p-3 font-semibold text-gray-300">Anomaly Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stackData.map((row, idx) => (
                        <tr key={idx} className="border-b border-siem-border/50 hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono text-gray-300">{row.name}</td>
                          <td className="p-3 font-medium">{row.count}</td>
                          <td className="p-3">
                            {row.count < 50 ? (
                              <span className="px-2 py-1 bg-siem-critical/20 text-siem-critical rounded text-xs font-bold border border-siem-critical/30 flex items-center gap-1 w-max">
                                <AlertOctagon size={12}/> High
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-bold border border-gray-600 w-max inline-block">
                                Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {showResults && activeTechnique !== 'Stack Counting' && (
              <div className="mt-4 p-8 border border-siem-border border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500">
                <Share2 size={48} className="mb-4 opacity-50" />
                <p>Run a query to display analytics for <strong>{activeTechnique}</strong>.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Action */}
        <div className="xl:w-1/3 flex flex-col gap-6">
          <div className="glass-panel p-6 flex flex-col gap-5 h-full">
            <div className="flex items-center gap-2 border-b border-siem-border pb-3">
              <Zap className="text-siem-warning" size={20} />
              <h2 className="text-xl font-semibold">Phase 3: Action</h2>
            </div>

            <p className="text-sm text-gray-400">
              Upon identifying an anomaly or confirming a hypothesis, select an appropriate resolution action to operationalize your findings.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <button 
                disabled={!showResults}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all text-left ${
                  showResults ? 'bg-[#1F2937] border-siem-border hover:border-siem-primary hover:bg-white/5 cursor-pointer' : 'opacity-50 cursor-not-allowed border-transparent bg-black/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-siem-primary/20 text-siem-primary rounded-full">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Convert to Detection Rule</h3>
                    <p className="text-xs text-gray-400 mt-1">Automate future detections.</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-500" />
              </button>

              <button 
                disabled={!showResults}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all text-left ${
                  showResults ? 'bg-[#1F2937] border-siem-border hover:border-blue-500 hover:bg-white/5 cursor-pointer' : 'opacity-50 cursor-not-allowed border-transparent bg-black/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-full">
                    <ListTree size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Document Findings</h3>
                    <p className="text-xs text-gray-400 mt-1">Append to ISMS Report & Baseline.</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-500" />
              </button>

              <button 
                disabled={!showResults}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all text-left ${
                  showResults ? 'bg-siem-critical/10 border-siem-critical/30 hover:border-siem-critical hover:bg-siem-critical/20 cursor-pointer' : 'opacity-50 cursor-not-allowed border-transparent bg-black/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-siem-critical/20 text-siem-critical rounded-full">
                    <AlertOctagon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Escalate to Incident</h3>
                    <p className="text-xs text-siem-critical/70 mt-1">Trigger immediate IR Playbooks.</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-siem-critical/50" />
              </button>
            </div>
            
            <div className="mt-auto pt-6 border-t border-siem-border/50">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 size={16} className="text-siem-success" />
                <span>Workspace synced with backend cluster.</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* --- NEW: Investigate Modal --- */}
      {isModalOpen && investigateItem && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-siem-border rounded-xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden transform transition-all">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#1F2937] border-b border-siem-border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Search className="text-siem-primary" size={24} />
                <h2 className="text-xl font-bold text-white">Investigation: Raw Logs for "{investigateItem.name}"</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body: Terminal View */}
            <div className="p-6 bg-black flex-1 overflow-y-auto font-mono text-sm border-b border-siem-border">
              <div className="flex items-center gap-2 text-gray-500 mb-4 select-none">
                <TerminalIcon size={16} />
                <span>root@siem-cluster:~# elasticsearch-sql-cli "SELECT * FROM siem-logs WHERE aggregated_field = '{investigateItem.name}' LIMIT 2"</span>
              </div>
              
              <div className="space-y-4 text-green-400">
                {/* Mock JSON Logs generated dynamically */}
                <pre className="whitespace-pre-wrap break-all bg-[#0a0a0a] p-4 rounded border border-gray-800">
{JSON.stringify({
  "@timestamp": new Date().toISOString(),
  "event.dataset": dataSource.toLowerCase().replace(/ /g, '_'),
  "source.ip": `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  "indicator.value": investigateItem.name,
  "event.outcome": "success",
  "threat.framework": "MITRE ATT&CK",
  "message": `Detected anomalous interaction matching signature for ${investigateItem.name}`
}, null, 2)}
                </pre>
                
                {investigateItem.count > 1 && (
                  <pre className="whitespace-pre-wrap break-all bg-[#0a0a0a] p-4 rounded border border-gray-800">
{JSON.stringify({
  "@timestamp": new Date(Date.now() - 5000).toISOString(),
  "event.dataset": dataSource.toLowerCase().replace(/ /g, '_'),
  "source.ip": `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  "indicator.value": investigateItem.name,
  "event.outcome": "success",
  "threat.framework": "MITRE ATT&CK",
  "message": `Detected anomalous interaction matching signature for ${investigateItem.name}`
}, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            {/* Modal Footer: Actions */}
            <div className="p-5 bg-[#1F2937] flex justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 border border-siem-border text-gray-300 rounded hover:bg-white/5 transition-colors font-medium"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  alert(`Added ${investigateItem.name} to IOC Blocklist.`);
                  setIsModalOpen(false);
                }}
                className="flex items-center gap-2 px-5 py-2 bg-siem-primary text-white rounded hover:bg-blue-600 transition-colors font-medium"
              >
                <ShieldAlert size={18} /> Add to IOC Blocklist
              </button>
              <button 
                onClick={() => {
                  alert(`Incident escalated regarding ${investigateItem.name}.`);
                  setIsModalOpen(false);
                }}
                className="flex items-center gap-2 px-5 py-2 bg-siem-critical text-white rounded hover:bg-red-600 transition-colors font-medium"
              >
                <AlertOctagon size={18} /> Escalate to Incident
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreatHunting;
