// ==========================================
// APPLICATION CONFIGURATION
// ==========================================
// Centralized configuration file for easy version management
// Used by both backend and CI/CD pipeline

const version = require('./version');

const config = {
  // Application version (imported from version.js)
  version: version,

  // Application name
  appName: 'Advanced Todo List Application',

  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    host: 'localhost'
  },

  // Application status
  status: 'running',

  // API configuration
  api: {
    timeout: 30000,
    maxTodos: 1000
  },

  // Logging configuration
  logging: {
    enabled: true,
    level: 'info'
  },

  // Environment
  environment: process.env.NODE_ENV || 'development'
};

module.exports = config;
