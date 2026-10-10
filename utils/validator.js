function validateEvent(body){
  const errors=[];
  if(!body.vehicleId) errors.push('vehicleId required');
  if(body.lat && (body.lat < -90 || body.lat > 90)) errors.push('invalid lat');
  if(body.lon && (body.lon < -180 || body.lon > 180)) errors.push('invalid lon');
  if(body.speed && body.speed < 0) errors.push('speed cannot be negative');
  return { valid: errors.length===0, errors };
}

function sanitizeVehicleId(id){
  return String(id).trim().toUpperCase().replace(/[^A-Z0-9_-]/g,'');
}

function paginate(query){
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || 50;
  if(limit > 100) limit = 100; // protect DB
  if(page < 1) page = 1;
  const offset = (page-1)*limit;
  return { page, limit, offset };
}

module.exports = { validateEvent, sanitizeVehicleId, paginate };
