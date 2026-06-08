import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    // Simulate real-time alerts
    setAlerts([
      { id: 1, severity: 'CRITICAL', rule_name: 'SQL Injection Attempt Detected', source_ip: '192.168.1.45', target: 'Web Server', time: 'Just now' },
      { id: 2, severity: 'HIGH', rule_name: 'Multiple Failed Logins', source_ip: '10.0.0.5', target: 'Active Directory', time: '2 mins ago' }
    ]);
  }, []);

  const handleAlertClick = (alert) => {
    console.log("Alert clicked:", alert);
    window.alert(`Opening incident investigation view for:\n${alert.rule_name}\nSource IP: ${alert.source_ip}\nTarget: ${alert.target}`);
  };

  return (
    <div className="h-full p-4 flex flex-col gap-6 overflow-y-auto">
      <header className="flex justify-between items-center glass-panel p-6">
        <h1 className="text-2xl font-bold">Real-Time Security Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-siem-primary/20 text-siem-primary rounded-full text-sm font-semibold flex items-center gap-2 cursor-default">
            <span className="w-2 h-2 rounded-full bg-siem-primary animate-pulse"></span>
            Live Monitoring Active
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
            <Users size={20} className="text-gray-400" />
            <span>Admin (L3)</span>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-siem-primary hover:bg-white/5 transition-colors cursor-pointer">
          <h3 className="text-gray-400 text-sm">Total Events (24h)</h3>
          <p className="text-3xl font-bold mt-2">1.2M</p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-siem-critical hover:bg-white/5 transition-colors cursor-pointer">
          <h3 className="text-gray-400 text-sm">Critical Alerts</h3>
          <p className="text-3xl font-bold text-siem-critical mt-2">14</p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-siem-warning hover:bg-white/5 transition-colors cursor-pointer">
          <h3 className="text-gray-400 text-sm">Active Incidents</h3>
          <p className="text-3xl font-bold text-siem-warning mt-2">3</p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-siem-success hover:bg-white/5 transition-colors cursor-pointer">
          <h3 className="text-gray-400 text-sm">Resolved</h3>
          <p className="text-3xl font-bold text-siem-success mt-2">42</p>
        </div>
      </div>

      {/* Main Feed */}
      <div className="glass-panel p-6 flex-1">
        <h2 className="text-xl font-bold mb-4">Live Alert Feed</h2>
        <div className="space-y-4">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              onClick={() => handleAlertClick(alert)}
              className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md ${
                alert.severity === 'CRITICAL' 
                  ? 'border-siem-critical/30 bg-siem-critical/5 hover:bg-siem-critical/10' 
                  : 'border-siem-warning/30 bg-siem-warning/5 hover:bg-siem-warning/10'
              }`}
            >
              <div>
                <span className={`px-2 py-1 text-xs rounded font-bold mr-3 ${
                  alert.severity === 'CRITICAL' ? 'bg-siem-critical text-white' : 'bg-siem-warning text-black'
                }`}>{alert.severity}</span>
                <span className="font-semibold">{alert.rule_name}</span>
                <p className="text-sm text-gray-400 mt-1">Source: {alert.source_ip} | Target: {alert.target}</p>
              </div>
              <span className="text-gray-500 text-sm">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
