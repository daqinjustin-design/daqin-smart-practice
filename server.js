const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initDB, seedDefaultBanks } = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

// Security headers (relaxed CSP for inline styles/scripts)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// JSON body parser with 5MB limit (for large question banks)
app.use(express.json({ limit: '5mb' }));

// Rate limiting on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Request logging
app.use('/api', (req, res, next) => {
  const start = Date.now();
  const origJson = res.json.bind(res);
  res.json = function(data) {
    console.log(`[API] ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`);
    return origJson(data);
  };
  next();
});

// Mount API routes
app.use('/api', require('./routes/auth')(authLimiter));
app.use('/api/data', require('./routes/data'));
app.use('/api/banks', require('./routes/banks'));

// Serve static frontend with no-cache for HTML
app.use(express.static(path.join(__dirname, 'output'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// SPA fallback
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'output', 'index.html'));
});

// Initialize database, seed defaults, then start server
initDB().then(async () => {
  try {
    await seedDefaultBanks();
  } catch(e) {
    console.error('[Seed] Warning: failed to seed default banks:', e.message);
  }
  app.listen(PORT, () => {
    console.log(`大钦智能刷题 v1.0 running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
