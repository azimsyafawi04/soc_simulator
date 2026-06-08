import React, { useState } from 'react';
import { Target, Filter, ChevronDown, ChevronRight, ShieldAlert, Globe, Server, Terminal, Lock, Download, ShieldBan, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function AttackAnalysis() {
  const [expandedRow, setExpandedRow] = useState(null);

  const attackData = [
    { time: '10:00', volume: 120 },
    { time: '10:05', volume: 135 },
    { time: '10:10', volume: 250 },
    { time: '10:15', volume: 800 },
    { time: '10:20', volume: 1400 },
    { time: '10:25', volume: 3200 },
    { time: '10:30', volume: 5500 }, 
    { time: '10:35', volume: 4800 },
    { time: '10:40', volume: 1200 },
    { time: '10:45', volume: 300 },
    { time: '10:50', volume: 150 },
    { time: '10:55', volume: 110 },
  ];

  const iocLogs = [
    {
      id: 'EVT-9921',
      timestamp: '2026-06-09 10:32:15',
      severity: 'Critical',
      src: '198.51.100.44',
      dst: '10.0.5.10 (DB-Prod)',
      signature: 'SQL Injection: UNION SELECT pattern',
      payload: "GET /api/v1/users?id=1' UNION SELECT username, password FROM users-- HTTP/1.1\nHost: api.soc.local\nUser-Agent: sqlmap/1.5.8#dev (http://sqlmap.org)\nAccept: */*"
    },
    {
      id: 'EVT-9922',
      timestamp: '2026-06-09 10:28:40',
      severity: 'High',
      src: '203.0.113.102',
      dst: '10.0.2.15 (Web-Front)',
      signature: 'Command Injection / RCE attempt',
      payload: "POST /upload HTTP/1.1\nHost: www.soc.local\nContent-Type: multipart/form-data; boundary=----WebKit\n\n------WebKit\nContent-Disposition: form-data; name=\"file\"; filename=\"shell.php\"\n\n[ SUSPICIOUS FILE UPLOAD DETECTED: shell.php ]\n------WebKit--"
    },
    {
      id: 'EVT-9923',
      timestamp: '2026-06-09 10:21:05',
      severity: 'Medium',
      src: '45.33.32.156',
      dst: '10.0.1.20 (VPN-Gateway)',
      signature: 'Brute Force: Failed SSH login',
      payload: "Failed password for root from 45.33.32.156 port 48122 ssh2\nInvalid user admin from 45.33.32.156 port 48122 ssh2"
    }
  ];

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="h-full p-4 flex flex-col gap-6 overflow-y-auto">
      {/* Header & Control Bar */}
      <header className="flex justify-between items-center glass-panel p-6">
        <div className="flex items-center gap-3">
          <Target className="text-siem-critical" size={28} />
          <h1 className="text-2xl font-bold">Threat Hunting & Attack Analysis</h1>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center bg-[#1F2937] border border-siem-border rounded-lg px-3 py-2">
            <Filter size={16} className="text-gray-400 mr-2" />
            <select className="bg-transparent text-sm text-white focus:outline-none appearance-none pr-4">
              <option>Last 15 Minutes</option>
              <option>Last 1 Hour</option>
              <option>Last 24 Hours</option>
            </select>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
          <div className="flex items-center bg-[#1F2937] border border-siem-border rounded-lg px-3 py-2">
            <input type="text" placeholder="Filter by Source IP..." className="bg-transparent text-sm text-white focus:outline-none w-40" />
          </div>
          <div className="flex items-center bg-[#1F2937] border border-siem-border rounded-lg px-3 py-2">
            <select className="bg-transparent text-sm text-white focus:outline-none appearance-none pr-4">
              <option>All Threat Types</option>
              <option>DDoS</option>
              <option>SQL Injection</option>
              <option>Brute Force</option>
            </select>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>
      </header>

      {/* Interactive Attack Timeline */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="text-siem-warning" size={20} />
            Event Volume Over Time (Anomaly Detection)
          </h2>
          <span className="px-3 py-1 bg-siem-critical/20 border border-siem-critical/30 text-siem-critical text-xs font-bold rounded-full animate-pulse">
            ACTIVE ATTACK DETECTED
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attackData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                itemStyle={{ color: '#ef4444' }}
              />
              <Area type="monotone" dataKey="volume" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Context & MITRE Cards */}
      <div className="grid grid-cols-2 gap-6">
        {/* Attacker Profile */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Globe className="text-siem-primary" size={20} />
            Attacker Profile & Origin
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded border border-siem-border">
              <span className="text-gray-400 text-sm">Top Source IP</span>
              <span className="font-mono font-bold text-siem-critical">198.51.100.44</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded border border-siem-border">
              <span className="text-gray-400 text-sm">Geographic Origin</span>
              <span className="font-bold flex items-center gap-2">
                🇷🇺 Russian Federation
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded border border-siem-border">
              <span className="text-gray-400 text-sm">Target Asset</span>
              <span className="font-bold flex items-center gap-2 text-blue-400">
                <Server size={14} /> api.soc.local (DB-Prod)
              </span>
            </div>
          </div>
        </div>

        {/* MITRE ATT&CK */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ShieldAlert className="text-purple-400" size={20} />
            MITRE ATT&CK Context
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
              <div className="text-xs text-purple-400 font-bold mb-1">INITIAL ACCESS</div>
              <div className="text-sm font-semibold">T1190 - Exploit Public-Facing App</div>
            </div>
            <div className="p-3 bg-siem-critical/10 border border-siem-critical/30 rounded">
              <div className="text-xs text-siem-critical font-bold mb-1">EXECUTION</div>
              <div className="text-sm font-semibold">T1059 - Command & Scripting</div>
            </div>
            <div className="p-3 bg-siem-warning/10 border border-siem-warning/30 rounded">
              <div className="text-xs text-siem-warning font-bold mb-1">CREDENTIAL ACCESS</div>
              <div className="text-sm font-semibold">T1110 - Brute Force</div>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
              <div className="text-xs text-blue-400 font-bold mb-1">IMPACT</div>
              <div className="text-sm font-semibold">T1498 - Network DoS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Payload & IOC Inspection Table */}
      <div className="glass-panel p-6 flex-1 flex flex-col">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Terminal className="text-gray-300" size={20} />
          Raw Payload & IOC Inspection
        </h2>
        <div className="border border-siem-border rounded-lg overflow-hidden flex-1">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-siem-border">
              <tr>
                <th className="p-4 font-semibold text-gray-300 w-10"></th>
                <th className="p-4 font-semibold text-gray-300">Timestamp</th>
                <th className="p-4 font-semibold text-gray-300">Severity</th>
                <th className="p-4 font-semibold text-gray-300">Source → Dest</th>
                <th className="p-4 font-semibold text-gray-300">Attack Signature</th>
              </tr>
            </thead>
            <tbody>
              {iocLogs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr 
                    className="border-b border-siem-border hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => toggleRow(log.id)}
                  >
                    <td className="p-4 text-center">
                      <ChevronRight size={16} className={`text-gray-400 transition-transform ${expandedRow === log.id ? 'rotate-90' : ''}`} />
                    </td>
                    <td className="p-4 text-sm font-mono text-gray-400">{log.timestamp}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        log.severity === 'Critical' ? 'bg-siem-critical/20 text-siem-critical border-siem-critical/30' :
                        log.severity === 'High' ? 'bg-siem-warning/20 text-siem-warning border-siem-warning/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <span className="font-mono text-gray-300">{log.src}</span>
                      <span className="mx-2 text-gray-500">→</span>
                      <span className="font-mono text-gray-300">{log.dst}</span>
                    </td>
                    <td className="p-4 font-medium text-sm text-gray-200">{log.signature}</td>
                  </tr>
                  
                  {/* Expanded Row */}
                  {expandedRow === log.id && (
                    <tr className="bg-[#111827] border-b border-siem-border">
                      <td colSpan="5" className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Raw Network Payload</h4>
                          <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded text-xs font-semibold transition-colors">
                              <Download size={14} /> Export PCAP
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-siem-critical/10 text-siem-critical border border-siem-critical/30 hover:bg-siem-critical/20 rounded text-xs font-bold transition-colors">
                              <ShieldBan size={14} /> Block IP
                            </button>
                          </div>
                        </div>
                        <div className="bg-[#0D1117] p-4 rounded border border-gray-800 font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
                          {log.payload}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttackAnalysis;
