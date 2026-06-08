# Educational SIEM Platform (SOC Simulator)

Welcome to the Educational SIEM Platform! This project is designed as a Security Operations Center (SOC) Simulator to help users understand how modern SIEMs operate, detect threats, and generate compliance reports.

## Features
- **Interactive Dashboard:** View real-time security alerts and system health.
- **Threat Hunting:** Analyze attack patterns, raw payloads, and MITRE ATT&CK mappings.
- **ISMS Compliance Reporting:** Automatically generate and export ISO/IEC 27001:2022 compliant PDF reports.
- **Role-Based Access Control:** Differentiated views for L1/L2 Analysts and L3 Admins.

## Tutorial: How to Use the System

### 1. Starting the Platform
The platform runs on Docker. To start the entire stack (Frontend, Backend, Database, Elasticsearch, Redis), run the following command in the root directory:
```bash
docker-compose up -d --build
```
Once started, open your web browser and navigate to `http://localhost:5173`.

### 2. Logging In
- The system uses strict Role-Based Access Control (RBAC). Registration is restricted to Admins.
- To access all features (including User Management), log in as an **L3 Admin**.
- To simulate an analyst role, log in as an **L1/L2 Analyst**.

### 3. Exploring the Dashboard
- **Dashboard:** Provides a high-level overview of active alerts, recent incidents, and system metrics.
- **Endpoints & Network:** Monitor connected devices and network traffic flows.

### 4. Attack Analysis (Threat Hunting)
- Navigate to the **Attack Analysis** tab in the sidebar.
- You will see an interactive timeline of network traffic. Spikes indicate potential volumetric attacks (e.g., DDoS).
- Click on any row in the **Raw Payload & IOC Inspection** table to expand it. This reveals the actual malicious payload (e.g., SQL Injection, Command Injection) and provides quick actions like "Block IP" or "Export PCAP".

### 5. Generating an ISMS Report
- Navigate to the **ISMS Report** tab.
- Click the **"Generate Report"** button. The system will simulate pulling live data from the SIEM database and populate a formal ISO/IEC 27001 compliance report.
- Once generated, click **"Export to PDF"**. Your browser's print dialog will open. Save it as a PDF for a cleanly formatted, print-ready document.

## Architecture
- **Frontend:** React + Vite + Tailwind CSS + Recharts
- **Backend:** Python + FastAPI
- **Data Layer:** PostgreSQL (Storage), Redis (Caching), Elasticsearch (Log Search)
