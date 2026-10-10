// SQL Views & Materialized logic - advanced SQL
const views = {
  dailyMileage: `
    CREATE VIEW IF NOT EXISTS vw_daily_mileage AS
    SELECT vehicleId, DATE(timestamp) as day,
           COUNT(*) as pings,
           AVG(speed) as avgSpeed,
           MAX(speed) as topSpeed
    FROM events GROUP BY vehicleId, DATE(timestamp)
  `,
  fleetSummary: `
    CREATE VIEW IF NOT EXISTS vw_fleet_summary AS
    SELECT COUNT(DISTINCT vehicleId) as totalVehicles,
           COUNT(*) as totalEvents,
           AVG(speed) as fleetAvg
    FROM events
  `,
  fuelEfficiency: `
    CREATE VIEW IF NOT EXISTS vw_fuel_efficiency AS
    SELECT vehicleId, SUM(fuel) as totalFuel,
           COUNT(*) as trips,
           SUM(fuel)/NULLIF(COUNT(*),0) as avgFuelPerTrip
    FROM events GROUP BY vehicleId
  `
};

function initViews(db){
  Object.values(views).forEach(sql=> db.run(sql, err=>{ if(err) console.error(err.message); }));
  console.log('SQL Views ready');
}

module.exports = { views, initViews };
