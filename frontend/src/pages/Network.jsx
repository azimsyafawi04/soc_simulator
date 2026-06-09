import React, { useState } from 'react';
import { Globe, Activity, ArrowDownToLine, ShieldX, Server, ArrowRightLeft, ChevronDown, Clock, HardDrive, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

function Network() {
  const [selectedTenant, setSelectedTenant] = useState('All Systems (Global)');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tenants = [
    "All Systems (Global)",
    "Client A: E-Commerce Web Server",
    "Client B: Corporate Office LAN"
  ];

  const trafficData = [
    { time: '00:00', traffic: 120 },
    { time: '01:00', traffic: 150 },
    { time: '02:00', traffic: 130 },
    { time: '03:00', traffic: 900 }, // Spike!
    { time: '04:00', traffic: 180 },
    { time: '05:00', traffic: 160 },
    { time: '06:00', traffic: 200 },
    { time: '07:00', traffic: 850 }, // Spike!
    { time: '08:00', traffic: 220 },
    { time: '09:00', traffic: 250 },
    { time: '10:00', traffic: 300 },
  ];

  const protocolData = [
    { name: 'TCP', value: 75, color: '#3B82F6' },
    { name: 'UDP', value: 20, color: '#10B981' },
    { name: 'ICMP', value: 5, color: '#EF4444' }
  ];

  const geoData = [
    { country: 'United States', value: 4500, color: '#3B82F6' },
    { country: 'Russia', value: 3200, color: '#EF4444' },
    { country: 'China', value: 2800, color: '#F59E0B' },
    { country: 'Local (LAN)', value: 1500, color: '#10B981' },
    { country: 'Germany', value: 800, color: '#8B5CF6' }
  ];

  const flowData = [
    { id: 1, src: '192.168.1.45', dst: '10.0.0.5', port: 443, protocol: 'TCP', bytes: '1.2 GB', status: 'Normal' },
    { id: 2, src: '10.0.0.5', dst: '192.168.1.100', port: 3389, protocol: 'TCP', bytes: '850 MB', status: 'Review Needed' },
    { id: 3, src: '192.168.1.100', dst: '8.8.8.8', port: 53, protocol: 'UDP', bytes: '15 MB', status: 'Normal' },
    { id: 4, src: '10.0.1.55', dst: '192.168.1.45', port: 80, protocol: 'TCP', bytes: '4.5 GB', status: 'Anomaly Detected' },
    { id: 5, src: '10.0.2.10', dst: '192.168.1.1', port: 0, protocol: 'ICMP', bytes: '500 KB', status: 'Review Needed' },
  ];

  return (
    <div className="h-full p-4 flex flex-col gap-6 overflow-y-auto">
      <header className="flex justify-between items-center glass-panel p-6 relative">
        <div className="flex items-center gap-3">
          <Globe className="text-siem-primary" size={28} />
          <h1 className="text-2xl font-bold">Network Traffic Analysis</h1>
          
          {/* MSSP Multi-Tenancy Dropdown */}
          <div className="relative ml-6">
             <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1F2937] border border-siem-border rounded-lg text-sm hover:bg-white/5 transition-colors"
             >
                <Server size={16} className="text-siem-primary" />
                {selectedTenant}
                <ChevronDown size={16} className="text-gray-400" />
             </button>
             {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#1F2937] border border-siem-border rounded-lg shadow-xl z-50 overflow-hidden">
                   {tenants.map(tenant => (
                      <button 
                         key={tenant}
                         onClick={() => { setSelectedTenant(tenant); setIsDropdownOpen(false); }}
                         className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors border-b border-siem-border last:border-0"
                      >
                         {tenant}
                      </button>
                   ))}
                </div>
             )}
          </div>
        </div>
        <div className="flex gap-4">
           <button className="px-4 py-2 bg-[#1F2937] border border-siem-border text-white rounded hover:bg-white/5 transition-colors">
            Export PCAP
          </button>
          <div className="px-4 py-2 bg-siem-primary/20 text-siem-primary rounded flex items-center gap-2">
            <div className="w-2 h-2 bg-siem-primary rounded-full animate-pulse"></div>
            Live Capture ON
          </div>
        </div>
      </header>
      
      {/* Overview Cards (Updated for Client-Specific Metrics) */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-full">
            <h3 className="text-gray-400 text-sm">System Uptime</h3>
            <p className="text-3xl font-bold text-white mt-2">99.98%</p>
            <p className="text-xs text-siem-success mt-1 flex items-center gap-1"><CheckCircle2 size={12}/> SLA Status: Healthy</p>
          </div>
          <Clock className="text-siem-primary opacity-50 absolute right-6 top-8" size={40} />
        </div>

        <div className="glass-panel p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-full">
            <h3 className="text-gray-400 text-sm">Bandwidth Usage</h3>
            <p className="text-3xl font-bold text-siem-primary mt-2">42.5 <span className="text-sm text-gray-400">/ 500 GB</span></p>
            <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-siem-primary h-full w-[8.5%]"></div>
            </div>
          </div>
          <HardDrive className="text-siem-primary opacity-50 absolute right-6 top-8" size={40} />
        </div>

        <div className="glass-panel p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-full">
            <h3 className="text-gray-400 text-sm">Active Connections</h3>
            <p className="text-3xl font-bold text-siem-success mt-2">1,245</p>
          </div>
          <Activity className="text-siem-success opacity-50 absolute right-6 top-8" size={40} />
        </div>

        <div className="glass-panel p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-full">
            <h3 className="text-gray-400 text-sm">Dropped (FW)</h3>
            <p className="text-3xl font-bold text-siem-critical mt-2">8,932</p>
          </div>
          <ShieldX className="text-siem-critical opacity-50 absolute right-6 top-8" size={40} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-4 gap-6 h-80">
        <div className="glass-panel p-6 col-span-2 flex flex-col">
          <h3 className="text-lg font-bold mb-4">Network Traffic Over Time</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Area type="monotone" dataKey="traffic" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Geo-IP Chart */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin size={18} className="text-siem-primary"/> Source Countries</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="country" type="category" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={15}>
                  {geoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-4">Traffic by Protocol</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protocolData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} width={50} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {protocolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {protocolData.map(p => (
               <div key={p.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: p.color}}></div>
                  {p.name}
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* PCAP Flow Table Row with Anomaly Detection */}
      <div className="glass-panel flex-1 flex flex-col min-h-[300px]">
         <div className="p-6 border-b border-siem-border flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2"><ArrowRightLeft size={20} className="text-siem-primary"/> Top Talkers / Network Flows</h2>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-siem-border sticky top-0">
              <tr>
                <th className="p-4 font-semibold text-gray-300">Analysis Status</th>
                <th className="p-4 font-semibold text-gray-300">Source IP</th>
                <th className="p-4 font-semibold text-gray-300">Destination IP</th>
                <th className="p-4 font-semibold text-gray-300">Port</th>
                <th className="p-4 font-semibold text-gray-300">Protocol</th>
                <th className="p-4 font-semibold text-gray-300 text-right">Bytes</th>
              </tr>
            </thead>
            <tbody>
              {flowData.map((flow) => (
                <tr key={flow.id} className="border-b border-siem-border hover:bg-white/5 transition-colors font-mono text-sm">
                  <td className="p-4">
                     {flow.status === 'Normal' && <span className="flex items-center w-max gap-1.5 bg-green-500/10 text-siem-success border border-green-500/20 px-2.5 py-1 rounded-md text-xs font-bold"><CheckCircle2 size={14}/> Normal</span>}
                     {flow.status === 'Review Needed' && <span className="flex items-center w-max gap-1.5 bg-red-500/10 text-siem-critical border border-red-500/20 px-2.5 py-1 rounded-md text-xs font-bold"><AlertTriangle size={14}/> Review Needed</span>}
                     {flow.status === 'Anomaly Detected' && <span className="flex items-center w-max gap-1.5 bg-amber-500/10 text-[#F59E0B] border border-amber-500/20 px-2.5 py-1 rounded-md text-xs font-bold"><Activity size={14}/> Anomaly Detected</span>}
                  </td>
                  <td className="p-4 text-blue-400">{flow.src}</td>
                  <td className="p-4 text-purple-400">{flow.dst}</td>
                  <td className="p-4 text-gray-300">{flow.port}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        flow.protocol === 'TCP' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        flow.protocol === 'UDP' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                     }`}>
                        {flow.protocol}
                     </span>
                  </td>
                  <td className="p-4 text-right font-medium text-gray-200">{flow.bytes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Network;
