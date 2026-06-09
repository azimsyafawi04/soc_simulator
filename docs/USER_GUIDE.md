# SIEM Platform: Project Overview & Usage Guide

## Executive Overview

Modern Security Operations Centers (SOCs) and Managed Security Service Providers (MSSPs) face an existential crisis: **Alert Fatigue**. As the volume of network, endpoint, and cloud telemetry skyrockets, traditional SIEMs generate thousands of uncontextualized, low-fidelity alerts daily. Analysts become overwhelmed, leading to delayed response times and the critical mishandling of true positive incidents.

This Next-Generation SIEM Platform is engineered specifically to eliminate operational noise through a **Risk-Based Alerting (RBA)** architecture. Rather than triggering alerts based on single signatures, the system continuously aggregates risk against specific assets and identities, escalating an incident *only* when a critical behavioral threshold is crossed.

Once a threat is validated, the platform bridges the gap between detection and mitigation via a Wazuh-inspired **Active Response** mechanism. Security analysts can seamlessly transition from hunting a threat on a Global Geo-Map to autonomously isolating compromised endpoints directly from the UI, drastically reducing the Mean Time to Respond (MTTR).

---

## Target Audience

This documentation and the underlying platform are designed for:

- **Security Analysts:** For executing daily SOC operations, monitoring the dashboard, threat hunting via the Log Explorer, and executing Incident Response playbooks.
- **Security Researchers / Detection Engineers:** For engineering and testing advanced detection rules against the unified Elastic Common Schema (ECS) and parsing live Threat Intelligence.
- **Academic Evaluators:** For reviewing the architectural design, assessing the proof-of-concept (POC) implementation, and evaluating the integration of industry standards (MITRE ATT&CK & Splunk PEAK) for a Final Year Project (FYP).

---

## Getting Started & Test Guide

The following steps will guide you through running the SIEM POC, simulating a cyberattack, and executing an Active Response.

### 1. Run the Docker Containers
Ensure Docker and Docker Compose are installed. Spin up the entire microservice stack (Frontend, FastAPI, Redis, PostgreSQL, Elasticsearch) by running:
```bash
git clone https://github.com/azimsyafawi04/soc_simulator.git
cd soc_simulator
docker-compose up -d --build
```
Access the SIEM Dashboard at: `http://localhost:5173`

### 2. Inject Test Logs
The SIEM features a FastAPI ingestion endpoint (`http://localhost:8000/api/logs`) that accepts JSON payloads. You can simulate an attacker's actions by injecting test logs via `curl`:
```bash
curl -X POST http://localhost:8000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"client_ip": "10.0.0.12", "app": "cmd.exe", "event_type": "process_execution", "command": "whoami /priv", "message": "User executed privilege escalation command"}'
```

### 3. Trigger a Critical RBA Alert
To observe the Risk-Based Alerting engine in action, simulate a privilege escalation attack on a high-value asset. 
The system is configured to flag the IP `10.0.0.12` as a "Critical" Domain Controller in `assets.json`. 

By sending the `whoami /priv` or `Invoke-Mimikatz` command logs (as shown in Step 2) multiple times in quick succession, the RBA engine will aggregate the host's Risk Score. Once the score breaches the threshold, a critical alert mapped to the **MITRE ATT&CK TA0004** tactic will instantly populate on your SIEM Dashboard.

### 4. Perform an Active Response
Once the critical alert appears on your **Log Explorer** or **Threat Hunting** interface:
1. Locate the incident in the Dashboard table.
2. Expand the incident details.
3. Click the **"Isolate Host"** or **"Block IP"** Quick Action button.
4. The React Dashboard will immediately fire a webhook back to the FastAPI backend's Active Response API (`/api/active-response`), simulating a SOAR containment action, preventing the attacker from moving laterally.

---

## Disclaimer

**Educational & Research Use Only**  
*This SIEM platform is a Proof of Concept (POC) designed for educational research and academic evaluation (FYP). It is intended to be deployed in a secure, controlled, and isolated lab environment. The Active Response features and detection engines are conceptual models inspired by enterprise systems (such as Wazuh and AWS SIEM) and should not be deployed in a live production environment without extensive security auditing, hardening, and professional enterprise support.*
