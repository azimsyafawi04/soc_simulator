import React, { useState } from 'react';
import { ShieldAlert, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication
    if (email && password) {
      let role = 'L1 Analyst';
      let name = 'Analyst User';
      
      if (email.toLowerCase().includes('admin')) {
        role = 'L3 Admin';
        name = 'Admin User';
      } else if (email.toLowerCase().includes('responder')) {
        role = 'L2 Responder';
        name = 'Incident Responder';
      }

      onLogin({ name, role, email });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-siem-dark flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-siem-primary/10 rounded-full flex items-center justify-center mb-4 border border-siem-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <ShieldAlert size={32} className="text-siem-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">SOC Platform</h1>
          <p className="text-gray-400 mt-2">Authorized Personnel Only</p>
        </div>

        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Email / Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1F2937] border border-siem-border rounded-lg text-white focus:outline-none focus:border-siem-primary focus:ring-1 focus:ring-siem-primary transition-colors"
                  placeholder="admin@soc.local"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1F2937] border border-siem-border rounded-lg text-white focus:outline-none focus:border-siem-primary focus:ring-1 focus:ring-siem-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-siem-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-siem-primary/20 transition-all active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-6">
          This system is restricted to authorized users only. <br/> Access attempts are monitored and logged.
        </p>
      </div>
    </div>
  );
}

export default Login;
