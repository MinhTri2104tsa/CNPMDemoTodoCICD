// ==========================================
// ADVANCED TODO LIST API - Backend Server
// ==========================================
// Node.js server using Express framework
// Enhanced with authentication, advanced todo model, and CI/CD features
// ==========================================

const express = require('express');
const config = require('./config');
const version = require('./version');

const app = express();
const PORT = config.server.port;

// ==========================================
// CUSTOM LOGGING
// ==========================================
// Structured logging for CI/CD visibility
function log(level, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

// ==========================================
// FAKE AUTHENTICATION MIDDLEWARE
// ==========================================
// Simple authentication for demo purposes
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    log('WARN', `Authentication failed: Missing or invalid Authorization header`);
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide Authorization: Bearer 123456'
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  if (token !== '123456') {
    log('WARN', `Authentication failed: Invalid token`);
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Please use Authorization: Bearer 123456'
    });
  }

  next();
}

// ==========================================
// MIDDLEWARE
// ==========================================

// Parse JSON requests
app.use(express.json());

// CORS middleware - allow requests from any origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static files from public directory
app.use(express.static('public'));

// ==========================================
// IN-MEMORY DATA STORE
// ==========================================

// Enhanced todo model with status, dueDate, and history
let todos = [];
let nextId = 1;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Validate todo input data
 * @param {Object} data - Todo data to validate
 * @returns {Object} - { isValid: boolean, errors: [] }
 */
function validateTodoData(data) {
  const errors = [];

  // Title validation
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  // Status validation
  const validStatuses = ['pending', 'in-progress', 'done'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('Status must be one of: pending, in-progress, done');
  }

  // Due date validation
  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.push('Due date must be a valid ISO date string');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate partial todo update data
 * @param {Object} data - Todo data to validate (only provided fields)
 * @returns {Object} - { isValid: boolean, errors: [] }
 */
function validateTodoUpdateData(data) {
  const errors = [];

  // Title validation (only if provided)
  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title must be a non-empty string');
    }
  }

  // Status validation (only if provided)
  const validStatuses = ['pending', 'in-progress', 'done'];
  if (data.status !== undefined && !validStatuses.includes(data.status)) {
    errors.push('Status must be one of: pending, in-progress, done');
  }

  // Due date validation (only if provided)
  if (data.dueDate !== undefined && data.dueDate !== null) {
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.push('Due date must be a valid ISO date string');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create a new todo with enhanced model
 * @param {Object} data - Todo data
 * @returns {Object} - New todo object
 */
function createTodo(data) {
  const now = new Date().toISOString();

  return {
    id: nextId++,
    title: data.title.trim(),
    status: data.status || 'pending',
    dueDate: data.dueDate || null,
    createdAt: now,
    history: [`Created at ${now}`]
  };
}

/**
 * Add history entry to todo
 * @param {Object} todo - Todo object
 * @param {string} action - Action description
 */
function addHistory(todo, action) {
  const timestamp = new Date().toISOString();
  todo.history.push(`${action} at ${timestamp}`);
}

// ==========================================
// API ENDPOINTS
// ==========================================

/**
 * GET /todos
 * Description: Retrieve all todos with optional filtering
 * Query params: status, keyword
 * Auth: Required
 */
app.get('/todos', authenticate, (req, res) => {
  let filteredTodos = [...todos];

  // Filter by status
  if (req.query.status) {
    filteredTodos = filteredTodos.filter(todo => todo.status === req.query.status);
  }

  // Filter by keyword (case-insensitive)
  if (req.query.keyword) {
    const keyword = req.query.keyword.toLowerCase();
    filteredTodos = filteredTodos.filter(todo =>
      todo.title.toLowerCase().includes(keyword)
    );
  }

  log('INFO', `GET /todos - Retrieved ${filteredTodos.length} todos (filtered from ${todos.length})`);
  res.json(filteredTodos);
});

/**
 * POST /todos
 * Description: Create a new todo
 * Body: { title: string, status?: string, dueDate?: string }
 * Auth: Required
 */
app.post('/todos', authenticate, (req, res) => {
  // Validate input
  const validation = validateTodoData(req.body);
  if (!validation.isValid) {
    log('WARN', `POST /todos - Validation failed: ${validation.errors.join(', ')}`);
    return res.status(400).json({
      error: 'Validation failed',
      details: validation.errors
    });
  }

  // Create new todo
  const newTodo = createTodo(req.body);
  todos.push(newTodo);

  log('INFO', `Todo created: "${newTodo.title}" (ID: ${newTodo.id}, Status: ${newTodo.status})`);
  res.status(201).json(newTodo);
});

/**
 * PUT /todos/:id
 * Description: Update a todo (status, title, dueDate)
 * Body: { title?: string, status?: string, dueDate?: string }
 * Auth: Required
 */
app.put('/todos/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    log('WARN', `PUT /todos/${id} - Todo not found`);
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Validate input if provided
  if (req.body.title !== undefined || req.body.status !== undefined || req.body.dueDate !== undefined) {
    const validation = validateTodoUpdateData(req.body);
    if (!validation.isValid) {
      log('WARN', `PUT /todos/${id} - Validation failed: ${validation.errors.join(', ')}`);
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }
  }

  // Track changes for history
  const changes = [];

  // Update fields
  if (req.body.title && req.body.title !== todo.title) {
    changes.push(`Title: "${todo.title}" → "${req.body.title}"`);
    todo.title = req.body.title.trim();
  }

  if (req.body.status && req.body.status !== todo.status) {
    changes.push(`Status: ${todo.status} → ${req.body.status}`);
    todo.status = req.body.status;
  }

  if (req.body.dueDate !== undefined && req.body.dueDate !== todo.dueDate) {
    changes.push(`Due date: ${todo.dueDate || 'none'} → ${req.body.dueDate || 'none'}`);
    todo.dueDate = req.body.dueDate;
  }

  // Add history entry if there were changes
  if (changes.length > 0) {
    addHistory(todo, `Updated: ${changes.join(', ')}`);
    log('INFO', `Todo updated: ID ${id} - ${changes.join(', ')}`);
  }

  res.json(todo);
});

/**
 * DELETE /todos/:id
 * Description: Delete a todo
 * Auth: Required
 */
app.delete('/todos/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    log('WARN', `DELETE /todos/${id} - Todo not found`);
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos.splice(index, 1)[0];
  log('INFO', `Todo deleted: "${deletedTodo.title}" (ID: ${id})`);

  res.json({
    message: 'Todo deleted successfully',
    deletedTodo: deletedTodo
  });
});

/**
 * GET /stats
 * Description: Get todo statistics dashboard
 * Auth: Required
 */
app.get('/stats', authenticate, (req, res) => {
  const stats = {
    total: todos.length,
    pending: todos.filter(t => t.status === 'pending').length,
    inProgress: todos.filter(t => t.status === 'in-progress').length,
    done: todos.filter(t => t.status === 'done').length
  };

  log('INFO', `GET /stats - ${JSON.stringify(stats)}`);
  res.json(stats);
});

/**
 * GET /todos/export
 * Description: Export todos data (CSV format) for downstream integrations
 * Auth: Required
 */
app.get('/todos/export', authenticate, (req, res) => {
  if (todos.length === 0) {
    return res.status(200).json({ message: 'No todos to export', data: [] });
  }

  // Use CSV output (commonly expected export format)
  const headers = ['id', 'title', 'status', 'dueDate', 'createdAt', 'history'];
  const csvRows = [headers.join(',')];

  todos.forEach(todo =>{
    const row = [
      todo.id,
      `"${todo.title.replace(/"/g, '""')}"`,
      todo.status,
      todo.dueDate || '',
      todo.createdAt,
      `"${todo.history.join(' | ').replace(/"/g, '""')}"`
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  log('INFO', `GET /todos/export - Exported ${todos.length} todos`);

  res.header('Content-Type', 'text/csv');
  res.attachment('todos-export.csv');
  res.send(csvContent);
});

/**
 * GET /status
 * Description: Get application status and version (for CI/CD)
 * Auth: NOT required (public endpoint)
 */
app.get('/status', (req, res) => {
  const status = {
    status: 'running',
    version: version,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  log('INFO', `GET /status - Application status: ${JSON.stringify(status)}`);
  res.json(status);
});

/**
 * GET /health
 * Description: Simple health check endpoint
 * Auth: NOT required (public endpoint)
 */
app.get('/health', (req, res) => {
  log('INFO', 'GET /health - Health check passed');
  res.json({ status: 'ok' });
});

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * 404 Not Found Handler
 */
app.use((req, res) => {
  log('WARN', `404 - Endpoint not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.path} does not exist`
  });
});

/**
 * Global Error Handler Middleware
 */
app.use((err, req, res, next) => {
  log('ERROR', `Server error: ${err.message}`);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  });
});

// ==========================================
// SERVER STARTUP
// ==========================================

app.listen(PORT, () => {
  log('INFO', '═══════════════════════════════════════════════════════');
  log('INFO', `🚀 Advanced Todo List Server is running!`);
  log('INFO', `📍 Server Address: http://localhost:${PORT}`);
  log('INFO', `📦 Version: ${version}`);
  log('INFO', `🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  log('INFO', '═══════════════════════════════════════════════════════');
  log('INFO', '📝 API Documentation:');
  log('INFO', '   GET    /todos              - Get all todos (with filtering)');
  log('INFO', '   POST   /todos              - Create new todo');
  log('INFO', '   PUT    /todos/:id          - Update todo');
  log('INFO', '   DELETE /todos/:id          - Delete todo');
  log('INFO', '   GET    /stats              - Get todo statistics');
  log('INFO', '   GET    /status             - Application status & version');
  log('INFO', '   GET    /health             - Health check');
  log('INFO', '═══════════════════════════════════════════════════════');
  log('INFO', '🔐 Authentication: Use header "Authorization: Bearer 123456"');
  log('INFO', '═══════════════════════════════════════════════════════');
});
