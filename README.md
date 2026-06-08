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
- Git (optional, for version control).

### 1. Starting the Platform
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

### 3. Network Traffic Analysis
![Network](screenshots/network.png)
**Purpose:** Deep packet inspection and traffic flow monitoring.
**Usage:** The area chart visualizes network traffic over time. Spikes indicate potential volumetric attacks (e.g., DDoS). The Top Talkers table below shows exact source and destination IP addresses, ports, and protocols for suspicious connections.

### 4. Threat Hunting & Attack Analysis
![Attack Analysis](screenshots/attack_analysis.png)
**Purpose:** Dedicated interface for investigating active cyber attacks.
**Usage:** When an anomaly is detected, analysts use this page to view the Attacker Profile (Origin IP, Target Asset) and MITRE ATT&CK mapping. Expanding a row in the IOC Inspection table reveals the **raw malicious payload** (e.g., SQL syntax or shell commands), enabling analysts to block the IP or export the PCAP for forensics.

### 5. ISMS Compliance Report Generator
![ISMS Report](screenshots/isms_report.png)
**Purpose:** Automates Governance, Risk, and Compliance (GRC) reporting.
**Usage:** Click "Generate Report" to dynamically pull the latest SIEM alert data and vulnerabilities into a formal ISO/IEC 27001:2022 framework layout. Click "Export to PDF" to generate a clean, print-ready A4 document for management or auditors.

---

## Architecture
- **Frontend:** React + Vite + Tailwind CSS + Recharts
- **Backend:** Python + FastAPI
- **Data Layer:** PostgreSQL (Storage), Redis (Caching), Elasticsearch (Log Search)
