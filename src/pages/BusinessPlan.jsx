import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { filterByRouteAndDate } from '../utils/dataLoader';

function BusinessPlan({ data, selectedRoute, setSelectedRoute, selectedDate, routes, dates }) {
  const routeBusinessPlan = useMemo(() => {
    if (!data || !data.businessPlan) return [];
    return data.businessPlan
      .filter(row => row.route === selectedRoute)
      .slice(0, 30) // Show first 30 days
      .map(row => ({
        date: row.date,
        plannedCapacity: parseFloat(row.planned_capacity) || 0,
        plannedNetWeight: parseFloat(row.planned_net_weight) || 0
      }));
  }, [data, selectedRoute]);

  const currentData = filterByRouteAndDate(data, selectedRoute, selectedDate);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Business Plan</h1>
        <p className="page-subtitle">Long-term, static planning assumptions</p>
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
        <h2 className="card-title">Planned Capacity vs Planned Net Weight</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={routeBusinessPlan}>
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
              <Line 
                type="monotone" 
                dataKey="plannedCapacity" 
                name="Planned Capacity" 
                stroke="#2e276c" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="plannedNetWeight" 
                name="Planned Net Weight" 
                stroke="#e95b1c" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Current Period Details</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Planned Capacity</div>
            <div className="metric-value">
              {currentData.businessPlan?.planned_capacity || 'N/A'}
              <span className="metric-unit"> tons</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Planned Net Weight</div>
            <div className="metric-value">
              {currentData.businessPlan?.planned_net_weight || 'N/A'}
              <span className="metric-unit"> tons</span>
            </div>
          </div>
        </div>
      </div>

      <div className="banner">
        <div className="banner-text">
          <strong>Static Planning Assumptions:</strong> The business plan represents long-term capacity commitments 
          based on historical averages and fixed assumptions. While useful for strategic planning, these static plans 
          fail under operational volatility. They assume demand patterns remain constant and do not account for 
          route-specific risk factors, cost structures, or real-time adaptability requirements.
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Why Static Plans Fail Under Volatility</h2>
        <div className="card-content">
          <p style={{ marginBottom: '1rem' }}>
            Static business plans create operational gaps because they:
          </p>
          <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
            <li>Assume demand follows predictable patterns without accounting for volatility</li>
            <li>Apply uniform utilization targets across all routes regardless of operational context</li>
            <li>Ignore route-specific cost structures (fixed vs variable cost mix)</li>
            <li>Do not consider asymmetric delay risks between routes</li>
            <li>Cannot adapt to real-time demand signals or operational constraints</li>
          </ul>
          <p style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fff5f5', borderRadius: '4px' }}>
            This is why forecasts alone are insufficient—they need operational intelligence to become actionable decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BusinessPlan;

