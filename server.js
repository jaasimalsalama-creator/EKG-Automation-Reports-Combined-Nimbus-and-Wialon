const express = require('express');
const cors = require('cors');
const config = require('./config');
const db = require('./db');
const eventRoutes = require('./routes/events');
const fleetRoutes = require('./routes/fleet');
const analyticsRoutes = require('./routes/analytics');
const { logger, errorHandler, notFound } = require('./utils/logger');
const { rateLimiter } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(rateLimiter());

app.use('/api', eventRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req,res)=> res.json({
  name:'Fleet & Ad-Tech API Demo - Node.js & SQL',
  version: config.api.version,
  endpoints:{
    events:'POST /api/events',
    list:'GET /api/events?page=1&limit=50',
    reports:'GET /api/reports/daily',
    analytics:['/api/analytics/top-vehicles','/api/analytics/hourly','/api/analytics/idle'],
    adTechAdapter:'services/adTechAdapter.js - shows ad-tech understanding'
  },
  stack:'Node.js, Express, SQL, Cache, Logger, RateLimiter',
  author:'Gassem Alsalamah'
}));

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, ()=> console.log(`API running on ${config.port}`));
