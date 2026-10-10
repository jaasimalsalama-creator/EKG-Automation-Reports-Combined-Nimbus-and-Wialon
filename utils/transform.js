// Transform raw Wialon/Nimbus data to clean DB format
function normalizeGps(raw){
  return {
    vehicleId: String(raw.id || raw.nm || '').toUpperCase(),
    lat: parseFloat(raw.pos?.y || raw.lat) || 0,
    lon: parseFloat(raw.pos?.x || raw.lon) || 0,
    speed: parseFloat(raw.pos?.s || raw.speed) || 0,
    fuel: parseFloat(raw.sensors?.fuel || raw.fuel) || 0,
    eventType: raw.event || 'gps'
  };
}

function batchNormalize(list){
  return list.map(normalizeGps).filter(e=> e.vehicleId && e.lat!==0);
}

function toGeoJSON(events){
  return {
    type: 'FeatureCollection',
    features: events.map(e=>({
      type:'Feature',
      properties:{vehicleId:e.vehicleId, speed:e.speed},
      geometry:{type:'Point', coordinates:[e.lon, e.lat]}
    }))
  };
}

function calculateDistance(lat1, lon1, lat2, lon2){
  const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

module.exports = { normalizeGps, batchNormalize, toGeoJSON, calculateDistance };
