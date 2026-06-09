import React, { useState, useEffect } from 'react';
import { Terminal, Search, Filter, Play, Pause, ChevronDown, ChevronRight, FileJson, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import GeoThreatMap from '../components/GeoThreatMap';

const mockLogs = [
  {
    id: 1,
    "@timestamp": "2026-06-09T22:20:15Z",
    level: "INFO",
    source_system: "Web Server (Nginx)",
    message: '192.168.1.45 - - "GET /api/v1/users HTTP/1.1" 200 450 "-" "Mozilla/5.0"',
    source: { ip: "192.168.1.45" },
    raw: {
      "level": "INFO",
      "host": "web-prod-01",
      "app": "nginx",
      "client_ip": "192.168.1.45",
      "request": "GET /api/v1/users HTTP/1.1",
      "status": 200,
      "bytes": 450,
      "user_agent": "Mozilla/5.0"
    },
    enriched_data: { threat_intel_match: false, country: "US", lat: 37.0, lon: -95.7, actor: "Unknown" }
  },
  {
    id: 2,
    "@timestamp": "2026-06-09T22:20:18Z",
    level: "CRITICAL",
    source_system: "Database (PostgreSQL)",
    message: 'FATAL: password authentication failed for user "postgres"',
    source: { ip: "10.0.0.5" },
    raw: {
      "level": "CRITICAL",
      "host": "db-primary",
      "app": "postgresql",
      "error_code": "28P01",
      "message": "password authentication failed for user \"postgres\"",
      "client_ip": "10.0.0.5"
    },
    enriched_data: { threat_intel_match: true, country: "KP", lat: 40.3, lon: 127.5, actor: "Lazarus Group" }
  },
  {
    id: 3,
    "@timestamp": "2026-06-09T22:20:25Z",
    level: "WARN",
    source_system: "Windows AD",
    message: 'Event ID 4625: An account failed to log on. Account Name: Administrator',
    source: { ip: "198.51.100.44" },
    raw: {
      "level": "WARN",
      "host": "win-dc-01",
      "app": "Security-Auditing",
      "event_id": 4625,
      "task_category": "Logon",
      "account_name": "Administrator",
      "workstation": "KALI-ATTACK-01",
      "src_ip": "198.51.100.44"
    },
    enriched_data: { threat_intel_match: true, country: "CN", lat: 35.8, lon: 104.1, actor: "APT41" }
  },
  {
    id: 4,
    "@timestamp": "2026-06-09T22:20:30Z",
    level: "INFO",
    source_system: "Firewall (Palo Alto)",
    message: 'Session end: 192.168.1.100 -> 8.8.8.8 (port 53) - bytes: 1530',
    source: { ip: "192.168.1.100" },
    raw: {
      "level": "INFO",
      "host": "fw-edge-01",
      "app": "pan-os",
      "action": "allow",
      "src_ip": "192.168.1.100",
      "dst_ip": "8.8.8.8",
      "port": 53,
      "bytes_sent": 765,
      "bytes_received": 765
    },
    enriched_data: { threat_intel_match: true, country: "RU", lat: 61.5, lon: 105.3, actor: "APT28" }
  },
  {
    id: 5,
    "@timestamp": "2026-06-09T22:20:42Z",
    level: "ERROR",
    source_system: "Web App",
    message: 'SQL syntax error: select * from users where id = 1 UNION SELECT 1,2,3',
    source: { ip: "104.244.73.215" },
    raw: {
      "level": "ERROR",
      "host": "web-prod-01",
      "app": "node-backend",
      "error": "SyntaxError: Unexpected token",
      "query": "select * from users where id = 1 UNION SELECT 1,2,3",
      "client_ip": "104.244.73.215"
    },
    enriched_data: { threat_intel_match: true, country: "RU", lat: 61.5, lon: 105.3, actor: "Tor Exit Node" }
  }
];

function LogExplorer() {
  const [logs, setLogs] = useState(mockLogs);
  const [isLiveTail, setIsLiveTail] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const executeActiveResponse = async (log) => {
    try {
        const targetIp = log.raw.client_ip || log.raw.src_ip || 'Unknown Target';
        const response = await fetch('http://localhost:8000/api/active-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target_ip: targetIp, action_type: 'host-isolate', rule_id: log.id.toString() })
        });
        const data = await response.json();
        setToastMessage(`Success: ${data.message}`);
        setTimeout(() => setToastMessage(null), 5000);
    } catch (e) {
        setToastMessage(`Error: Failed to connect to backend API.`);
        setTimeout(() => setToastMessage(null), 5000);
    }
  };

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All Systems");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [timeFilter, setTimeFilter] = useState("Live (Streaming)");

  // Simulated Live Tail
  useEffect(() => {
    if (!isLiveTail) return;
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        "@timestamp": new Date().toISOString().split('.')[0] + 'Z',
        level: ['INFO', 'WARN', 'ERROR', 'INFO', 'INFO'][Math.floor(Math.random() * 5)],
        source_system: 'Syslog (VPN)',
        message: `Connection established for user: testuser from 203.0.113.${Math.floor(Math.random()*255)}`,
        source: { ip: `203.0.113.${Math.floor(Math.random()*255)}` },
        raw: {
           "event": "vpn_login",
           "user": "testuser"
        }
      };
      setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100
    }, 3000);
    return () => clearInterval(interval);
  }, [isLiveTail]);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getLevelBadge = (level) => {
    switch(level) {
      case 'CRITICAL': return <span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-xs font-bold w-full text-center inline-block">CRITICAL</span>;
      case 'ERROR': return <span className="px-2 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded text-xs font-bold w-full text-center inline-block">ERROR</span>;
      case 'WARN': return <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-xs font-bold w-full text-center inline-block">WARN</span>;
      default: return <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs font-bold w-full text-center inline-block">INFO</span>;
    }
  };

  // Filter Logic
  const filteredLogs = logs.filter(log => {
    // 1. Search Filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      log.message.toLowerCase().includes(searchLower) ||
      log.source.toLowerCase().includes(searchLower) ||
      log.level.toLowerCase().includes(searchLower);

    // 2. Level Filter
    const matchesLevel = levelFilter === "All Levels" || log.level === levelFilter;

    // 3. Source Filter
    const matchesSource = sourceFilter === "All Systems" || log.source === sourceFilter;

    return matchesSearch && matchesLevel && matchesSource;
  });

  return (
    <div className="h-full p-4 flex flex-col gap-6 overflow-hidden">
      <header className="flex justify-between items-center glass-panel p-6 shrink-0">
        <div className="flex items-center gap-3">
          <Terminal className="text-siem-primary" size={28} />
          <h1 className="text-2xl font-bold">Live Log Explorer</h1>
        </div>
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-siem-success/20 border border-siem-success/50 text-siem-success px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 z-50">
            <CheckCircle2 size={20} />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
           {isLiveTail && (
             <div className="flex items-center gap-2 text-siem-success text-sm font-semibold animate-pulse mr-4">
               <div className="w-2.5 h-2.5 bg-siem-success rounded-full"></div>
               Receiving Logs...
             </div>
           )}
           <button 
             onClick={() => setIsLiveTail(!isLiveTail)}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isLiveTail ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' 
                           : 'bg-siem-success/10 border-siem-success/20 text-siem-success hover:bg-siem-success/20'
             }`}
           >
             {isLiveTail ? <Pause size={18} /> : <Play size={18} />}
             {isLiveTail ? 'Pause Live Tail' : 'Start Live Tail'}
           </button>
        </div>
      </header>
      
      {/* Geo Map Visualization */}
      <div className="shrink-0">
        <GeoThreatMap logs={logs} />
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-4 shrink-0 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder='Search logs (e.g., "failed password" or "SQL syntax")...' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1F2937] border border-siem-border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-siem-primary transition-colors font-mono text-sm"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 bg-[#1F2937] border border-siem-border rounded-lg text-sm flex-1 relative hover:bg-white/5 transition-colors">
            <Filter size={16} className="text-gray-400 absolute left-3 pointer-events-none" />
            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full bg-transparent text-white appearance-none py-2 pl-8 pr-8 focus:outline-none cursor-pointer"
            >
              <option value="All Systems" className="bg-[#1F2937]">Source: All Systems</option>
              <option value="Syslog (VPN)" className="bg-[#1F2937]">Syslog (VPN)</option>
              <option value="Web Server (Nginx)" className="bg-[#1F2937]">Web Server (Nginx)</option>
              <option value="Database (PostgreSQL)" className="bg-[#1F2937]">Database (PostgreSQL)</option>
              <option value="Windows AD" className="bg-[#1F2937]">Windows AD</option>
              <option value="Firewall (Palo Alto)" className="bg-[#1F2937]">Firewall (Palo Alto)</option>
              <option value="Web App" className="bg-[#1F2937]">Web App</option>
            </select>
            <ChevronDown size={16} className="text-gray-400 absolute right-3 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 px-3 bg-[#1F2937] border border-siem-border rounded-lg text-sm flex-1 relative hover:bg-white/5 transition-colors">
            <Filter size={16} className="text-gray-400 absolute left-3 pointer-events-none" />
            <select 
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full bg-transparent text-white appearance-none py-2 pl-8 pr-8 focus:outline-none cursor-pointer"
            >
              <option value="All Levels" className="bg-[#1F2937]">Level: All Levels</option>
              <option value="INFO" className="bg-[#1F2937]">INFO</option>
              <option value="WARN" className="bg-[#1F2937]">WARN</option>
              <option value="ERROR" className="bg-[#1F2937]">ERROR</option>
              <option value="CRITICAL" className="bg-[#1F2937]">CRITICAL</option>
            </select>
            <ChevronDown size={16} className="text-gray-400 absolute right-3 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 px-3 bg-[#1F2937] border border-siem-border rounded-lg text-sm flex-1 relative hover:bg-white/5 transition-colors">
            <Filter size={16} className="text-gray-400 absolute left-3 pointer-events-none" />
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full bg-transparent text-white appearance-none py-2 pl-8 pr-8 focus:outline-none cursor-pointer"
            >
              <option value="Live (Streaming)" className="bg-[#1F2937]">Time Range: Live (Streaming)</option>
              <option value="Last 15 Minutes" className="bg-[#1F2937]">Last 15 Minutes</option>
              <option value="Last 1 Hour" className="bg-[#1F2937]">Last 1 Hour</option>
              <option value="Last 24 Hours" className="bg-[#1F2937]">Last 24 Hours</option>
            </select>
            <ChevronDown size={16} className="text-gray-400 absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Terminal / Log Grid */}
      <div className="glass-panel flex-1 flex flex-col min-h-0 overflow-hidden bg-[#0A0E17]">
         <div className="overflow-y-auto flex-1 p-2">
           <table className="w-full text-left border-collapse">
             <thead className="sticky top-0 bg-[#0A0E17] z-10 border-b border-siem-border/50">
               <tr>
                 <th className="w-8 p-3"></th>
                 <th className="p-3 font-semibold text-gray-400 text-xs uppercase tracking-wider w-48">Timestamp</th>
                 <th className="p-3 font-semibold text-gray-400 text-xs uppercase tracking-wider w-24">Level</th>
                 <th className="p-3 font-semibold text-gray-400 text-xs uppercase tracking-wider w-48">Host / Source</th>
                 <th className="p-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">Log Message</th>
               </tr>
             </thead>
             <tbody className="font-mono text-sm">
               {filteredLogs.length === 0 ? (
                 <tr>
                   <td colSpan="5" className="p-8 text-center text-gray-400">
                     <div className="flex flex-col items-center justify-center gap-2 mt-8">
                       <AlertCircle size={32} className="text-gray-500 mb-2" />
                       <span className="text-lg font-semibold text-gray-300">No logs found</span>
                       <span>There are no logs matching your current filter criteria.</span>
                     </div>
                   </td>
                 </tr>
               ) : (
                 filteredLogs.map((log) => (
                   <React.Fragment key={log.id}>
                     <tr 
                       onClick={() => toggleRow(log.id)}
                       className={`border-b border-siem-border/30 hover:bg-[#1A2234] transition-colors cursor-pointer ${expandedRow === log.id ? 'bg-[#1A2234]' : ''}`}
                     >
                       <td className="p-3 text-center">
                         {expandedRow === log.id ? <ChevronDown size={16} className="text-gray-400 inline" /> : <ChevronRight size={16} className="text-gray-400 inline" />}
                       </td>
                       <td className="p-3 text-gray-400">{log["@timestamp"]}</td>
                       <td className="p-3">{getLevelBadge(log.level)}</td>
                       <td className="p-3 text-purple-400">{log.source_system}</td>
                       <td className="p-3 text-gray-300 truncate max-w-2xl">{log.message}</td>
                     </tr>
                     {expandedRow === log.id && (
                       <tr className="bg-[#111827]">
                         <td colSpan="5" className="p-0 border-b border-siem-border">
                           <div className="p-4 pl-12 flex flex-col gap-4">
                              <div className="flex gap-4">
                                <FileJson size={20} className="text-siem-primary shrink-0 mt-1" />
                                <pre className="text-xs text-green-400 whitespace-pre-wrap break-all bg-black/30 p-3 rounded-lg border border-gray-800 flex-1">
                                  {JSON.stringify(log.raw, null, 2)}
                                </pre>
                              </div>
                              
                              {/* Wazuh Active Response Integration */}
                              {(log.level === 'CRITICAL' || log.level === 'ERROR') && (
                                <div className="ml-9 border-t border-siem-border/50 pt-4 flex items-center justify-between">
                                  <div className="text-sm text-gray-400">
                                    <span className="text-siem-critical font-bold">High Severity Event</span> - Automated mitigation recommended.
                                  </div>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); executeActiveResponse(log); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-siem-critical/20 text-siem-critical border border-siem-critical/40 hover:bg-siem-critical hover:text-white rounded transition-colors text-sm font-bold"
                                  >
                                    <ShieldAlert size={16} /> Execute Active Response
                                  </button>
                                </div>
                              )}
                           </div>
                         </td>
                       </tr>
                     )}
                   </React.Fragment>
                 ))
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}

export default LogExplorer;
