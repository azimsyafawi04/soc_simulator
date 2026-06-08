import React from 'react';
import { Server, Activity, ShieldAlert, Cpu, HardDrive, TerminalSquare, Search, ShieldX } from 'lucide-react';

function Endpoints() {
  const assets = [
    { id: 1, hostname: 'WIN-DC-01', os: 'Windows Server 2022', ip: '10.0.0.5', status: 'Online', cpu: 45, ram: 60, alerts: 2 },
    { id: 2, hostname: 'WEB-PROD-01', os: 'Ubuntu Server 22.04', ip: '192.168.1.45', status: 'Online', cpu: 78, ram: 85, alerts: 14 },
    { id: 3, hostname: 'KALI-ATTACK-01', os: 'Kali Linux', ip: '192.168.1.100', status: 'Online', cpu: 15, ram: 30, alerts: 0 },
    { id: 4, hostname: 'USER-LAPTOP-12', os: 'Windows 10', ip: '10.0.1.55', status: 'Offline', cpu: 0, ram: 0, alerts: 0 },
    { id: 5, hostname: 'DB-PRIMARY', os: 'Ubuntu Server 22.04', ip: '192.168.1.50', status: 'Online', cpu: 32, ram: 45, alerts: 1 }
  ];

  return (
    <div className="h-full p-4 flex flex-col gap-6 overflow-y-auto">
      <header className="flex justify-between items-center glass-panel p-6">
        <div className="flex items-center gap-3">
          <Server className="text-siem-primary" size={28} />
          <h1 className="text-2xl font-bold">Endpoints Management</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search hostname or IP..." 
            className="pl-10 pr-4 py-2 bg-[#1F2937] border border-siem-border rounded-lg text-sm text-white focus:outline-none focus:border-siem-primary w-64"
          />
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
          <div>
            <h3 className="text-gray-400 text-sm">Total Endpoints</h3>
            <p className="text-3xl font-bold mt-2">5</p>
          </div>
          <Server className="text-siem-primary opacity-50" size={40} />
        </div>
        <div className="glass-panel p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
          <div>
            <h3 className="text-gray-400 text-sm">Online Agents</h3>
            <p className="text-3xl font-bold text-siem-success mt-2">4</p>
          </div>
          <Activity className="text-siem-success opacity-50" size={40} />
        </div>
        <div className="glass-panel p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
          <div>
            <h3 className="text-gray-400 text-sm">Offline Agents</h3>
            <p className="text-3xl font-bold text-gray-500 mt-2">1</p>
          </div>
          <Server className="text-gray-500 opacity-50" size={40} />
        </div>
        <div className="glass-panel p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
          <div>
            <h3 className="text-gray-400 text-sm">Hosts with Alerts</h3>
            <p className="text-3xl font-bold text-siem-critical mt-2">3</p>
          </div>
          <ShieldAlert className="text-siem-critical opacity-50" size={40} />
        </div>
      </div>
      
      {/* Asset Inventory Table */}
      <div className="glass-panel flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-siem-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Monitored Assets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-siem-border">
              <tr>
                <th className="p-4 font-semibold text-gray-300">Hostname</th>
                <th className="p-4 font-semibold text-gray-300">OS</th>
                <th className="p-4 font-semibold text-gray-300">IP Address</th>
                <th className="p-4 font-semibold text-gray-300">Status</th>
                <th className="p-4 font-semibold text-gray-300 w-48">CPU & RAM</th>
                <th className="p-4 font-semibold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className="border-b border-siem-border hover:bg-white/5 transition-colors group">
                  <td className="p-4 font-medium flex items-center gap-3">
                    <TerminalSquare size={18} className={asset.status === 'Online' ? 'text-siem-primary' : 'text-gray-500'} />
                    {asset.hostname}
                    {asset.alerts > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-siem-critical/20 text-siem-critical text-xs rounded font-bold border border-siem-critical/30">
                        {asset.alerts} Alerts
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{asset.os}</td>
                  <td className="p-4 font-mono text-sm">{asset.ip}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-2 text-sm font-semibold ${asset.status === 'Online' ? 'text-siem-success' : 'text-gray-500'}`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${asset.status === 'Online' ? 'bg-siem-success animate-pulse' : 'bg-gray-500'}`}></div>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {asset.status === 'Online' ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Cpu size={12} className="text-gray-400" />
                          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full ${asset.cpu > 70 ? 'bg-siem-critical' : 'bg-siem-primary'}`} style={{ width: `${asset.cpu}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{asset.cpu}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HardDrive size={12} className="text-gray-400" />
                          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full ${asset.ram > 80 ? 'bg-siem-critical' : 'bg-siem-warning'}`} style={{ width: `${asset.ram}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{asset.ram}%</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="px-3 py-1 bg-siem-primary/10 border border-siem-primary/30 text-siem-primary text-xs rounded hover:bg-siem-primary hover:text-white transition-colors"
                        onClick={() => window.alert(`Fetching logs for ${asset.hostname}...`)}
                      >
                        View Logs
                      </button>
                      <button 
                        className="flex items-center gap-1 px-3 py-1 bg-siem-critical/10 border border-siem-critical/30 text-siem-critical text-xs rounded hover:bg-siem-critical hover:text-white transition-colors"
                        onClick={() => window.alert(`Isolating host ${asset.hostname} from network!`)}
                      >
                        <ShieldX size={12} /> Isolate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Endpoints;
