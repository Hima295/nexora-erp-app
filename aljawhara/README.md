# Aljawhara (الجوهرة)

Enterprise-grade custom Frappe application designed to extend ERPNext v15+ without modifying ERPNext core.

## 🌟 Architectural Principles

1. **ERPNext Core Untouched**: Zero direct modifications to ERPNext source code. All extensions, custom fields, and document hooks are declared non-invasively inside `aljawhara/hooks.py` and fixtures.
2. **ERPNext as Single Source of Truth**: Uses standard ERPNext DocTypes (`Item`, `Sales Order`, `Purchase Order`, `Stock Entry`, `GL Entry`) directly. No duplicate databases or shadow tables.
3. **Arabic (RTL) & English Native**: Built-in full bi-directional support with Arabic (`ar.json`) and English (`en.json`) dictionaries and CSS overrides for Frappe Desk.
4. **Modular Architecture**: Scalable module layout ready for Executive Analytics, Inventory Intelligence, Sales Intelligence, Purchasing Intelligence, and AI Decision Support.
5. **Docker & Bench Native**: Production-ready `Dockerfile` and `docker-compose.yml` for seamless integration into standard Frappe Cloud and bench environments.

---

## 🚀 Installation Guide

### Option A: Standard Bench Installation (ERPNext v15+)

```bash
# 1. Navigate to your Frappe bench directory
cd ~/frappe-bench

# 2. Get the Aljawhara custom application
bench get-app https://github.com/aljawhara-org/aljawhara.git --branch main

# 3. Install Aljawhara on your target ERPNext site
bench --site [your-site-name] install-app aljawhara

# 4. Migrate database and clear cache
bench --site [your-site-name] migrate
bench clear-cache
```

### Option B: Docker Container Installation

```bash
# Build and run the complete Frappe + ERPNext + Aljawhara container stack
cd aljawhara
docker-compose up -d --build
```

---

## 📁 Application Structure

```
aljawhara/
├── pyproject.toml              # Flit/Setuptools package specification
├── setup.py                    # Standard Frappe app installation script
├── MANIFEST.in                 # Packaging inclusions
├── Dockerfile                  # Container build recipe
├── docker-compose.yml          # Production stack configuration
└── aljawhara/                  # App Python package
    ├── __init__.py             # Version declaration (__version__ = "0.0.1")
    ├── hooks.py                # Frappe v15 integration hooks & doc_events
    ├── modules.txt             # Registered modules
    ├── api/                    # Whitelisted Frappe REST APIs
    ├── aljawhara_core/         # Core Single Settings & System Log DocTypes
    ├── fixtures/               # Non-invasive Custom Field & Property Setter definitions
    ├── config/                 # Frappe Desk workspaces and navigation
    ├── overrides/              # ERPNext event handlers & listeners
    ├── tasks/                  # Scheduled cron jobs (Hourly, Daily, Weekly)
    ├── public/                 # Static assets (JS/CSS bundles, RTL overrides)
    └── translations/           # Arabic (ar.json) & English (en.json) dictionaries
```

---

## 🛠️ Modules Roadmap

- **Aljawhara Core**: App configuration, audit logging, and ERPNext observer hooks.
- **Executive Analytics**: *(Planned)* Real-time executive metrics & decision cockpit.
- **Inventory Intelligence**: *(Planned)* Stock optimization & valuation insights.
- **Sales Intelligence**: *(Planned)* Revenue breakdown & customer analytics.
- **Purchasing Intelligence**: *(Planned)* Vendor performance & spend analysis.
- **AI Decision Support**: *(Planned)* Automated anomaly detection & forecasting.

---

## 📄 License
MIT License - Aljawhara Team.
