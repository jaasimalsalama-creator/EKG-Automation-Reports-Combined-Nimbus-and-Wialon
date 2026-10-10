const { validateEvent, paginate } = require('../utils/validator');

function validateEventMiddleware(req,res,next){
  const { valid, errors } = validateEvent(req.body);
  if(!valid) return res.status(400).json({error:'validation failed', details:errors});
  next();
}

function validatePaginationMiddleware(req,res,next){
  const { page, limit, offset } = paginate(req.query);
  req.pagination = { page, limit, offset };
  next();
}

function validateVehicleIdMiddleware(req,res,next){
  const id = req.params.id || req.query.vehicleId;
  if(id &&!/^[A-Z0-9_-]{2,20}$/i.test(id)) return res.status(400).json({error:'invalid vehicleId format'});
  next();
}

module.exports = { validateEventMiddleware, validatePaginationMiddleware, validateVehicleIdMiddleware };
