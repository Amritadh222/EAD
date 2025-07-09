const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware with enhanced logging
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  console.log('================================\n');
  next();
});

// Test database connection on startup
console.log('Testing database connection...');
const db = require('./config/database');
db.execute('SELECT 1 as test')
  .then((result) => {
    console.log('✅ Database connection successful:', result[0]);
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    console.error('Make sure MySQL is running and credentials are correct');
  });

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

// API Routes with error boundary
app.use('/api', (req, res, next) => {
  console.log(`API Route: ${req.method} ${req.url}`);
  next();
}, noteRoutes);

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('\n❌ SERVER ERROR:');
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('Body:', req.body);
  console.error('Error Stack:', err.stack);
  console.error('Error Message:', err.message);
  console.error('========================\n');
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Note Taking App is ready!`);
  console.log(`🔍 Debug mode enabled - check console for detailed logs`);
});