// In-memory cache - important for scalable APIs
class SimpleCache{
  constructor(ttl=60000){ this.store=new Map(); this.ttl=ttl; }
  set(key,value){
    this.store.set(key,{value, expiry: Date.now()+this.ttl});
  }
  get(key){
    const item=this.store.get(key);
    if(!item) return null;
    if(Date.now() > item.expiry){ this.store.delete(key); return null; }
    return item.value;
  }
  clear(){ this.store.clear(); }
  stats(){ return {size:this.store.size}; }
}

const reportCache = new SimpleCache(30*1000); // 30 sec cache for reports

function withCache(cache, key, fetchFn, callback){
  const cached = cache.get(key);
  if(cached) return callback(null, cached);
  fetchFn((err,data)=>{
    if(!err) cache.set(key,data);
    callback(err,data);
  });
}

module.exports = { SimpleCache, reportCache, withCache };
