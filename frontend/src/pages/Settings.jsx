import React, { useState } from 'react';
import { Settings, Users, Key, Shield, Activity, Plus, Edit2, Trash2, Save, Play, Server, X, UserCircle, Send, Eye, EyeOff, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';

function SettingsPage({ user }) {
  const isAdmin = user?.role === 'L3 Admin';
  const initialTab = isAdmin ? 'users' : 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Dummy State for Rules
  const [rules, setRules] = useState([
    { id: 1, name: 'Password Spraying (Event 4625)', enabled: true, threshold: 5 },
    { id: 2, name: 'Suspicious PowerShell Execution', enabled: true, threshold: 1 },
    { id: 3, name: 'High Shannon Entropy Payload', enabled: true, threshold: 1 },
    { id: 4, name: 'SQL Injection Patterns', enabled: true, threshold: 1 }
  ]);

  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const updateThreshold = (id, value) => {
    setRules(rules.map(r => r.id === id ? { ...r, threshold: value } : r));
  };

  // RBAC Tabs
  let tabs = [];
  if (isAdmin) {
    tabs.push({ id: 'users', label: 'User Management', icon: <Users size={18} /> });
  } else {
    tabs.push({ id: 'profile', label: 'My Profile & Support', icon: <UserCircle size={18} /> });
  }
  tabs.push({ id: 'integrations', label: 'Threat Intel', icon: <Key size={18} /> });
  tabs.push({ id: 'rules', label: 'Detection Rules', icon: <Shield size={18} /> });
  tabs.push({ id: 'playbooks', label: 'IR Playbooks', icon: <BookOpen size={18} /> });
  tabs.push({ id: 'health', label: 'System Health', icon: <Activity size={18} /> });

  // Modal Handlers
  const openAddUserModal = () => {
    setModalMode('add');
    setSelectedUser({ name: '', email: '', role: 'L1 Analyst', password: '' });
    setShowPassword(false);
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (u) => {
    setModalMode('edit');
    setSelectedUser({ ...u, password: '' }); 
    setShowPassword(false);
    setIsUserModalOpen(true);
  };

  const openDeleteModal = (u) => {
    setSelectedUser(u);
    setIsDeleteModalOpen(true);
  };

  const handleUserModalSubmit = (e) => {
    e.preventDefault();
    console.log(`Submitted ${modalMode} user:`, selectedUser);
    setIsUserModalOpen(false);
  };

  const handleDeleteSubmit = () => {
    console.log(`Revoked access for:`, selectedUser);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="h-full p-4 flex flex-col gap-6 overflow-y-auto relative">
      <header className="flex justify-between items-center glass-panel p-6">
        <div className="flex items-center gap-3">
          <Settings className="text-siem-primary" size={28} />
          <h1 className="text-2xl font-bold">Platform Settings</h1>
        </div>
      </header>
      
      <div className="glass-panel flex-1 flex flex-col overflow-hidden">
        {/* Tabs Header */}
        <div className="flex border-b border-siem-border overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 transition-colors font-medium whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-b-2 border-siem-primary text-siem-primary bg-siem-primary/5' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* Tab: My Profile (L1/L2 Only) */}
          {activeTab === 'profile' && !isAdmin && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold">My Profile</h2>
                <p className="text-gray-400 text-sm mt-1">View your current access level.</p>
              </div>
              <div className="p-6 border border-siem-border rounded-lg bg-white/5 flex flex-col gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Full Name</span>
                  <p className="text-lg font-semibold">{user?.name}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Email Address</span>
                  <p className="text-lg font-semibold">{user?.email}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Assigned Role</span>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded text-sm font-bold border ${user?.role === 'L2 Responder' ? 'bg-siem-warning/20 text-siem-warning border-siem-warning/30' : 'bg-siem-primary/20 text-siem-primary border-siem-primary/30'}`}>
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold">Credential Support Ticket</h2>
                <p className="text-gray-400 text-sm mt-1">Request a password reset or role change from an L3 Admin.</p>
              </div>
              <div className="space-y-4">
                <textarea 
                  rows="4" 
                  placeholder="Describe your request..." 
                  className="w-full p-4 bg-[#1F2937] border border-siem-border rounded-lg text-white focus:outline-none focus:border-siem-primary resize-none"
                ></textarea>
                <button className="flex items-center gap-2 px-6 py-3 bg-siem-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                  <Send size={18} /> Submit Request
                </button>
              </div>
            </div>
          )}

          {/* Tab: User Management (L3 Only) */}
          {activeTab === 'users' && isAdmin && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">RBAC User Management</h2>
                  <p className="text-gray-400 text-sm mt-1">Manage platform access and roles.</p>
                </div>
                <button 
                  onClick={openAddUserModal}
                  className="flex items-center gap-2 px-4 py-2 bg-siem-primary text-white rounded hover:bg-blue-600 transition-colors shadow-lg shadow-siem-primary/20"
                >
                  <Plus size={16} /> Add User
                </button>
              </div>
              <div className="border border-siem-border rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-siem-border">
                    <tr>
                      <th className="p-4 font-semibold text-gray-300">Name</th>
                      <th className="p-4 font-semibold text-gray-300">Email</th>
                      <th className="p-4 font-semibold text-gray-300">Role</th>
                      <th className="p-4 font-semibold text-gray-300">Status</th>
                      <th className="p-4 font-semibold text-gray-300 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock Data */}
                    <tr className="border-b border-siem-border hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">Azim</td>
                      <td className="p-4 text-gray-400">azim@soc.local</td>
                      <td className="p-4"><span className="px-2 py-1 bg-siem-critical/20 text-siem-critical rounded text-xs font-bold border border-siem-critical/30">L3 Admin</span></td>
                      <td className="p-4"><span className="text-siem-success flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-siem-success"></div> Active</span></td>
                      <td className="p-4 text-right flex justify-end gap-3">
                        <button onClick={() => openEditUserModal({name: 'Azim', email: 'azim@soc.local', role: 'L3 Admin'})} className="text-gray-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => openDeleteModal({name: 'Azim', email: 'azim@soc.local'})} className="text-gray-400 hover:text-siem-critical transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors border-b border-siem-border">
                      <td className="p-4 font-medium">John Doe</td>
                      <td className="p-4 text-gray-400">john@soc.local</td>
                      <td className="p-4"><span className="px-2 py-1 bg-siem-primary/20 text-siem-primary rounded text-xs font-bold border border-siem-primary/30">L1 Analyst</span></td>
                      <td className="p-4"><span className="text-siem-success flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-siem-success"></div> Active</span></td>
                      <td className="p-4 text-right flex justify-end gap-3">
                        <button onClick={() => openEditUserModal({name: 'John Doe', email: 'john@soc.local', role: 'L1 Analyst'})} className="text-gray-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => openDeleteModal({name: 'John Doe', email: 'john@soc.local'})} className="text-gray-400 hover:text-siem-critical transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">Jane Smith</td>
                      <td className="p-4 text-gray-400">jane@soc.local</td>
                      <td className="p-4"><span className="px-2 py-1 bg-siem-warning/20 text-siem-warning rounded text-xs font-bold border border-siem-warning/30">L2 Responder</span></td>
                      <td className="p-4"><span className="text-gray-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-500"></div> Revoked</span></td>
                      <td className="p-4 text-right flex justify-end gap-3">
                        <button onClick={() => openEditUserModal({name: 'Jane Smith', email: 'jane@soc.local', role: 'L2 Responder'})} className="text-gray-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => openDeleteModal({name: 'Jane Smith', email: 'jane@soc.local'})} className="text-gray-400 hover:text-siem-critical transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Threat Intel */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold">Threat Intelligence API Keys</h2>
                <p className="text-gray-400 text-sm mt-1">Configure external integrations for automated IOC enrichment.</p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-300">VirusTotal API Key</label>
                  <input type="password" placeholder="Enter API Key..." defaultValue="************************" className="p-3 bg-[#1F2937] border border-siem-border rounded text-white focus:outline-none focus:border-siem-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-300">AbuseIPDB API Key</label>
                  <input type="password" placeholder="Enter API Key..." className="p-3 bg-[#1F2937] border border-siem-border rounded text-white focus:outline-none focus:border-siem-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-300">AlienVault OTX API Key</label>
                  <input type="password" placeholder="Enter API Key..." className="p-3 bg-[#1F2937] border border-siem-border rounded text-white focus:outline-none focus:border-siem-primary" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-siem-primary text-white rounded hover:bg-blue-600 transition-colors">
                  <Save size={16} /> Save Keys
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-siem-border text-gray-300 rounded hover:bg-white/5 transition-colors">
                  <Play size={16} /> Test Connections
                </button>
              </div>
            </div>
          )}

          {/* Tab: Detection Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Detection Engine Rules</h2>
                <p className="text-gray-400 text-sm mt-1">Enable, disable, and configure thresholds for automated alerts.</p>
              </div>
              <div className="space-y-4">
                {rules.map(rule => (
                  <div key={rule.id} className="p-5 border border-siem-border bg-white/5 rounded-lg flex items-center justify-between transition-colors hover:bg-white/10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded font-bold ${rule.enabled ? 'bg-siem-success/20 text-siem-success border border-siem-success/30' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}>
                          {rule.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-gray-400">Alert Threshold:</span>
                        <input 
                          type="number" 
                          value={rule.threshold}
                          onChange={(e) => updateThreshold(rule.id, e.target.value)}
                          className="w-16 p-1 bg-[#1F2937] border border-siem-border rounded text-center text-sm focus:outline-none focus:border-siem-primary" 
                          disabled={!isAdmin} 
                        />
                        <span className="text-sm text-gray-400">occurrences</span>
                      </div>
                    </div>
                    <div 
                      onClick={() => { if(isAdmin) toggleRule(rule.id) }}
                      className={`w-12 h-6 rounded-full ${isAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} relative transition-colors ${rule.enabled ? 'bg-siem-success' : 'bg-gray-600'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${rule.enabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: IR Playbooks */}
          {activeTab === 'playbooks' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Incident Response Playbooks</h2>
                <p className="text-gray-400 text-sm mt-1">Standardized containment and remediation policies for SOC Analysts.</p>
              </div>
              <div className="space-y-4">
                
                {/* Playbook 1 */}
                <div className="border border-siem-border bg-white/5 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-siem-border bg-[#1A2234] flex items-center gap-3">
                    <Shield className="text-siem-warning" size={20} />
                    <h3 className="font-bold text-lg text-white">Password Spraying & Brute Force</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Adversaries may attempt to creatively brute force many accounts by increasing the time between logon attempts. The following steps must be taken to contain the threat.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-siem-primary text-sm flex items-center gap-2"><AlertTriangle size={16}/> Containment & Remediation Steps:</h4>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                        <li>Determine the source IP and the targeted destination accounts/systems.</li>
                        <li>Collect and analyze surrounding Windows Security Events (4624, 4625, 4648).</li>
                        <li>Issue a mandatory password change requirement to the affected account owner(s).</li>
                        <li>Determine if the destination accounts/systems have been fully compromised (successful logon).</li>
                        <li>Consider quarantining, isolating, or disabling the compromised accounts immediately via Active Directory.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Playbook 2 */}
                <div className="border border-siem-border bg-white/5 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-siem-border bg-[#1A2234] flex items-center gap-3">
                    <Shield className="text-siem-critical" size={20} />
                    <h3 className="font-bold text-lg text-white">Suspicious PowerShell Execution</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Execution of encoded scripts or bypassing execution policies often indicates fileless malware or lateral movement.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-siem-primary text-sm flex items-center gap-2"><CheckCircle size={16}/> Containment & Remediation Steps:</h4>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                        <li>Isolate the infected host from the network using the EDR platform.</li>
                        <li>Extract the Base64 encoded payload and decode it safely in an isolated sandbox.</li>
                        <li>Identify any Command and Control (C2) domains contacted by the script and block them at the perimeter firewall.</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab: System Health */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">System Health Monitor</h2>
                <p className="text-gray-400 text-sm mt-1">Live status of backend microservices and databases.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <div className="p-4 border border-siem-border rounded-lg flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <Server size={20} className="text-siem-primary" />
                    <span className="font-medium">FastAPI Backend</span>
                  </div>
                  <div className="flex items-center gap-2 text-siem-success text-sm font-bold">
                    <div className="w-2.5 h-2.5 bg-siem-success rounded-full animate-pulse"></div>
                    ONLINE
                  </div>
                </div>
                <div className="p-4 border border-siem-border rounded-lg flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <Server size={20} className="text-blue-400" />
                    <span className="font-medium">PostgreSQL DB</span>
                  </div>
                  <div className="flex items-center gap-2 text-siem-success text-sm font-bold">
                    <div className="w-2.5 h-2.5 bg-siem-success rounded-full animate-pulse"></div>
                    ONLINE
                  </div>
                </div>
                <div className="p-4 border border-siem-border rounded-lg flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <Server size={20} className="text-yellow-500" />
                    <span className="font-medium">Elasticsearch Core</span>
                  </div>
                  <div className="flex items-center gap-2 text-siem-success text-sm font-bold">
                    <div className="w-2.5 h-2.5 bg-siem-success rounded-full animate-pulse"></div>
                    ONLINE
                  </div>
                </div>
                <div className="p-4 border border-siem-border rounded-lg flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <Server size={20} className="text-red-500" />
                    <span className="font-medium">Redis Message Queue</span>
                  </div>
                  <div className="flex items-center gap-2 text-siem-success text-sm font-bold">
                    <div className="w-2.5 h-2.5 bg-siem-success rounded-full animate-pulse"></div>
                    ONLINE
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS (Admin Only) --- */}

      {/* User Management Modal (Add/Edit) */}
      {isUserModalOpen && isAdmin && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-siem-dark border border-siem-border rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-siem-border">
              <h2 className="text-xl font-bold">{modalMode === 'add' ? 'Provision New User' : 'Edit User Access'}</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUserModalSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Full Name / Username</label>
                <input 
                  type="text" 
                  value={selectedUser?.name || ''}
                  onChange={e => setSelectedUser({...selectedUser, name: e.target.value})}
                  className="w-full p-3 bg-[#1F2937] border border-siem-border rounded-lg text-white focus:outline-none focus:border-siem-primary" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Email Address</label>
                <input 
                  type="email" 
                  value={selectedUser?.email || ''}
                  onChange={e => setSelectedUser({...selectedUser, email: e.target.value})}
                  className="w-full p-3 bg-[#1F2937] border border-siem-border rounded-lg text-white focus:outline-none focus:border-siem-primary" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Role</label>
                <select 
                  value={selectedUser?.role || 'L1 Analyst'}
                  onChange={e => setSelectedUser({...selectedUser, role: e.target.value})}
                  className="w-full p-3 bg-[#1F2937] border border-siem-border rounded-lg text-white focus:outline-none focus:border-siem-primary"
                >
                  <option value="L1 Analyst">L1 Analyst</option>
                  <option value="L2 Responder">L2 Responder</option>
                  <option value="L3 Admin">L3 Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  {modalMode === 'add' ? 'Initial Password' : 'Reset Password (Optional)'}
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={selectedUser?.password || ''}
                    onChange={e => setSelectedUser({...selectedUser, password: e.target.value})}
                    className="w-full p-3 pr-10 bg-[#1F2937] border border-siem-border rounded-lg text-white focus:outline-none focus:border-siem-primary" 
                    required={modalMode === 'add'}
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border border-siem-border text-gray-300 rounded hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-siem-primary text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {modalMode === 'add' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete/Revoke Modal */}
      {isDeleteModalOpen && isAdmin && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-siem-dark border border-siem-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 bg-siem-critical/10 border-b border-siem-critical/20 flex items-center gap-3">
              <Shield className="text-siem-critical" size={24} />
              <h2 className="text-xl font-bold text-siem-critical">Revoke Access</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-6">
                Are you sure you want to revoke access for <strong className="text-white">{selectedUser?.name}</strong>? 
                This action is irreversible and will immediately terminate their active sessions.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-siem-border text-gray-300 rounded hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteSubmit}
                  className="px-4 py-2 bg-siem-critical text-white rounded hover:bg-red-600 transition-colors shadow-lg shadow-siem-critical/20"
                >
                  Yes, Revoke Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
