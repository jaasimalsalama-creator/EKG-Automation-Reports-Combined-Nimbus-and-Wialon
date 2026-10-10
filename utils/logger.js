function logger(req,res,next){
  const start=Date.now();
  res.on('finish',()=>{
    const duration=Date.now()-start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
}

function errorHandler(err,req,res,next){
  console.error('ERROR:', err.message);
  res.status(500).json({error:'internal error', requestId: Date.now()});
}

function notFound(req,res){
  res.status(404).json({error:'endpoint not found', available:['/api/events','/api/reports/daily','/api/fleet/status']});
}

module.exports = { logger, errorHandler, notFound };
