function toCSV(rows){
  if(!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  rows.forEach(r=>{
    const line = headers.map(h=> `"${String(r[h]??'').replace(/"/g,'""')}"`).join(',');
    lines.push(line);
  });
  return lines.join('\n');
}

function exportDailyReportCSV(reportData){
  // reportData = [{vehicleId, day, totalEvents...}]
  return toCSV(reportData);
}

function exportFleetStatusCSV(statusData){
  return toCSV(statusData);
}

module.exports = { toCSV, exportDailyReportCSV, exportFleetStatusCSV };
