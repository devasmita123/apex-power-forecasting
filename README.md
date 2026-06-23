# Apex Power & Utilities (APU) - Intelligent Power Demand Forecasting Prototype

An end-to-end machine learning pipeline and containerized dashboard application designed to forecast electricity demand for Apex Power & Utilities (APU) in 10-minute blocks (144 blocks/day). 

This solution addresses real-world data issues (gaps, sensor errors, outliers), integrates historical weather data from public APIs for Dhanbad, Jharkhand, and tracks specific localized regional holidays to ensure highly accurate operational grid predictions.

---

## 🏗️ Repository Architecture
```text
apex-power-forecasting/
├── backend/
│   ├── main.py                # FastAPI Service Endpoints
│   └── model.pkl              # Serialized XGBoost Model Artifact
├── frontend/
│   ├── index.html             # Single-Page Dashboard Interface Layout
│   └── script.js              # Chart.js Controller & API Fetching Logic
├── notebooks/
│   └── demand_forecasting_eda.ipynb  # Complete Data Cleaning, EDA & Training Notebook
├── Dockerfile                 # Single Container Packaging Script
├── requirements.txt           # Python Project Dependencies
└── README.md                  # Implementation Manual