# Fleet Telematics Pipeline - Node.js & SQL (Personal Demo)

I cannot share the original ATS / Abu Dhabi Municipality code (private IP). This is my own sanitized rebuild showing the same architecture.

**Problem I solved in production:** Ingest 300+ vehicles telematics data via Wialon/Nimbus APIs, parse, store in SQL, generate automated reports - 99% uptime, officially recognized.

**This demo shows:**
- Node.js Express API: POST /api/events (ingestion), GET with pagination, GET /api/reports/daily (SQL aggregation)
- SQL: tables, indexes, GROUP BY reports (mileage, fuel)
- Clean code, validation, error handling

Stack: Node.js, SQL, REST, similar to high-volume ad-event ingestion at smartclip.

Run: npm install && npm start

I can walk through the production architecture in a 15-min call.
