import { format, subDays, addDays } from 'date-fns';

/**
 * CORE INDUSTRY LOGIC: INVENTORY OPTIMIZATION
 * This module implements the mathematical models used by companies like Walmart.
 */

export interface SKUData {
  id: string;
  name: string;
  category: string;
  history: { date: string; sales: number }[];
  forecast: { date: string; sales: number }[];
  currentStock: number;
  leadTimeDays: number; // Time it takes to get new stock
  unitCost: number;
  holdingCostRate: number; // Cost to hold 1 unit for 1 year (as % of cost)
  orderingCost: number; // Flat cost per order (logistics/admin)
  serviceLevel: number; // Target probability of not stocking out (e.g. 0.95)
}

export interface InventoryMetrics {
  safetyStock: number;
  reorderPoint: number;
  economicOrderQuantity: number;
  stockoutRisk: number;
  stockReachDays: number;
  recommendation: 'STABLE' | 'REORDER_NOW' | 'OVERSTOCK';
  suggestedOrderQty: number;
}

/**
 * Calculates replenishment metrics based on forecasting and statistical distribution.
 */
export function calculateInventoryMetrics(sku: SKUData): InventoryMetrics {
  // 1. Demand during Lead Time (Mean)
  const avgDailyDemand = sku.forecast.reduce((sum, f) => sum + f.sales, 0) / sku.forecast.length;
  const leadTimeDemand = avgDailyDemand * sku.leadTimeDays;

  // 2. Standard Deviation of Demand (Uncertainty)
  const mean = sku.history.reduce((a, b) => a + b.sales, 0) / sku.history.length;
  const variance = sku.history.reduce((a, b) => a + Math.pow(b.sales - mean, 2), 0) / sku.history.length;
  const stdDev = Math.sqrt(variance);

  // 3. Safety Stock (z * stdDev * sqrt(LeadTime))
  // Z-score for 95% service level is approx 1.645
  const zScore = 1.645; 
  const safetyStock = Math.ceil(zScore * stdDev * Math.sqrt(sku.leadTimeDays));

  // 4. Reorder Point (ROP)
  const reorderPoint = Math.ceil(leadTimeDemand + safetyStock);

  // 5. Economic Order Quantity (EOQ) - Wilson's Formula
  // EOQ = sqrt( (2 * AnnualDemand * OrderingCost) / HoldingCost )
  const annualDemand = avgDailyDemand * 365;
  const holdingCostPerUnit = sku.unitCost * sku.holdingCostRate;
  const eoq = Math.ceil(Math.sqrt((2 * annualDemand * sku.orderingCost) / holdingCostPerUnit));

  // 6. Practical Recommendation
  let recommendation: 'STABLE' | 'REORDER_NOW' | 'OVERSTOCK' = 'STABLE';
  let suggestedOrderQty = 0;

  if (sku.currentStock <= reorderPoint) {
    recommendation = 'REORDER_NOW';
    suggestedOrderQty = eoq;
  } else if (sku.currentStock > reorderPoint * 2.5) {
    recommendation = 'OVERSTOCK';
  }

  const stockReachDays = Math.floor(sku.currentStock / avgDailyDemand);
  const stockoutRisk = sku.currentStock < reorderPoint ? 0.85 : 0.05;

  return {
    safetyStock,
    reorderPoint,
    economicOrderQuantity: eoq,
    stockoutRisk,
    stockReachDays,
    recommendation,
    suggestedOrderQty
  };
}

/**
 * Simulation Engine: Generates realistic Retail Data
 */
export function generateSimulationData(): SKUData[] {
  const categories = ['Electronics', 'Home Decor', 'Groceries', 'Apparel'];
  const skus: SKUData[] = [];

  const productNames: Record<string, string[]> = {
    'Electronics': ['Wireless Mouse', 'USB-C Cable', 'Keyboard XL', 'Monitor Stand'],
    'Home Decor': ['Table Lamp', 'Succulent Pot', 'Wall Clock', 'Soy Candle'],
    'Groceries': ['Almond Milk', 'Organic Coffee', 'Quinoa 1kg', 'Dark Chocolate'],
    'Apparel': ['Cotton T-Shirt', 'Denim Jeans', 'Wool Socks', 'Summer Hat']
  };

  for (let i = 0; i < 12; i++) {
    const category = categories[i % categories.length];
    const name = productNames[category][Math.floor(Math.random() * productNames[category].length)];
    
    // Create history
    const history = [];
    const baseDemand = 10 + Math.random() * 50;
    const seasonality = Math.random() * 0.5;
    
    for (let d = 60; d > 0; d--) {
      const date = format(subDays(new Date(), d), 'yyyy-MM-dd');
      // Adding noise + weekends spike
      const dayOfWeek = subDays(new Date(), d).getDay();
      const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.4 : 1.0;
      const sales = Math.max(0, Math.floor(baseDemand * weekendMultiplier + (Math.random() - 0.5) * 10));
      history.push({ date, sales });
    }

    // Create forecast (simple trend + seasonality)
    const forecast = [];
    for (let f = 1; f <= 14; f++) {
      const date = format(addDays(new Date(), f), 'yyyy-MM-dd');
      const predicted = Math.floor(baseDemand * (1 + (Math.random() - 0.5) * 0.2));
      forecast.push({ date, sales: predicted });
    }

    skus.push({
      id: `SKU-${1000 + i}`,
      name: `${name} (${1000 + i})`,
      category,
      history,
      forecast,
      currentStock: Math.floor(baseDemand * (5 + Math.random() * 10)),
      leadTimeDays: Math.floor(3 + Math.random() * 7),
      unitCost: 15 + Math.random() * 200,
      holdingCostRate: 0.15 + Math.random() * 0.1,
      orderingCost: 50 + Math.random() * 100,
      serviceLevel: 0.95
    });
  }

  return skus;
}
