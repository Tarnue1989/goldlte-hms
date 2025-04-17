const http = require('http');
const os = require('os');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { sequelize } = require('./models');
const homeContentRoutes = require('./routes');

// 🌐 Get local IP
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
};

const HOST = 'localhost';
const PORT = process.env.PORT || 3000;
const FORCE_SYNC = process.env.FORCE_SYNC === 'true';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected!');

    await sequelize.sync({ force: FORCE_SYNC, alter: !FORCE_SYNC });
    console.log(
      FORCE_SYNC
        ? '🧨 Database synced with force: all tables dropped and recreated.'
        : '✅ Database synced without data loss (alter mode).'
    );

    // ✅ Mount APIs
    app.use('/api', homeContentRoutes);

    // 🚀 Start HTTP Server
    http.createServer(app).listen(PORT, HOST, () => {
      console.log(`🚀 HTTP server running at http://${HOST}:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to connect to DB:', err.message);
  }
})();
