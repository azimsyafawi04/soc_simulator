import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { Activity, ShieldAlert, Server, Globe, Settings, LogOut, Target, FileText, Terminal, Radar, ClipboardList } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Endpoints from './pages/Endpoints';
import Network from './pages/Network';
import LogExplorer from './pages/LogExplorer';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import AttackAnalysis from './pages/AttackAnalysis';
import IsmsReport from './pages/IsmsReport';
import ThreatHunting from './pages/ThreatHunting';
import CapabilityMatrix from './pages/CapabilityMatrix';

// Protected Route Component
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null); // null when not logged in
  const location = useLocation();

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
      isActive 
        ? 'bg-siem-primary/10 text-siem-primary' 
        : 'hover:bg-white/5 text-gray-400 hover:text-white'
    }`;

  // If on login page, render just the login view
  if (location.pathname === '/login') {
    return <Login onLogin={handleLogin} />;
  }

  // Dashboard layout requires authentication
  return (
    <ProtectedRoute user={user}>
      {/* App Container */}
      <div className="flex h-screen bg-[#0B0F19] text-white font-sans overflow-hidden print:h-auto print:bg-white print:block">
        
        {/* Sidebar */}
        <div className="w-64 bg-[#111827] border-r border-siem-border flex flex-col p-4 print:hidden">
          <div className="flex items-center gap-3 text-siem-primary font-bold text-xl cursor-default">
            <ShieldAlert size={28} />
            <span>SOC Platform</span>
          </div>
          <nav className="flex flex-col gap-2 flex-1 mt-4">
            <NavLink to="/" className={navLinkClass}>
              <Activity size={20} /> Dashboard
            </NavLink>
            <NavLink to="/endpoints" className={navLinkClass}>
              <Server size={20} /> Endpoints
            </NavLink>
            <NavLink to="/network" className={navLinkClass}>
              <Globe size={20} /> Network
            </NavLink>
            
            <div className="mt-4 mb-1 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Operations
            </div>
            
            <NavLink to="/log-explorer" className={navLinkClass}>
              <Terminal size={20} /> Log Explorer
            </NavLink>
            
            <div className="mt-4 mb-1 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Analytics & Reporting
            </div>
            
            {user?.role === 'L3 Admin' && (
              <NavLink to="/threat-hunting" className={navLinkClass}>
                <Radar size={20} /> Threat Hunting
              </NavLink>
            )}
            
            <NavLink to="/attack-analysis" className={navLinkClass}>
              <Target size={20} /> Attack Analysis
            </NavLink>
            <NavLink to="/isms-report" className={navLinkClass}>
              <FileText size={20} /> ISMS Report
            </NavLink>
            <NavLink to="/capability-matrix" className={navLinkClass}>
              <ClipboardList size={20} /> Feature Matrix
            </NavLink>
          </nav>
          
          <div className="mt-auto flex flex-col gap-4">
            {/* User Info */}
            <div className="p-3 bg-white/5 border border-siem-border rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-siem-primary/20 text-siem-primary flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">{user?.name}</span>
                <span className="text-xs text-siem-primary truncate">{user?.role}</span>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              <NavLink to="/settings" className={navLinkClass}>
                <Settings size={20} /> Settings
              </NavLink>
              <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer text-gray-400 hover:text-siem-critical hover:bg-siem-critical/10 text-left w-full">
                <LogOut size={20} /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden print:overflow-visible print:block">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/endpoints" element={<Endpoints />} />
            <Route path="/network" element={<Network />} />
            <Route path="/log-explorer" element={<LogExplorer />} />
            <Route path="/attack-analysis" element={<AttackAnalysis />} />
            <Route path="/isms-report" element={<IsmsReport />} />
            <Route path="/threat-hunting" element={<ThreatHunting />} />
            <Route path="/capability-matrix" element={<CapabilityMatrix />} />
            <Route path="/settings" element={<SettingsPage user={user} />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default App;
