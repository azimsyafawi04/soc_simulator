# Educational SIEM Platform (SOC Simulator)

Welcome to the Educational SIEM Platform! This project is designed as a Security Operations Center (SOC) Simulator to help users understand how modern SIEMs operate, detect threats, and generate compliance reports.

## Features
- **Interactive Dashboard:** View real-time security alerts and system health.
- **Threat Hunting:** Analyze attack patterns, raw payloads, and MITRE ATT&CK mappings.
- **ISMS Compliance Reporting:** Automatically generate and export ISO/IEC 27001:2022 compliant PDF reports.
- **Role-Based Access Control:** Differentiated views for L1/L2 Analysts and L3 Admins.

## Installation and Setup

### Prerequisites
- Docker and Docker Compose installed on your system.
- Git (for downloading the repository).

### 1. Download the Project
Open a terminal (Command Prompt, PowerShell, or Git Bash) and run:
```bash
git clone https://github.com/azimsyafawi04/soc_simulator.git
cd soc_simulator
```

### 2. Starting the Platform
The platform is fully containerized and runs on Docker. To start the entire stack (Frontend, Backend, Database, Elasticsearch, Redis), run the following command in the root directory:
```bash
docker-compose up -d --build
```
Once the build completes and the containers are running, open your web browser and navigate to `http://localhost:5173`.

### 2. Logging In
- The system uses strict Role-Based Access Control (RBAC). Registration is restricted to Admins.
- To access all features (including User Management), log in as an **L3 Admin**.
- To simulate an analyst role, log in as an **L1/L2 Analyst**.

---

## System Interface & Usage

### 1. Real-Time Security Dashboard
![Dashboard](screenshots/dashboard.png)
**Purpose:** Provides a high-level, real-time overview of the organization's security posture.
**Usage:** Use this screen to monitor active incidents, critical alerts, and total event volume over a 24-hour period. The Live Alert Feed instantly shows incoming attacks such as SQL Injections or Multiple Failed Logins.

### 2. Endpoints Management
![Endpoints](screenshots/endpoints.png)
**Purpose:** Tracks all monitored assets (servers, user laptops, etc.) within the network.
**Usage:** Analysts can view the status (Online/Offline) and resource consumption (CPU & RAM) of individual endpoints. Endpoints under active attack are highlighted with red alert badges, allowing for quick isolation.

### 3. Network Traffic Analysis (MSSP)
![Network](screenshots/network.png)
**Purpose:** Deep packet inspection and multi-tenant traffic monitoring.
**Usage:** Select specific client networks via the top dropdown. Monitor inbound connections via the Geo-IP Source Countries map. The Top Talkers table actively tags flows as *Normal*, *Anomaly Detected*, or *Review Needed* based on behavioral analysis.

### 4. Live Log Explorer
![Log Explorer](screenshots/log_explorer.png)
**Purpose:** Real-time raw log ingestion and filtering.
**Usage:** Watch logs stream in via Live Tail. Use the advanced filtering (Source, Level, Time) or the search bar to pinpoint specific events. Expanding any log row reveals the complete, raw JSON payload for deep forensic inspection (simulating Elasticsearch document viewing).

### 5. Threat Hunting & Attack Analysis
![Attack Analysis](screenshots/attack_analysis.png)
**Purpose:** Dedicated interface for investigating active cyber attacks.
**Usage:** When an anomaly is detected, analysts use this page to view the Attacker Profile (Origin IP, Target Asset) and MITRE ATT&CK mapping. Expanding a row in the IOC Inspection table reveals the **raw malicious payload** (e.g., SQL syntax or shell commands), enabling analysts to block the IP or export the PCAP for forensics.

### 6. ISMS Compliance Report Generator
![ISMS Report](screenshots/isms_report.png)
**Purpose:** Automates Governance, Risk, and Compliance (GRC) reporting.
**Usage:** Click "Generate Report" to dynamically pull the latest SIEM alert data and vulnerabilities into a formal ISO/IEC 27001:2022 framework layout. Click "Export to PDF" to generate a clean, print-ready A4 document for management or auditors.

### 🕵️‍♂️ SOC Analyst Workflow Summary
If you are presenting or using this simulator, follow this standard incident response workflow:
1. **Monitor the Dashboard:** Wait for a critical alert to appear in the Live Alert Feed.
2. **Inspect Logs (Log Explorer):** Filter by `CRITICAL` or search for specific attack vectors (e.g., "SQL syntax") to find the exact raw log entry.
3. **Analyze the Attack (Attack Analysis):** Study the attacker's profile and map their actions against the MITRE ATT&CK framework to understand their tactics.
4. **Trace the Network (Network):** Use the Geo-IP map to see where the traffic originated from, and check the Top Talkers for anomalies.
5. **Generate Reports (ISMS Report):** At the end of your shift or upon management request, generate an automated ISO/IEC 27001 report and export it to PDF for auditing.

---

## Architecture
- **Frontend:** React + Vite + Tailwind CSS + Recharts
- **Backend:** Python + FastAPI
- **Data Layer:** PostgreSQL (Storage), Redis (Caching), Elasticsearch (Log Search)
