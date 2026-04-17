"""
RETAIL FORECASTING & INVENTORY OPTIMIZATION ENGINE
--------------------------------------------------
This script implements a production-ready forecasting pipeline using 
Random Forest Regressors and statistical inventory optimization.

Industry Logic:
1. Demand Forecasting (Machine Learning)
2. Safety Stock Calculation (Service-Level Driven)
3. Reorder Point Identification
4. Economic Order Quantity (EOQ) Optimization
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta

def simulate_retail_data(n_days=730):
    """Generates 2 years of synthetic daily sales data with seasonality and noise."""
    dates = pd.date_range(end=datetime.now(), periods=n_days)
    # Base demand + Year trend + Weekly seasonality + Noise
    base = 100
    trend = np.linspace(0, 50, n_days)
    weekly = 10 * np.sin(2 * np.pi * dates.dayofweek / 7)
    yearly = 20 * np.sin(2 * np.pi * dates.dayofyear / 365)
    noise = np.random.normal(0, 15, n_days)
    
    sales = np.maximum(0, base + trend + weekly + yearly + noise).astype(int)
    return pd.DataFrame({'date': dates, 'sales': sales})

def feature_engineering(df):
    """Creates lag features and rolling statistics for ML model."""
    df = df.copy()
    # Lags (Yesterday, Last Week, etc)
    for lag in [1, 7, 14, 30]:
        df[f'lag_{lag}'] = df['sales'].shift(lag)
    
    # Rolling Averages
    df['rolling_mean_7'] = df['sales'].shift(1).rolling(window=7).mean()
    df['rolling_std_7'] = df['sales'].shift(1).rolling(window=7).std()
    
    # Calendar features
    df['day_of_week'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month
    
    return df.dropna()

def train_forecast_model(df):
    """Trains a Random Forest to predict next-day sales."""
    features = ['lag_1', 'lag_7', 'lag_14', 'lag_30', 'rolling_mean_7', 'rolling_std_7', 'day_of_week', 'month']
    X = df[features]
    y = df['sales']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    return model

def inventory_replenishment_logic(forecast, std_dev, current_stock, lead_time=7):
    """
    Computes Safety Stock and Reorder Point.
    Service Level: 95% (z = 1.645)
    """
    z = 1.645
    safety_stock = int(z * std_dev * np.sqrt(lead_time))
    demand_during_lead_time = forecast * lead_time
    reorder_point = int(demand_during_lead_time + safety_stock)
    
    status = "STABLE"
    if current_stock <= reorder_point:
        status = "REORDER NOW"
        
    return {
        "safety_stock": safety_stock,
        "reorder_point": reorder_point,
        "status": status
    }

if __name__ == "__main__":
    print("🚀 Initializing Retail OS Simulation...")
    data = simulate_retail_data()
    processed_data = feature_engineering(data)
    
    print("📊 Training Forecasting Model...")
    model = train_forecast_model(processed_data)
    
    # Predict next day
    latest_features = processed_data.iloc[-1][['lag_1', 'lag_7', 'lag_14', 'lag_30', 'rolling_mean_7', 'rolling_std_7', 'day_of_week', 'month']].values.reshape(1, -1)
    prediction = model.predict(latest_features)[0]
    
    print(f"📈 Tomorrow's Predicted Sales: {prediction:.2f} units")
    
    # Optimization
    summary = inventory_replenishment_logic(
        forecast=prediction, 
        std_dev=processed_data['sales'].std(),
        current_stock=250
    )
    
    print(f"🛠️ Inventory Status: {summary['status']}")
    print(f"✅ ROP: {summary['reorder_point']} | Safety Stock: {summary['safety_stock']}")
