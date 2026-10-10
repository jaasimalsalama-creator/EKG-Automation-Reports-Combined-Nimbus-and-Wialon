// Adapter pattern - same ingestion logic for telematics and ad events
// This shows smartclip you understand ad-tech

function mapAdEventToDb(adEvent){
  return {
    vehicleId: adEvent.deviceId || adEvent.adId, // reuse vehicleId field for device
    lat: adEvent.geo?.lat || null,
    lon: adEvent.geo?.lon || null,
    speed: adEvent.bitrate || 0, // reuse speed for bitrate
    fuel: adEvent.duration || 0, // reuse fuel for ad duration
    eventType: adEvent.eventType // impression, click, complete
  };
}

function calculateFillRate(impressions, requests){
  if(requests===0) return 0;
  return (impressions/requests*100).toFixed(2);
}

function calculateLatencyStats(latencies){
  if(!latencies.length) return {avg:0,p95:0,p99:0};
  const sorted = [...latencies].sort((a,b)=>a-b);
  const avg = sorted.reduce((s,v)=>s+v,0)/sorted.length;
  const p95 = sorted[Math.floor(sorted.length*0.95)];
  const p99 = sorted[Math.floor(sorted.length*0.99)];
  return {avg: Math.round(avg), p95, p99};
}

function aggregateAdReports(events){
  // SQL-like aggregation in JS for demo
  const map = new Map();
  events.forEach(e=>{
    if(!map.has(e.vehicleId)) map.set(e.vehicleId,{impressions:0, clicks:0, completes:0});
    const r = map.get(e.vehicleId);
    if(e.eventType==='impression') r.impressions++;
    if(e.eventType==='click') r.clicks++;
    if(e.eventType==='complete') r.completes++;
  });
  return Array.from(map.entries()).map(([id,stats])=>({
    adId: id,
    ...stats,
    ctr: stats.impressions? (stats.clicks/stats.impressions*100).toFixed(2)+'%' : '0%'
  }));
}

module.exports = { mapAdEventToDb, calculateFillRate, calculateLatencyStats, aggregateAdReports };
