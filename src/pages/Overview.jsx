import React from 'react';
import { filterByRouteAndDate } from '../utils/dataLoader';

function Overview({ data, selectedRoute, setSelectedRoute, selectedDate, setSelectedDate, routes, dates }) {
  const routeData = filterByRouteAndDate(data, selectedRoute, selectedDate);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <p className="page-subtitle">Understanding the planning gap between forecasts and operational decisions</p>
      </div>

      <div className="control-group">
        <div className="control-item">
          <label className="control-label">Route</label>
          <select
            className="control-select"
            value={selectedRoute}
            onChange={(e) => {
              setSelectedRoute(e.target.value);
              const newDates = data ? data.forecastData?.filter(row => row.route === e.target.value).map(row => row.time_period || row.date).filter(Boolean).sort() : [];
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

        <div className="control-item">
          <label className="control-label">Flight</label>
          <select className="control-select" value={routeData.flightInfo?.flight_id || ''} disabled>
            <option>{routeData.flightInfo?.flight_id || 'N/A'}</option>
          </select>
        </div>
      </div>

      <div className="banner">
        <div className="banner-text">
          <strong>The Planning Gap:</strong> Traditional capacity planning treats demand forecasts as absolute truth. 
          Two routes with identical forecasted demand may require opposite capacity decisions based on operational context. 
          This application demonstrates how Opsium converts forecasts into operationally sound capacity decisions using 
          a 4-Factor Decision Lens that accounts for demand stability, cost exposure, delay risk, and real-time flexibility.
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Problem Statement</h2>
        <div className="card-content">
          <p style={{ marginBottom: '1rem' }}>
            Current FedEx capacity planning faces critical challenges:
          </p>
          <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
            <li><strong>Forecasts are treated as absolute truth</strong> - No operational adjustment for volatility</li>
            <li><strong>One-size-fits-all utilization targets</strong> - Same strategy regardless of route characteristics</li>
            <li><strong>Cost exposure varies by route</strong> - Fixed vs variable cost mix differs significantly</li>
            <li><strong>Delay risk is asymmetric</strong> - Some routes tolerate over-capacity better than others</li>
            <li><strong>Real-time flexibility is inconsistent</strong> - Not all routes can adapt to demand changes equally</li>
          </ul>
          <p style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fff5f5', borderRadius: '4px', borderLeft: '4px solid #e95b1c' }}>
            <strong>Result:</strong> White-tail capacity, load factor mismatch, service delays, and margin erosion
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">The Solution: Decision Intelligence Over Dashboards</h2>
        <div className="card-content">
          <p style={{ marginBottom: '1rem' }}>
            This application proves a fundamental principle:
          </p>
          <p style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--fedex-navy)', margin: '1.5rem 0', padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '8px', textAlign: 'center', border: '2px solid var(--fedex-orange)' }}>
            "Two routes with identical demand forecasts may require opposite capacity decisions."
          </p>
          <p style={{ marginTop: '1rem' }}>
            Forecasts are inputs. <strong>Decisions are the product.</strong> We do not change the forecast. 
            We change how much we trust it operationally, based on:
          </p>
          <div className="status-grid" style={{ marginTop: '1.5rem' }}>
            <div className="status-card">
              <div className="status-label">1. Demand Stability</div>
              <div className="status-description">Historical volatility patterns</div>
            </div>
            <div className="status-card">
              <div className="status-label">2. Cost Exposure</div>
              <div className="status-description">Fixed vs variable cost mix</div>
            </div>
            <div className="status-card">
              <div className="status-label">3. Delay Risk</div>
              <div className="status-description">Asymmetric operational impact</div>
            </div>
            <div className="status-card">
              <div className="status-label">4. Real-Time Flexibility</div>
              <div className="status-description">Ability to adjust capacity dynamically</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;

