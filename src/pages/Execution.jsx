import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { filterByRouteAndDate } from '../utils/dataLoader';

function Execution({ data, selectedRoute, setSelectedRoute, selectedDate, routes, dates }) {
  const executionData = useMemo(() => {
    if (!data || !data.execution || !data.weeklyPlan) return [];
    
    const execution = data.execution.filter(row => row.route === selectedRoute);
    const weeklyPlan = data.weeklyPlan.filter(row => row.route === selectedRoute);
    
    const combined = execution.map(exec => {
      const plan = weeklyPlan.find(p => p.date === exec.date);
      return {
        date: exec.date,
        actualNetWeight: parseFloat(exec.actual_net_weight) || 0,
        committedCapacity: parseFloat(plan?.committed_capacity) || 0,
        loadFactor: parseFloat(exec.load_factor) || 0,
        voidCapacity: parseFloat(exec.void_capacity) || 0
      };
    });
    
    return combined.slice(0, 30);
  }, [data, selectedRoute]);

  const currentData = filterByRouteAndDate(data, selectedRoute, selectedDate);
  
  const actualWeight = parseFloat(currentData.execution?.actual_net_weight) || 0;
  const committedCapacity = parseFloat(currentData.weeklyPlan?.committed_capacity) || 0;
  const loadFactor = parseFloat(currentData.execution?.load_factor) || 0;
  const voidCapacity = parseFloat(currentData.execution?.void_capacity) || 0;

  // Calculate reliability metrics
  const avgLoadFactor = useMemo(() => {
    if (executionData.length === 0) return 0;
    const sum = executionData.reduce((acc, item) => acc + item.loadFactor, 0);
    return sum / executionData.length;
  }, [executionData]);

  const getLoadFactorStatus = (lf) => {
    if (lf > 35) return { status: 'High Utilization', color: '#48bb78', bg: '#f0fff4' };
    if (lf > 25) return { status: 'Moderate Utilization', color: '#ed8936', bg: '#fffaf0' };
    return { status: 'Low Utilization', color: '#f56565', bg: '#fff5f5' };
  };

  const loadFactorStatus = getLoadFactorStatus(loadFactor);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Execution</h1>
        <p className="page-subtitle">Outcomes of strategy-driven planning</p>
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
        <h2 className="card-title">Actual Load vs Committed Capacity</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={executionData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e95b1c" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#e95b1c" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCommitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2e276c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2e276c" stopOpacity={0}/>
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
                dataKey="committedCapacity" 
                name="Committed Capacity" 
                stroke="#2e276c" 
                fillOpacity={1}
                fill="url(#colorCommitted)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="actualNetWeight" 
                name="Actual Net Weight" 
                stroke="#e95b1c" 
                fillOpacity={1}
                fill="url(#colorActual)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Current Period Execution Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Actual Net Weight</div>
            <div className="metric-value" style={{ color: '#e95b1c' }}>
              {actualWeight.toFixed(1)}
              <span className="metric-unit"> tons</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Committed Capacity</div>
            <div className="metric-value">
              {committedCapacity.toFixed(1)}
              <span className="metric-unit"> tons</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Load Factor</div>
            <div className="metric-value" style={{ color: loadFactorStatus.color }}>
              {loadFactor.toFixed(1)}
              <span className="metric-unit">%</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Void Capacity</div>
            <div className="metric-value">
              {voidCapacity.toFixed(1)}
              <span className="metric-unit"> tons</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`status-card ${loadFactorStatus.status.includes('High') ? 'high' : loadFactorStatus.status.includes('Low') ? 'low' : 'medium'}`} style={{ textAlign: 'center', padding: '2rem', marginBottom: '2rem' }}>
        <div className="status-label">Load Factor Status</div>
        <div className="status-value" style={{ color: loadFactorStatus.color, fontSize: '3rem' }}>
          {loadFactor.toFixed(1)}%
        </div>
        <div className="status-description">
          {loadFactorStatus.status}
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#718096' }}>
          Average Load Factor: {avgLoadFactor.toFixed(1)}%
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Execution Outcomes Analysis</h2>
        <div className="card-content">
          {actualWeight < committedCapacity ? (
            <div style={{ padding: '1rem', backgroundColor: '#fff5f5', borderRadius: '4px', borderLeft: '4px solid #f56565', marginBottom: '1rem' }}>
              <strong>Under-Utilization:</strong> Actual load ({actualWeight.toFixed(1)} tons) is 
              <strong> {(committedCapacity - actualWeight).toFixed(1)} tons below</strong> committed capacity ({committedCapacity.toFixed(1)} tons).
              <br />
              This results in {voidCapacity.toFixed(1)} tons of void capacity, representing a {loadFactor.toFixed(1)}% load factor.
            </div>
          ) : (
            <div style={{ padding: '1rem', backgroundColor: '#f0fff4', borderRadius: '4px', borderLeft: '4px solid #48bb78', marginBottom: '1rem' }}>
              <strong>Optimal Utilization:</strong> Actual load ({actualWeight.toFixed(1)} tons) matches or exceeds 
              committed capacity ({committedCapacity.toFixed(1)} tons).
              <br />
              Load factor: {loadFactor.toFixed(1)}% with {voidCapacity.toFixed(1)} tons of void capacity.
            </div>
          )}

          <p style={{ marginBottom: '1rem' }}>
            Execution outcomes reflect the strategy chosen by the Decision Engine:
          </p>
          <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
            <li><strong>Strategy-driven planning</strong> results in predictable utilization patterns</li>
            <li><strong>Conservative strategies</strong> intentionally accept lower utilization for service protection</li>
            <li><strong>Aggressive strategies</strong> maximize utilization but require accurate demand realization</li>
            <li><strong>Void capacity</strong> is not necessarily waste—it may represent intentional buffers for reliability</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Reliability Indicators</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Average Load Factor</div>
            <div className="metric-value">
              {avgLoadFactor.toFixed(1)}
              <span className="metric-unit">%</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
              Last 30 days
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Capacity Utilization</div>
            <div className="metric-value">
              {((actualWeight / committedCapacity) * 100).toFixed(1)}
              <span className="metric-unit">%</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
              Actual vs Committed
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Capacity Efficiency</div>
            <div className="metric-value" style={{ color: loadFactor > 30 ? '#48bb78' : '#f56565' }}>
              {loadFactor > 30 ? 'Optimal' : 'Conservative'}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
              Based on strategy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Execution;

