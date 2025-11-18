// server.js
// A simple Node.js proxy backend using Express and http-proxy-middleware

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// Middleware for security and logging
app.use(helmet());
app.use(morgan('dev'));

// Example: Proxy requests to different upstream APIs
// Proxy /api → JSONPlaceholder
app.use('/api', createProxyMiddleware({
  target: 'https://jsonplaceholder.typicode.com',
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

// Proxy /auth → Example Auth server
app.use('/auth', createProxyMiddleware({
  target: 'https://reqres.in', // demo auth API
  changeOrigin: true,
  pathRewrite: { '^/auth': '' },
}));

// Proxy /data → Another backend service
app.use('/data', createProxyMiddleware({
  target: 'https://httpbin.org', // demo data API
  changeOrigin: true,
  pathRewrite: { '^/data': '' },
}));

// Health check route
app.get('/', (req, res) => {
  res.send('Proxy backend is running!');
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});
