import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';
import { filterByRouteAndDate } from '../utils/dataLoader';

function DecisionEngine({ data, selectedRoute, setSelectedRoute, selectedDate, routes, dates }) {
  const currentData = filterByRouteAndDate(data, selectedRoute, selectedDate);

  // Calculate 4-Factor Decision Lens scores (simulated based on available data)
  const decisionFactors = useMemo(() => {
    const flightInfo = currentData.flightInfo;
    const forecast = currentData.forecast;
    
    // Demand Stability: Based on forecast confidence (inverse of volatility)
    const demandStability = parseFloat(forecast?.forecast_confidence) || 0.75;
    
    // Cost Exposure: Based on fixed_cost vs variable_cost (higher fixed = higher exposure)
    const fixedCost = parseFloat(flightInfo?.fixed_cost) || 50000;
    const variableCost = parseFloat(flightInfo?.variable_cost_per_unit) || 3;
    const maxCapacity = parseFloat(flightInfo?.max_capacity) || 2000;
    const totalVariableAtMax = variableCost * maxCapacity;
    const costExposure = fixedCost / (fixedCost + totalVariableAtMax); // 0-1 scale
    
    // Delay Risk: Direct from data
    const delayRisk = parseFloat(flightInfo?.delay_risk_score) || 0.3;
    
    // Real-Time Flexibility: Based on real_time_update_flag
    const flexibility = parseFloat(flightInfo?.real_time_update_flag) || 0; // 0 or 1
    
    return {
      demandStability: (demandStability * 100).toFixed(0),
      costExposure: (costExposure * 100).toFixed(0),
      delayRisk: (delayRisk * 100).toFixed(0),
      flexibility: (flexibility * 100).toFixed(0)
    };
  }, [currentData]);

  const radialData = [
    { name: 'Demand Stability', value: parseFloat(decisionFactors.demandStability), fill: '#48bb78' },
    { name: 'Cost Exposure', value: parseFloat(decisionFactors.costExposure), fill: '#ed8936' },
    { name: 'Delay Risk', value: parseFloat(decisionFactors.delayRisk), fill: '#f56565' },
    { name: 'Real-Time Flexibility', value: parseFloat(decisionFactors.flexibility), fill: '#4299e1' }
  ];

  const getFactorStatus = (value, type) => {
    if (type === 'delayRisk') {
      if (value > 50) return { status: 'High Risk', color: '#f56565', bg: '#fff5f5' };
      if (value > 30) return { status: 'Moderate Risk', color: '#ed8936', bg: '#fffaf0' };
      return { status: 'Low Risk', color: '#48bb78', bg: '#f0fff4' };
    }
    if (type === 'flexibility') {
      if (value > 50) return { status: 'High Flexibility', color: '#48bb78', bg: '#f0fff4' };
      return { status: 'Low Flexibility', color: '#f56565', bg: '#fff5f5' };
    }
    if (value > 70) return { status: 'High', color: '#48bb78', bg: '#f0fff4' };
    if (value > 40) return { status: 'Medium', color: '#ed8936', bg: '#fffaf0' };
    return { status: 'Low', color: '#f56565', bg: '#fff5f5' };
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Decision Engine</h1>
        <p className="page-subtitle">The Core Innovation: Converting Forecasts into Decisions</p>
      </div>

      <div className="control-group">
        <div className="control-item">
          <label className="control-label">Route</label>
          <select
            className="control-select"
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
          >
            {routes.map(route => (
              <option key={route} value={route}>{route}</option>
            ))}
          </select>
        </div>
        <div className="control-item">
          <label className="control-label">Date</label>
          <select className="control-select" value={selectedDate} disabled>
            <option>{selectedDate}</option>
          </select>
        </div>
      </div>

      <div className="banner">
        <div className="banner-text" style={{ fontSize: '1.2rem', fontWeight: '600', textAlign: 'center', marginBottom: '1rem' }}>
          "We do not change the forecast. We change how much we trust it."
        </div>
        <div style={{ fontSize: '1rem', textAlign: 'center' }}>
          The same forecasted demand shown above is used here. The Decision Engine applies operational intelligence 
          to determine capacity commitment based on route-specific factors.
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">4-Factor Decision Lens</h2>
        <div className="card-content">
          <p style={{ marginBottom: '1.5rem' }}>
            The Decision Engine evaluates four operational factors that determine how forecasted demand translates 
            into capacity decisions:
          </p>

          <div className="chart-container" style={{ marginBottom: '2rem' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Demand Stability', value: parseFloat(decisionFactors.demandStability) },
                { name: 'Cost Exposure', value: parseFloat(decisionFactors.costExposure) },
                { name: 'Delay Risk', value: parseFloat(decisionFactors.delayRisk) },
                { name: 'Real-Time Flexibility', value: parseFloat(decisionFactors.flexibility) }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#4a5568" tick={{ fontSize: 12 }} />
                <YAxis stroke="#4a5568" tick={{ fontSize: 12 }} domain={[0, 100]} label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="value" fill="#e95b1c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="status-grid">
            <div className={`status-card ${getFactorStatus(parseFloat(decisionFactors.demandStability)).status === 'High' ? 'high' : getFactorStatus(parseFloat(decisionFactors.demandStability)).status === 'Low' ? 'low' : 'medium'}`}>
              <div className="status-label">1. Demand Stability</div>
              <div className="status-value">{decisionFactors.demandStability}%</div>
              <div className="status-description">
                {getFactorStatus(parseFloat(decisionFactors.demandStability)).status === 'High' 
                  ? 'Historical patterns are predictable' 
                  : getFactorStatus(parseFloat(decisionFactors.demandStability)).status === 'Low'
                  ? 'High volatility requires buffers'
                  : 'Moderate variability expected'}
              </div>
            </div>

            <div className={`status-card ${getFactorStatus(parseFloat(decisionFactors.costExposure)).status === 'High' ? 'low' : getFactorStatus(parseFloat(decisionFactors.costExposure)).status === 'Low' ? 'high' : 'medium'}`}>
              <div className="status-label">2. Cost Exposure</div>
              <div className="status-value">{decisionFactors.costExposure}%</div>
              <div className="status-description">
                {parseFloat(decisionFactors.costExposure) > 50
                  ? 'High fixed costs require utilization' 
                  : 'Variable costs allow flexibility'}
              </div>
            </div>

            <div className={`status-card ${getFactorStatus(parseFloat(decisionFactors.delayRisk), 'delayRisk').status.includes('High') ? 'low' : getFactorStatus(parseFloat(decisionFactors.delayRisk), 'delayRisk').status.includes('Low') ? 'high' : 'medium'}`}>
              <div className="status-label">3. Delay Risk</div>
              <div className="status-value">{decisionFactors.delayRisk}%</div>
              <div className="status-description">
                {getFactorStatus(parseFloat(decisionFactors.delayRisk), 'delayRisk').status}
              </div>
            </div>

            <div className={`status-card ${getFactorStatus(parseFloat(decisionFactors.flexibility), 'flexibility').status.includes('High') ? 'high' : 'low'}`}>
              <div className="status-label">4. Real-Time Flexibility</div>
              <div className="status-value">{decisionFactors.flexibility}%</div>
              <div className="status-description">
                {parseFloat(decisionFactors.flexibility) > 50
                  ? 'Can adjust capacity dynamically' 
                  : 'Limited real-time adjustment capability'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">How the Decision Lens Works</h2>
        <div className="card-content">
          <p style={{ marginBottom: '1rem' }}>
            The Decision Engine evaluates the same forecasted demand ({currentData.forecast?.forecasted_demand || 'N/A'} tons) 
            through four operational lenses:
          </p>
          <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
            <li><strong>Demand Stability ({decisionFactors.demandStability}%):</strong> 
              {parseFloat(decisionFactors.demandStability) > 70 
                ? ' High stability allows aggressive capacity commitments' 
                : ' Lower stability requires conservative buffering'}
            </li>
            <li><strong>Cost Exposure ({decisionFactors.costExposure}%):</strong> 
              {parseFloat(decisionFactors.costExposure) > 50 
                ? ' High fixed costs drive need for utilization maximization' 
                : ' Variable cost structure allows capacity flexibility'}
            </li>
            <li><strong>Delay Risk ({decisionFactors.delayRisk}%):</strong> 
              {parseFloat(decisionFactors.delayRisk) > 40 
                ? ' High delay risk requires conservative loading to protect service' 
                : ' Lower risk allows tighter capacity matching'}
            </li>
            <li><strong>Real-Time Flexibility ({decisionFactors.flexibility}%):</strong> 
              {parseFloat(decisionFactors.flexibility) > 50 
                ? ' High flexibility enables aggressive commitments with dynamic adjustment' 
                : ' Limited flexibility requires upfront conservative planning'}
            </li>
          </ul>
          <p style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid var(--fedex-orange)', fontWeight: '600' }}>
            These factors determine the capacity strategy shown in the Weekly Plan page. Two routes with identical 
            forecasts will commit different capacity based on these operational factors.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Forecast vs Decision</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Forecasted Demand</div>
            <div className="metric-value">
              {currentData.forecast?.forecasted_demand || 'N/A'}
              <span className="metric-unit"> tons</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
              This is our input (unchanged)
            </div>
          </div>
          <div className="metric-card" style={{ borderLeftColor: '#2e276c' }}>
            <div className="metric-label">Recommended Capacity Commitment</div>
            <div className="metric-value" style={{ color: '#2e276c' }}>
              {currentData.weeklyPlan?.committed_capacity || 'N/A'}
              <span className="metric-unit"> tons</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
              This is our decision (adjusted by factors)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecisionEngine;

