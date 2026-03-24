// ==========================================
// TODO LIST API - Backend Server
// ==========================================
// Node.js server using Express framework
// Handles all REST API endpoints for todo operations
// ==========================================

const express = require('express');
const app = express();
const PORT = 3000;

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

  // Return created todo
  res.status(201).json(newTodo);
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
    return res.status(404).json({ 
      error: 'Todo not found' 
    });
  }

  // Update completed status
  if (typeof req.body.completed === 'boolean') {
    todo.completed = req.body.completed;
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
    return res.status(404).json({ 
      error: 'Todo not found' 
    });
  }

  // Remove from array
  const deletedTodo = todos.splice(index, 1);

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
  res.status(404).json({ 
    error: 'Endpoint not found' 
  });
});

/**
 * Error Handler Middleware
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

// ==========================================
// SERVER START
// ==========================================

app.listen(PORT, () => {
  console.log(`🚀 Todo List Server is running on http://localhost:${PORT}`);
  console.log('📝 API Documentation:');
  console.log('  GET    /todos      - Retrieve all todos');
  console.log('  POST   /todos      - Create new todo');
  console.log('  PUT    /todos/:id  - Update todo status');
  console.log('  DELETE /todos/:id  - Delete todo');
});
