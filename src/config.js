// ==========================================
// APPLICATION CONFIGURATION
// ==========================================
// Centralized configuration file for easy version management
// Used by both backend and CI/CD pipeline

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000
  }
};

module.exports = config;
