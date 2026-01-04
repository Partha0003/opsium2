import Papa from 'papaparse';

// Load CSV file and parse it
async function loadCSV(filename) {
  try {
    const response = await fetch(filename);
    const text = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

// Load all data files
export async function loadAllData() {
  const [demandSignals, forecastData, flightCapacity, businessPlan, weeklyPlan, execution, summary] = await Promise.all([
    loadCSV('/customer_sku_demand_signals.csv'),
    loadCSV('/forecasted_demand_output.csv'),
    loadCSV('/flight_capacity_master.csv'),
    loadCSV('/business_plan_capacity.csv'),
    loadCSV('/weekly_plan_capacity.csv'),
    loadCSV('/execution_actuals.csv'),
    loadCSV('/planning_vs_execution_summary.csv')
  ]);

  return {
    demandSignals: demandSignals.filter(row => Object.keys(row).length > 1),
    forecastData: forecastData.filter(row => Object.keys(row).length > 1),
    flightCapacity: flightCapacity.filter(row => Object.keys(row).length > 1),
    businessPlan: businessPlan.filter(row => Object.keys(row).length > 1),
    weeklyPlan: weeklyPlan.filter(row => Object.keys(row).length > 1),
    execution: execution.filter(row => Object.keys(row).length > 1),
    summary: summary.filter(row => Object.keys(row).length > 1)
  };
}

// Helper function to get unique routes
export function getUniqueRoutes(data) {
  if (!data || !data.forecastData) return [];
  const routes = new Set(data.forecastData.map(row => row.route).filter(Boolean));
  return Array.from(routes);
}

// Helper function to get unique dates for a route
export function getUniqueDates(data, route) {
  if (!data || !data.forecastData) return [];
  const dates = new Set(
    data.forecastData
      .filter(row => row.route === route)
      .map(row => row.time_period || row.date)
      .filter(Boolean)
  );
  return Array.from(dates).sort();
}

// Helper function to filter data by route and date
export function filterByRouteAndDate(data, route, date) {
  if (!data) return {};
  
  const filterRow = (row) => {
    const rowRoute = row.route;
    const rowDate = row.time_period || row.date;
    return rowRoute === route && rowDate === date;
  };

  return {
    forecast: data.forecastData?.find(filterRow) || null,
    businessPlan: data.businessPlan?.find(filterRow) || null,
    weeklyPlan: data.weeklyPlan?.find(filterRow) || null,
    execution: data.execution?.find(filterRow) || null,
    summary: data.summary?.find(filterRow) || null,
    flightInfo: data.flightCapacity?.find(row => row.route === route) || null
  };
}

// Helper function to get route summary data
export function getRouteSummary(data, route) {
  if (!data || !data.summary) return [];
  return data.summary.filter(row => row.route === route);
}

