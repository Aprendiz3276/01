export default function handler(req, res) {
  // Simple health check
  if (req.url === '/api/health' || req.url === '/health') {
    return res.status(200).json({
      status: 'ok',
      message: 'API is working',
      timestamp: new Date().toISOString(),
      DB_TYPE: process.env.DB_TYPE || 'not set',
      has_DATABASE_URL: !!process.env.DATABASE_URL
    });
  }

  // Root
  if (req.url === '/' || req.url === '') {
    return res.status(200).json({
      message: 'Parking API v1.0',
      endpoints: {
        health: '/api/health'
      }
    });
  }

  // 404
  res.status(404).json({ error: 'Not found' });
}

