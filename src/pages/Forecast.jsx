import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { filterByRouteAndDate } from '../utils/dataLoader';

function Forecast({ data, selectedRoute, setSelectedRoute, selectedDate, setSelectedDate, routes, dates }) {
  const routeForecast = useMemo(() => {
    if (!data || !data.forecastData) return [];
    return data.forecastData
      .filter(row => row.route === selectedRoute)
      .slice(0, 30) // Show first 30 days
      .map(row => ({
        date: row.time_period || row.date,
        baseDemand: parseFloat(row.base_demand) || 0,
        forecastedDemand: parseFloat(row.forecasted_demand) || 0,
        confidence: parseFloat(row.forecast_confidence) || 0
      }));
  }, [data, selectedRoute]);

  const currentData = filterByRouteAndDate(data, selectedRoute, selectedDate);
  const confidence = parseFloat(currentData.forecast?.forecast_confidence) || 0;

  const getConfidenceLevel = (conf) => {
    if (conf >= 0.85) return { level: 'High', color: '#48bb78', bg: '#f0fff4' };
    if (conf >= 0.70) return { level: 'Medium', color: '#ed8936', bg: '#fffaf0' };
    return { level: 'Low', color: '#f56565', bg: '#fff5f5' };
  };

  const confidenceInfo = getConfidenceLevel(confidence);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Forecast</h1>
        <p className="page-subtitle">Explainable demand forecasting</p>
      </div>

      <div className="control-group">
        <div className="control-item">
          <label className="control-label">Route</label>
          <select
            className="control-select"
            value={selectedRoute}
            onChange={(e) => {
              setSelectedRoute(e.target.value);
              const newDates = data.forecastData?.filter(row => row.route === e.target.value).map(row => row.time_period || row.date).filter(Boolean).sort() || [];
              if (newDates.length > 0) setSelectedDate(newDates[0]);
            }}
          >
            {routes.map(route => (
              <option key={route} value={route}>{route}</option>
            ))}
          </select>
        </div>
        <div className="control-item">
          <label className="control-label">Date</label>
          <select
            className="control-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Base Demand vs Forecasted Demand</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={routeForecast}>
              <defs>
                <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cbd5e0" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#cbd5e0" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e95b1c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#e95b1c" stopOpacity={0}/>
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
                dataKey="baseDemand" 
                name="Base Demand" 
                stroke="#718096" 
                fillOpacity={1}
                fill="url(#colorBase)"
                strokeWidth={2}
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
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Current Period Forecast Details</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Base Demand</div>
            <div className="metric-value">
              {currentData.forecast?.base_demand || 'N/A'}
              <span className="metric-unit"> tons</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Forecasted Demand</div>
            <div className="metric-value">
              {currentData.forecast?.forecasted_demand || 'N/A'}
              <span className="metric-unit"> tons</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Forecast Confidence</div>
            <div className="metric-value" style={{ color: confidenceInfo.color }}>
              {(confidence * 100).toFixed(0)}
              <span className="metric-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="status-card" style={{ borderColor: confidenceInfo.color, backgroundColor: confidenceInfo.bg, textAlign: 'center', padding: '2rem', marginBottom: '2rem' }}>
        <div className="status-label">Forecast Confidence Level</div>
        <div className="status-value" style={{ color: confidenceInfo.color, fontSize: '3rem' }}>
          {confidenceInfo.level}
        </div>
        <div className="status-description">
          Statistical confidence: {(confidence * 100).toFixed(1)}%
        </div>
      </div>

      <div className="banner" style={{ backgroundColor: '#fff5f5', borderLeftColor: '#f56565', color: '#742a2a' }}>
        <div className="banner-text" style={{ fontWeight: '600' }}>
          ⚠️ Important Warning: Forecast confidence does not equal operational safety.
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
          A high-confidence forecast (85%+) may still require conservative capacity planning if the route has high 
          delay risk, low flexibility, or high fixed costs. Conversely, a medium-confidence forecast may support 
          aggressive capacity if the route can absorb volatility efficiently.
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Understanding Forecast Confidence</h2>
        <div className="card-content">
          <p style={{ marginBottom: '1rem' }}>
            Forecast confidence represents statistical certainty in the demand prediction, but operational decisions 
            require additional context:
          </p>
          <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
            <li><strong>Statistical confidence</strong> measures prediction accuracy based on historical patterns</li>
            <li><strong>Operational trust</strong> adjusts capacity based on route-specific risk factors</li>
            <li><strong>High confidence ≠ High safety</strong> - Routes with high fixed costs need buffers even with accurate forecasts</li>
            <li><strong>Low confidence ≠ Low capacity</strong> - Flexible routes can handle uncertainty through dynamic adjustments</li>
          </ul>
          <p style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '4px', borderLeft: '4px solid var(--fedex-navy)' }}>
            The next section (Decision Engine) shows how we convert forecast confidence into operational trust using 
            the 4-Factor Decision Lens.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Forecast;

