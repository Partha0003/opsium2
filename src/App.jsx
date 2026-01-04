import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { loadAllData, getUniqueRoutes, getUniqueDates } from './utils/dataLoader';
import Overview from './pages/Overview';
import BusinessPlan from './pages/BusinessPlan';
import Forecast from './pages/Forecast';
import DecisionEngine from './pages/DecisionEngine';
import WeeklyPlan from './pages/WeeklyPlan';
import Execution from './pages/Execution';
import Comparison from './pages/Comparison';
import Impact from './pages/Impact';

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Overview' },
    { path: '/business-plan', label: 'Business Plan' },
    { path: '/forecast', label: 'Forecast' },
    { path: '/decision-engine', label: 'Decision Engine' },
    { path: '/weekly-plan', label: 'Weekly Plan' },
    { path: '/execution', label: 'Execution' },
    { path: '/comparison', label: 'Comparison' },
    { path: '/impact', label: 'Impact' }
  ];

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-logo">FedEx Capacity Planning</div>
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function AppContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState('DEL-FRA');
  const [selectedDate, setSelectedDate] = useState('2026-01-01');

  useEffect(() => {
    async function fetchData() {
      try {
        const loadedData = await loadAllData();
        setData(loadedData);
        
        // Set default date if available
        const dates = getUniqueDates(loadedData, selectedRoute);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const routes = data ? getUniqueRoutes(data) : [];
  const dates = data ? getUniqueDates(data, selectedRoute) : [];

  const sharedProps = {
    data,
    selectedRoute,
    setSelectedRoute,
    selectedDate,
    setSelectedDate,
    routes,
    dates,
    loading
  };

  return (
    <div className="app-container">
      <Navigation />
      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <Routes>
          <Route path="/" element={<Overview {...sharedProps} />} />
          <Route path="/business-plan" element={<BusinessPlan {...sharedProps} />} />
          <Route path="/forecast" element={<Forecast {...sharedProps} />} />
          <Route path="/decision-engine" element={<DecisionEngine {...sharedProps} />} />
          <Route path="/weekly-plan" element={<WeeklyPlan {...sharedProps} />} />
          <Route path="/execution" element={<Execution {...sharedProps} />} />
          <Route path="/comparison" element={<Comparison {...sharedProps} />} />
          <Route path="/impact" element={<Impact {...sharedProps} />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

