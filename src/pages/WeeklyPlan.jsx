import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { filterByRouteAndDate } from '../utils/dataLoader';

function WeeklyPlan({ data, selectedRoute, setSelectedRoute, selectedDate, routes, dates }) {
  const routeWeeklyPlan = useMemo(() => {
    if (!data || !data.weeklyPlan || !data.forecastData) return [];
    
    // Combine weekly plan with forecasts
    const weeklyData = data.weeklyPlan.filter(row => row.route === selectedRoute);
    const forecastData = data.forecastData.filter(row => row.route === selectedRoute);
    
    const combined = weeklyData.map(weekly => {
      const forecast = forecastData.find(f => (f.time_period || f.date) === weekly.date);
      return {
        date: weekly.date,
        committedCapacity: parseFloat(weekly.committed_capacity) || 0,
        forecastedDemand: parseFloat(forecast?.forecasted_demand) || 0,
        maxCapacity: parseFloat(weekly.max_capacity) || 0,
        strategy: weekly.utilization_strategy
      };
    });
    
    return combined.slice(0, 30); // Show first 30 days
  }, [data, selectedRoute]);

  const currentData = filterByRouteAndDate(data, selectedRoute, selectedDate);

  const getStrategyClass = (strategy) => {
    if (!strategy) return 'balanced';
    if (strategy.includes('Maximize')) return 'maximize';
    if (strategy.includes('Buffer')) return 'buffer';
    if (strategy.includes('Conservative')) return 'conservative';
    if (strategy.includes('Balanced')) return 'balanced';
    return 'balanced';
  };

  const strategy = currentData.weeklyPlan?.utilization_strategy || 'N/A';
  const committedCapacity = parseFloat(currentData.weeklyPlan?.committed_capacity) || 0;
  const forecastedDemand = parseFloat(currentData.forecast?.forecasted_demand) || 0;
  const maxCapacity = parseFloat(currentData.weeklyPlan?.max_capacity) || 0;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Weekly Plan</h1>
        <p className="page-subtitle">Committed capacity vs forecasted demand</p>
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

      <div className="card">
        <h2 className="card-title">Committed Capacity vs Forecasted Demand</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={routeWeeklyPlan}>
              <defs>
                <linearGradient id="colorCommitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2e276c" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2e276c" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e95b1c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#e95b1c" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#718096" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#718096" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#4a5568"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#4a5568"
                tick={{ fontSize: 12 }}
                label={{ value: 'Tons', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                labelStyle={{ color: '#2d3748', fontWeight: '600' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="maxCapacity" 
                name="Max Capacity" 
                stroke="#718096" 
                fillOpacity={1}
                fill="url(#colorMax)"
                strokeWidth={1}
                strokeDasharray="5 5"
              />
              <Area 
                type="monotone" 
                dataKey="forecastedDemand" 
                name="Forecasted Demand" 
                stroke="#e95b1c" 
                fillOpacity={1}
                fill="url(#colorForecast)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="committedCapacity" 
                name="Committed Capacity" 
                stroke="#2e276c" 
                fillOpacity={1}
                fill="url(#colorCommitted)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Current Period Strategy</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Forecasted Demand</div>
            <div className="metric-value">
              {forecastedDemand.toFixed(1)}
              <span className="metric-unit"> tons</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Committed Capacity</div>
            <div className="metric-value" style={{ color: '#2e276c' }}>
              {committedCapacity.toFixed(1)}
              <span className="metric-unit"> tons</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Max Capacity</div>
            <div className="metric-value">
              {maxCapacity.toFixed(0)}
              <span className="metric-unit"> tons</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Utilization Strategy</div>
            <div style={{ marginTop: '0.5rem' }}>
              <span className={`strategy-badge ${getStrategyClass(strategy)}`}>
                {strategy}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Capacity Commitment Explanation</h2>
        <div className="card-content">
          {committedCapacity < forecastedDemand ? (
            <div style={{ padding: '1rem', backgroundColor: '#fffaf0', borderRadius: '4px', borderLeft: '4px solid #ed8936', marginBottom: '1rem' }}>
              <strong>Under-Commitment Strategy:</strong> Committed capacity ({committedCapacity.toFixed(1)} tons) is 
              <strong> {(forecastedDemand - committedCapacity).toFixed(1)} tons below</strong> forecasted demand ({forecastedDemand.toFixed(1)} tons).
            </div>
          ) : (
            <div style={{ padding: '1rem', backgroundColor: '#f0fff4', borderRadius: '4px', borderLeft: '4px solid #48bb78', marginBottom: '1rem' }}>
              <strong>Aggressive Commitment Strategy:</strong> Committed capacity ({committedCapacity.toFixed(1)} tons) is 
              <strong> {(committedCapacity - forecastedDemand).toFixed(1)} tons above</strong> forecasted demand ({forecastedDemand.toFixed(1)} tons).
            </div>
          )}
          
          <p style={{ marginBottom: '1rem' }}>
            The capacity commitment reflects the strategy determined by the Decision Engine's 4-Factor Lens:
          </p>
          
          {strategy.includes('Maximize Utilization') && (
            <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
              <li>Route has high fixed costs requiring capacity utilization</li>
              <li>Low delay risk allows aggressive matching to forecast</li>
              <li>Demand stability supports confidence in commitments</li>
            </ul>
          )}
          
          {strategy.includes('Dynamic Buffer') && (
            <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
              <li>Route has real-time flexibility to adjust capacity</li>
              <li>Initial conservative commitment with ability to scale up</li>
              <li>Balances cost optimization with demand responsiveness</li>
            </ul>
          )}
          
          {strategy.includes('Conservative Loading') && (
            <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
              <li>High delay risk requires capacity buffer to protect service</li>
              <li>Demand volatility suggests conservative approach</li>
              <li>Acceptable white-tail to ensure reliability</li>
            </ul>
          )}
          
          {strategy.includes('Balanced Allocation') && (
            <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
              <li>Moderate factors suggest balanced approach</li>
              <li>Matches forecast while maintaining flexibility</li>
              <li>Standard risk-adjusted capacity commitment</li>
            </ul>
          )}

          <p style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '4px', borderLeft: '4px solid var(--fedex-navy)' }}>
            <strong>Key Insight:</strong> This capacity commitment (not the forecast) is what drives operational execution. 
            The strategy intentionally holds back capacity or maximizes it based on operational context, not forecast accuracy alone.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WeeklyPlan;

