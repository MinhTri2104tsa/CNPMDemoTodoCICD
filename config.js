// ==========================================
// APPLICATION CONFIGURATION
// ==========================================
// Centralized configuration file for easy version management
// Used by both backend and CI/CD pipeline

const config = {
  // Application version (update here for version changes)
  version: '1.0.0',
  
  // Application name
  appName: 'Todo List Application',
  
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
