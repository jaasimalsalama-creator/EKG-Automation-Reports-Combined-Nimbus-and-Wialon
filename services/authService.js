const crypto = require('crypto');

function hashApiKey(key){
  return crypto.createHash('sha256').update(key).digest('hex');
}

function generateApiKey(){
  return 'sk_' + crypto.randomBytes(16).toString('hex');
}

function verifyApiKey(plain, hashed){
  return hashApiKey(plain) === hashed;
}

function createToken(payload, secret='demo_secret_smartclip'){
  const header = Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
  const body = Buffer.from(JSON.stringify({...payload, iat: Date.now()})).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(header+'.'+body).digest('base64url');
  return `${header}.${body}.${sig}`;
}

module.exports = { hashApiKey, generateApiKey, verifyApiKey, createToken };
