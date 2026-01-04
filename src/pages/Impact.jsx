import React, { useMemo } from 'react';
import { filterByRouteAndDate } from '../utils/dataLoader';

function Impact({ data, selectedRoute, setSelectedRoute, routes }) {
  const routeSummary = useMemo(() => {
    if (!data || !data.summary) return [];
    return data.summary.filter(row => row.route === selectedRoute);
  }, [data, selectedRoute]);

  // Calculate aggregate impact metrics
  const impactMetrics = useMemo(() => {
    if (routeSummary.length === 0) return {
      totalDays: 0,
      avgLoadFactor: 0,
      totalVoidReduction: 0,
      reliabilityImprovement: 0
    };

    const totalDays = routeSummary.length;
    const avgLoadFactor = routeSummary.reduce((sum, row) => sum + (parseFloat(row.load_factor) || 0), 0) / totalDays;
    
    // Estimate void reduction (simplified calculation)
    const totalVoid = routeSummary.reduce((sum, row) => sum + (parseFloat(row.void_capacity) || 0), 0);
    const avgVoid = totalVoid / totalDays;
    
    // Estimate reliability (based on actual vs committed)
    const totalCommitted = routeSummary.reduce((sum, row) => sum + (parseFloat(row.committed_capacity) || 0), 0);
    const totalActual = routeSummary.reduce((sum, row) => sum + (parseFloat(row.actual_net_weight) || 0), 0);
    const reliability = (totalActual / totalCommitted) * 100;

    return {
      totalDays,
      avgLoadFactor: avgLoadFactor || 0,
      avgVoid: avgVoid || 0,
      reliability: reliability || 0
    };
  }, [routeSummary]);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Impact</h1>
        <p className="page-subtitle">Executive Summary: Decision Intelligence in Action</p>
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
      </div>

      <div className="banner" style={{ backgroundColor: 'var(--fedex-navy)', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '600', textAlign: 'center', marginBottom: '1rem', color: 'var(--fedex-white)' }}>
          "We don't optimize planes. We optimize decisions."
        </div>
        <div style={{ fontSize: '1.1rem', textAlign: 'center', color: 'var(--fedex-light-gray)', lineHeight: '1.6' }}>
          The Opsium Decision Engine transforms how FedEx converts demand forecasts into operational capacity decisions. 
          By applying operational intelligence through the 4-Factor Decision Lens, we enable route-specific strategies 
          that balance utilization, reliability, and cost exposure.
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Business Impact Summary</h2>
        <div className="metrics-grid">
          <div className="metric-card" style={{ borderLeftColor: '#48bb78' }}>
            <div className="metric-label">Average Load Factor</div>
            <div className="metric-value" style={{ color: '#48bb78' }}>
              {impactMetrics.avgLoadFactor.toFixed(1)}
              <span className="metric-unit">%</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
              Over {impactMetrics.totalDays} days
            </div>
          </div>
          <div className="metric-card" style={{ borderLeftColor: '#e95b1c' }}>
            <div className="metric-label">Average Void Capacity</div>
            <div className="metric-value">
              {impactMetrics.avgVoid.toFixed(1)}
              <span className="metric-unit"> tons</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
              Strategy-optimized
            </div>
          </div>
          <div className="metric-card" style={{ borderLeftColor: '#2e276c' }}>
            <div className="metric-label">Service Reliability</div>
            <div className="metric-value" style={{ color: '#2e276c' }}>
              {impactMetrics.reliability.toFixed(1)}
              <span className="metric-unit">%</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
              Actual vs Committed
            </div>
          </div>
          <div className="metric-card" style={{ borderLeftColor: '#4299e1' }}>
            <div className="metric-label">Days Analyzed</div>
            <div className="metric-value" style={{ color: '#4299e1' }}>
              {impactMetrics.totalDays}
              <span className="metric-unit"> days</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
              Route: {selectedRoute}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Scalability Across Routes</h2>
        <div className="card-content">
          <p style={{ marginBottom: '1rem' }}>
            The Opsium Decision Engine approach scales across all FedEx routes because:
          </p>
          <div className="status-grid" style={{ marginTop: '1.5rem' }}>
            <div className="status-card high">
              <div className="status-label">Route-Agnostic Framework</div>
              <div className="status-description">
                The 4-Factor Decision Lens applies universally—every route can be evaluated on demand stability, 
                cost exposure, delay risk, and flexibility
              </div>
            </div>
            <div className="status-card high">
              <div className="status-label">Data-Driven Decisions</div>
              <div className="status-description">
                Each route's operational characteristics are measured objectively, eliminating subjective planning biases
              </div>
            </div>
            <div className="status-card high">
              <div className="status-label">Strategy Differentiation</div>
              <div className="status-description">
                Routes naturally cluster into strategies (Maximize Utilization, Dynamic Buffer, Conservative Loading, 
                Balanced Allocation) based on their operational profile
              </div>
            </div>
            <div className="status-card high">
              <div className="status-label">Continuous Improvement</div>
              <div className="status-description">
                Execution outcomes feed back into the decision lens, creating a learning system that improves over time
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">The Decision Intelligence Advantage</h2>
        <div className="card-content">
          <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
            Traditional capacity planning optimizes utilization against forecasts. Opsium optimizes decisions against 
            operational reality. This fundamental shift enables:
          </p>
          
          <ul style={{ marginLeft: '2rem', lineHeight: '2.5', fontSize: '1.05rem' }}>
            <li><strong>Operational Trust Over Statistical Confidence:</strong> We adjust how much we trust forecasts 
            operationally, not just accept statistical confidence levels</li>
            <li><strong>Route-Specific Strategies:</strong> Different routes get different strategies based on their 
            operational context, even with identical forecasts</li>
            <li><strong>Explainable Decisions:</strong> Every capacity commitment can be traced back to the 4-Factor 
            Decision Lens evaluation</li>
            <li><strong>Risk-Adjusted Planning:</strong> Capacity buffers are intentional and strategy-driven, not 
            accidental or wasteful</li>
            <li><strong>Cost-Aware Optimization:</strong> Fixed-cost routes maximize utilization; variable-cost routes 
            maintain flexibility</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Transformation Summary</h2>
        <div className="card-content">
          <div style={{ padding: '1.5rem', backgroundColor: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid var(--fedex-orange)', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--fedex-dark-blue)' }}>
              From Forecast Accuracy to Decision Quality
            </p>
            <p style={{ lineHeight: '1.8', color: 'var(--fedex-slate)' }}>
              The Opsium Decision Engine proves that forecast accuracy is necessary but not sufficient for operational 
              excellence. By converting demand forecasts into operationally sound capacity decisions through the 4-Factor 
              Decision Lens, we enable FedEx to balance utilization, reliability, and cost exposure at scale.
            </p>
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid var(--fedex-navy)' }}>
            <p style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--fedex-dark-blue)' }}>
              From One-Size-Fits-All to Route-Specific Intelligence
            </p>
            <p style={{ lineHeight: '1.8', color: 'var(--fedex-slate)' }}>
              Every route is unique. The Decision Engine recognizes this by evaluating each route's operational 
              characteristics and applying the appropriate strategy. Two routes with identical forecasts may receive 
              opposite capacity decisions—and both will be correct for their operational context.
            </p>
          </div>
        </div>
      </div>

      <div className="banner" style={{ textAlign: 'center', padding: '2.5rem', marginTop: '2rem' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--fedex-white)' }}>
          We don't optimize planes.
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--fedex-orange)' }}>
          We optimize decisions.
        </div>
        <div style={{ fontSize: '1.1rem', marginTop: '1.5rem', color: 'var(--fedex-light-gray)', lineHeight: '1.6' }}>
          The Opsium Decision Engine transforms capacity planning from a forecast-matching exercise into a 
          decision-intelligence system that accounts for operational reality, cost structures, and service requirements.
        </div>
      </div>
    </div>
  );
}

export default Impact;

