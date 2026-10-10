// Simple API-Key middleware - shows security mindset
function apiKeyAuth(req,res,next){
  const key = req.headers['x-api-key'];
  // demo key - in prod use env
  if(!key) return res.status(401).json({error:'x-api-key required'});
  // allow demo key
  if(key!== 'demo_smartclip_2026' && key!== process.env.API_KEY){
    return res.status(403).json({error:'invalid api key'});
  }
  next();
}

function rateLimiter(){
  const hits = new Map();
  return (req,res,next)=>{
    const ip = req.ip;
    const now = Date.now();
    const window = 60*1000; // 1 min
    const max = 100;
    if(!hits.has(ip)) hits.set(ip, []);
    const times = hits.get(ip).filter(t=> now - t < window);
    if(times.length >= max) return res.status(429).json({error:'too many requests'});
    times.push(now);
    hits.set(ip, times);
    next();
  }
}

module.exports = { apiKeyAuth, rateLimiter };
