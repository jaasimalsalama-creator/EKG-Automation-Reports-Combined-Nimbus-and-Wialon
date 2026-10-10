function asyncHandler(fn){
  return (req,res,next)=> Promise.resolve(fn(req,res,next)).catch(next);
}

function globalErrorHandler(err,req,res,next){
  console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);
  if(err.code==='SQLITE_ERROR') return res.status(400).json({error:'invalid SQL query', details: err.message});
  res.status(err.status||500).json({error: err.message||'internal server error'});
}

function validateJson(err,req,res,next){
  if(err instanceof SyntaxError && err.status===400 && 'body' in err){
    return res.status(400).json({error:'invalid JSON body'});
  }
  next();
}

module.exports = { asyncHandler, globalErrorHandler, validateJson };
