module.exports = {
  port: process.env.PORT || 3000,
  db: {
    type: process.env.DB_TYPE || 'sqlite',
    url: process.env.DATABASE_URL || ':memory:'
  },
  api: {
    version: 'v1',
    rateLimit: 100, // req/min
    cacheTtl: 30000
  },
  fleet: {
    maxBatch: 1000,
    maxPageLimit: 100,
    idleThresholdMinutes: 60
  }
};
