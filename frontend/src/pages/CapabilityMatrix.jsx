import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, XCircle, Clock, ShieldCheck, Mail, GitMerge, SearchCode } from 'lucide-react';

function CapabilityMatrix() {
  const [activeTab, setActiveTab] = useState('email_edr');

  const tabs = [
    { id: 'email_edr', label: 'Email Security & EDR', icon: <Mail size={18} /> },
    { id: 'log_soar', label: 'Log Pipeline & SOAR', icon: <GitMerge size={18} /> },
    { id: 'siem_core', label: 'SIEM Core Features', icon: <ShieldCheck size={18} /> },
    { id: 'poc_testing', label: 'Detection & POC Testing', icon: <SearchCode size={18} /> }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Implemented':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-siem-success/20 text-siem-success border border-siem-success/30 rounded text-xs font-bold w-max"><CheckCircle2 size={14}/> Implemented</span>;
      case 'In Roadmap':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-siem-warning/20 text-siem-warning border border-siem-warning/30 rounded text-xs font-bold w-max"><Clock size={14}/> In Roadmap</span>;
      case 'Not Applicable':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-700 text-gray-400 border border-gray-600 rounded text-xs font-bold w-max"><XCircle size={14}/> N/A</span>;
      default:
        return null;
    }
  };

  const criteriaData = {
    email_edr: [
      { feature: 'Attachment Sandboxing', desc: 'Isolates and detonates suspicious email attachments in a virtual environment.', status: 'In Roadmap' },
      { feature: 'Phishing URL Detection', desc: 'Analyzes email links against threat intel databases (e.g. VirusTotal).', status: 'Implemented' },
      { feature: 'Endpoint Isolation', desc: 'Quarantines a compromised host from the network automatically.', status: 'In Roadmap' },
      { feature: 'Process Tree Monitoring', desc: 'Tracks parent-child process execution chains on the endpoint.', status: 'Implemented' }
    ],
    log_soar: [
      { feature: 'Syslog / API Ingestion', desc: 'Supports standard log ingestion formats (JSON, CEF, Syslog).', status: 'Implemented' },
      { feature: 'Log Parsing & Normalization', desc: 'Standardizes disparate logs into a unified JSON format (Elasticsearch).', status: 'Implemented' },
      { feature: 'Automated Playbooks', desc: 'Triggers predefined response actions upon specific alert generation.', status: 'In Roadmap' },
      { feature: 'Threat Intel Integration', desc: 'Enriches raw logs with malicious IPs/Domains automatically.', status: 'Implemented' }
    ],
    siem_core: [
      { feature: 'Role-Based Access Control (RBAC)', desc: 'Restricts views and actions based on user roles (L1, L2, L3).', status: 'Implemented' },
      { feature: 'Multi-Tenancy', desc: 'Segments data and dashboards per client or organizational unit.', status: 'Implemented' },
      { feature: 'Real-Time Log Explorer', desc: 'Live tailing of streaming logs with advanced filtering capabilities.', status: 'Implemented' },
      { feature: 'ISMS Compliance Reporting', desc: 'Generates ISO/IEC 27001 aligned reports based on active threats.', status: 'Implemented' }
    ],
    poc_testing: [
      { feature: 'Threshold Alarms', desc: 'Detects volumetric attacks like Brute Force or DDoS (e.g. Password Spraying).', status: 'Implemented' },
      { feature: 'Shannon Entropy Scoring', desc: 'Identifies obfuscated or DGA-based malicious payloads.', status: 'Implemented' },
      { feature: 'Match Alarms', desc: 'Triggers on precise IOCs or specific command executions (e.g. PowerShell bypass).', status: 'Implemented' },
      { feature: 'Long-tail Analysis', desc: 'Visualizes rare events using statistical stack counting.', status: 'Implemented' }
    ]
  };

  return (
    <div className="h-full p-4 flex flex-col gap-6 overflow-y-auto relative">
      {/* Header */}
      <header className="flex justify-between items-center glass-panel p-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-siem-primary" size={28} />
          <h1 className="text-2xl font-bold">System Feature & POC Evaluation</h1>
        </div>
        <p className="text-gray-400 text-sm hidden md:block">
          Official capability matrix mapping implemented features against enterprise requirements.
        </p>
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
          <div className="border border-siem-border rounded-lg overflow-hidden bg-black/20">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-siem-border">
                <tr>
                  <th className="p-4 font-semibold text-gray-300 w-1/4">Feature / Criterion</th>
                  <th className="p-4 font-semibold text-gray-300 w-2/4">Description</th>
                  <th className="p-4 font-semibold text-gray-300 w-1/4">Implementation Status</th>
                </tr>
              </thead>
              <tbody>
                {criteriaData[activeTab].map((item, idx) => (
                  <tr key={idx} className="border-b border-siem-border/50 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{item.feature}</td>
                    <td className="p-4 text-gray-400 leading-relaxed">{item.desc}</td>
                    <td className="p-4">{getStatusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-siem-primary/10 border border-siem-primary/20 rounded-lg flex items-center gap-3 text-sm text-gray-300">
            <ShieldCheck className="text-siem-primary" size={20} />
            <p>
              <strong>Note for Auditors:</strong> This matrix is actively updated as new components transition from the 
              development roadmap into the core SIEM deployment pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CapabilityMatrix;
