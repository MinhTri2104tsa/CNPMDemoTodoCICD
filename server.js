// ==========================================
// TODO LIST API - Backend Server
// ==========================================
// Node.js server using Express framework
// Handles all REST API endpoints for todo operations
// ==========================================

const express = require('express');
const config = require('./config');

const app = express();
const PORT = config.server.port;

// ==========================================
// CUSTOM LOGGING
// ==========================================
// Simple logging function for CI/CD visibility
function log(level, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

// Middleware to parse JSON requests
app.use(express.json());

// CORS middleware - allow requests from any origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static files from public directory
app.use(express.static('public'));

// In-memory array to store todos (no database)
let todos = [];
let nextId = 1;

// ==========================================
// API ENDPOINTS
// ==========================================

/**
 * GET /todos
 * Description: Retrieve all todos
 * Response: Array of todo objects
 */
app.get('/todos', (req, res) => {
  log('info', 'GET /todos - Retrieving all todos');
  res.json(todos);
});

/**
 * POST /todos
 * Description: Create a new todo
 * Body: { text: string }
 * Response: Created todo object with ID
 */
app.post('/todos', (req, res) => {
  // Validate input - no empty todos
  if (!req.body.text || req.body.text.trim() === '') {
    log('warn', 'POST /todos - Invalid request: empty text');
    return res.status(400).json({ 
      error: 'Todo text cannot be empty' 
    });
  }

  // Create new todo with unique ID
  const newTodo = {
    id: nextId++,
    text: req.body.text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  // Add to todos array
  todos.push(newTodo);

  // Log the addition
  log('info', `POST /todos - New todo created: "${newTodo.text}" (ID: ${newTodo.id})`);

  // Return created todo
  res.status(201).json(newTodo);
});

/**
 * GET /status
 * Description: Get application status and health check
 * Response: Status object with version and timestamp
 * IMPORTANT: For CI/CD demo - shows app is running
 */
app.get('/status', (req, res) => {
  log('info', 'GET /status - Health check request');
  
  const status = {
    status: config.status,
    version: config.version,
    appName: config.appName,
    environment: config.environment,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    totalTodos: todos.length
  };
  
  log('info', `Status: ${JSON.stringify(status)}`);
  res.json(status);
});

/**
 * PUT /todos/:id
 * Description: Update todo status (mark as completed/uncompleted)
 * Body: { completed: boolean }
 * Response: Updated todo object
 */
app.put('/todos/:id', (req, res) => {
  // Find todo by ID
  const todo = todos.find(t => t.id === parseInt(req.params.id));

  // Handle not found
  if (!todo) {
    log('warn', `PUT /todos/${req.params.id} - Todo not found`);
    return res.status(404).json({ 
      error: 'Todo not found' 
    });
  }

  // Update completed status
  if (typeof req.body.completed === 'boolean') {
    todo.completed = req.body.completed;
    log('info', `PUT /todos/${req.params.id} - Todo updated: "${todo.text}" (completed: ${todo.completed})`);
  }

  // Return updated todo
  res.json(todo);
});

/**
 * DELETE /todos/:id
 * Description: Delete a todo
 * Response: Success message
 */
app.delete('/todos/:id', (req, res) => {
  // Find index of todo
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));

  // Handle not found
  if (index === -1) {
    log('warn', `DELETE /todos/${req.params.id} - Todo not found`);
    return res.status(404).json({ 
      error: 'Todo not found' 
    });
  }

  // Remove from array
  const deletedTodo = todos.splice(index, 1);

  // Log the deletion
  log('info', `DELETE /todos/${req.params.id} - Todo deleted: "${deletedTodo[0].text}"`);

  // Return deleted todo
  res.json({ 
    message: 'Todo deleted successfully',
    deletedTodo: deletedTodo[0]
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * 404 Not Found Handler
 */
app.use((req, res) => {
  log('warn', `404 - Endpoint not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Endpoint not found' 
  });
});

/**
 * Error Handler Middleware
 */
app.use((err, req, res, next) => {
  log('error', `Server error: ${err.stack}`);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

// ==========================================
// SERVER START
// ==========================================

app.listen(PORT, () => {
  log('info', '═══════════════════════════════════════════════════════');
  log('info', `🚀 ${config.appName} is running!`);
  log('info', `📍 Server Address: http://localhost:${PORT}`);
  log('info', `📦 Version: ${config.version}`);
  log('info', `🌍 Environment: ${config.environment}`);
  log('info', '═══════════════════════════════════════════════════════');
  log('info', '📝 API Documentation:');
  log('info', '   GET    /todos      - Retrieve all todos');
  log('info', '   POST   /todos      - Create new todo');
  log('info', '   PUT    /todos/:id  - Update todo status');
  log('info', '   DELETE /todos/:id  - Delete todo');
  log('info', '   GET    /status     - Application health check & version');
  log('info', '═══════════════════════════════════════════════════════');
});
