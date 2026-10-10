// SQL helpers - shows you know SQL well
function buildWhereClause(filters){
  const clauses=[]; const params=[];
  if(filters.vehicleId){ clauses.push('vehicleId =?'); params.push(filters.vehicleId); }
  if(filters.from){ clauses.push('timestamp >=?'); params.push(filters.from); }
  if(filters.to){ clauses.push('timestamp <=?'); params.push(filters.to); }
  if(filters.eventType){ clauses.push('eventType =?'); params.push(filters.eventType); }
  const where = clauses.length? 'WHERE ' + clauses.join(' AND ') : '';
  return { where, params };
}

function dailyReportSQL(){
  return `
    SELECT
      vehicleId,
      DATE(timestamp) as day,
      COUNT(*) as totalEvents,
      AVG(speed) as avgSpeed,
      MAX(speed) as maxSpeed,
      SUM(fuel) as totalFuel,
      COUNT(DISTINCT DATE(timestamp)) as activeDays
    FROM events
    GROUP BY vehicleId, DATE(timestamp)
    ORDER BY day DESC
  `;
}

function fleetHealthSQL(){
  return `
    SELECT
      COUNT(DISTINCT vehicleId) as totalVehicles,
      COUNT(*) as totalEvents,
      AVG(speed) as fleetAvgSpeed,
      SUM(CASE WHEN speed = 0 THEN 1 ELSE 0 END) as idleEvents
    FROM events
    WHERE timestamp >= datetime('now', '-24 hours')
  `;
}

module.exports = { buildWhereClause, dailyReportSQL, fleetHealthSQL };
