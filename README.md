# RetailFlow: End-to-End Sales Forecasting & Inventory Optimization System

[![Portfolio](https://img.shields.io/badge/Project-Portfolio-blue.svg)](https://yourportfolio.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-white.svg?logo=linkedin&logoColor=blue)](https://linkedin.com)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)

## 📖 Project Overview
**RetailFlow** is a comprehensive software system designed to optimize supply chain operations for retail businesses. It leverages **Machine Learning** to predict future product demand and **Operations Research** models to automate complex inventory replenishment decisions.

In modern retail environments (like Amazon, Walmart, or Reliance Retail), stockouts lead to lost revenue while overstocking ties up valuable working capital. This system bridges that gap by providing a mathematical framework for "Just-in-Time" inventory management.

---

## 🎯 Problem Statement
Retail supply chains face high volatility due to seasonality, promotions, and lead-time variations. Manual inventory planning often results in:
1.  **Stockouts**: 8-10% lost sales due to item unavailability.
2.  **Excess Inventory**: 15-20% of capital tied up in slow-moving stock.
3.  **Inefficient Ordering**: Logistics costs spiraling due to suboptimal batch sizes.

---

## 🛠️ Tech Stack & Architecture

### **Core Technologies**
- **Data Science**: Python (Pandas, NumPy, Scikit-Learn, Statsmodels)
- **Frontend**: React 19, Tailwind CSS (Professional Polish Theme)
- **Visualization**: Recharts (Demand & Analytics), Lucide (UX Icons)
- **Logic**: Statistical Service-Level models (Safety Stock, ROP, EOQ)

### **System Workflow**
1.  **Data Ingestion**: Historical transaction parsing (Seasonality, Price Elasticity).
2.  **Feature Engineering**: Lag features (t-1, t-7), Rolling Windows, and Day-of-Week encoding.
3.  **Demand Forecasting**: Hybrid Random Forest + Croston's Method for regular and sparse items.
4.  **Optimization Engine**: Calculation of replenishment metrics based on target Service Levels (95%).
5.  **Executive Dashboard**: Real-time monitoring and replenishment alert system.

---

## 📂 Project Structure
```text
RetailFlow-Optimizer/
│
├── python_core/              # Python Data Science Backend
│   ├── forecast_engine.py    # ML Training & Prediction Logic
│   └── requirements.txt      # Python Dependencies
│
├── src/                      # Frontend Dashboard Source
│   ├── lib/
│   │   └── inventory-logic.ts # replenishment & Simulation engine
│   ├── App.tsx               # Main Analytics Dashboard (React)
│   └── index.css             # Theme & TailWind Configuration
│
├── data/                     # Data Layer
│   └── historical_demand.csv # Sample historical sales datasets
│
├── models/                   # Model Artifacts
│   └── forecast_model_metadata.json # Performance metrics & metadata
│
├── outputs/                  # Reporting Outputs
│   └── weekly_replenishment_plan.csv # Generated PO recommendations
│
├── reports/                  # Business Documentation
│   └── optimization_insights.md      # Executive ROI Summary
│
├── GUIDELINES.md             # Interview Prep & Implementation Guide
├── metadata.json             # Project Application Metadata
└── package.json              # App dependencies & scripts
```

---

## 📊 Inventory Physics Implementations

| Metric | Formula / Approach | Purpose |
| :--- | :--- | :--- |
| **Safety Stock** | `Z * σd * √L` | Buffer inventory representing 95% service level confidence. |
| **Reorder Point** | `(Avg Demand * Lead Time) + Safety Stock` | The exact inventory level that triggers a "Critical" alert. |
| **EOQ** | `√((2 * D * K) / H)` | Optimal order quantity minimizing setup vs holding costs. |
| **Forecast Accuracy** | `1 - (MAE / Mean Sales)` | Benchmarking AI performance against baseline naive models. |

---

## 📈 Visualizations & Results

### **1. Demand Forecasting Graph**
Observe how the system identifies cyclical spikes (Weekends/Holidays) and projects them into the 14-day horizon.
> *Note: In the dashboard, the blue line represents actual history, while the pink dashed line represents AI-predicted demand.*

### **2. Replenishment Matrix**
The system flags SKUs as **"Critical"**, **"Stable"**, or **"Overstock"** based on current inventory vs. calculated Reorder Points.

### **3. Stock Health Stats**
- **Inventory Value**: Real-time dollar value of current stock on hand.
- **Stock Reach**: Estimated days until stock runs out at predicted demand rates.

---

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/RetailFlow-Optimizer.git
   cd RetailFlow-Optimizer
   ```

2. **Run Python Core (Analytics Backend)**
   ```bash
   cd python_core
   pip install -r requirements.txt
   python forecast_engine.py
   ```

3. **Launch Analytics Dashboard**
   ```bash
   npm install
   npm run dev
   ```

---

## 👩‍💻 Author
**Your Name**  
*Aspiring Data Scientist & Supply Chain Analyst*  
[LinkedIn](https://linkedin.com) | [Portfolio](https://yourportfolio.com) | [GitHub](https://github.com)
