// ==========================================
// TODO LIST APPLICATION - Frontend Script
// ==========================================
// Uses Fetch API and async/await
// Handles all frontend logic and UI updates
// ==========================================

// API Base URL
const API_URL = 'http://localhost:3000/todos';
const STATUS_URL = 'http://localhost:3000/status';

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyMessage = document.getElementById('emptyMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const totalTodosSpan = document.getElementById('totalTodos');
const completedTodosSpan = document.getElementById('completedTodos');
const appVersionSpan = document.getElementById('appVersion');
const appStatusSpan = document.getElementById('appStatus');

// ==========================================
// EVENT LISTENERS
// ==========================================

// Add todo when button is clicked
addBtn.addEventListener('click', handleAddTodo);

// Add todo when Enter key is pressed
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleAddTodo();
  }
});

// ==========================================
// MAIN FUNCTIONS
// ==========================================

/**
 * Load all todos from server and display them
 */
async function loadTodos() {
  try {
    showLoading(true);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Failed to load todos');
    }

    const todos = await response.json();
    renderTodos(todos);
    updateStats(todos);
  } catch (error) {
    console.error('Error loading todos:', error);
    alert('Failed to load todos. Please refresh the page.');
  } finally {
    showLoading(false);
  }
}

/**
 * Handle adding a new todo
 */
async function handleAddTodo() {
  const text = todoInput.value.trim();

  // Validate input
  if (!text) {
    alert('Please enter a todo text');
    return;
  }

  try {
    showLoading(true);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      throw new Error('Failed to create todo');
    }

    const newTodo = await response.json();
    
    // Clear input field
    todoInput.value = '';
    todoInput.focus();

    // Reload todos
    await loadTodos();
  } catch (error) {
    console.error('Error adding todo:', error);
    alert('Failed to add todo. Please try again.');
  } finally {
    showLoading(false);
  }
}

/**
 * Handle toggling todo completion status
 * @param {number} id - Todo ID
 * @param {boolean} completed - New completion status
 */
async function handleToggleTodo(id, completed) {
  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: !completed })
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    // Reload todos
    await loadTodos();
  } catch (error) {
    console.error('Error updating todo:', error);
    alert('Failed to update todo. Please try again.');
  } finally {
    showLoading(false);
  }
}

/**
 * Handle deleting a todo
 * @param {number} id - Todo ID
 */
async function handleDeleteTodo(id) {
  if (!confirm('Are you sure you want to delete this todo?')) {
    return;
  }

  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    // Reload todos
    await loadTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
    alert('Failed to delete todo. Please try again.');
  } finally {
    showLoading(false);
  }
}

// ==========================================
// UI RENDERING FUNCTIONS
// ==========================================

/**
 * Render todos list in DOM
 * @param {Array} todos - Array of todo objects
 */
function renderTodos(todos) {
  // Clear existing todos
  todoList.innerHTML = '';

  if (todos.length === 0) {
    // Show empty message
    emptyMessage.classList.remove('hidden');
  } else {
    // Hide empty message
    emptyMessage.classList.add('hidden');

    // Render each todo
    todos.forEach(todo => {
      const todoElement = createTodoElement(todo);
      todoList.appendChild(todoElement);
    });
  }
}

/**
 * Create a single todo element
 * @param {Object} todo - Todo object
 * @returns {HTMLElement} - Todo item element
 */
function createTodoElement(todo) {
  const div = document.createElement('div');
  div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  div.innerHTML = `
    <input 
      type="checkbox" 
      class="todo-checkbox" 
      ${todo.completed ? 'checked' : ''}
      onchange="handleToggleTodo(${todo.id}, ${todo.completed})"
    >
    <span class="todo-text">${escapeHtml(todo.text)}</span>
    <button class="btn-delete" onclick="handleDeleteTodo(${todo.id})">Delete</button>
  `;
  return div;
}

/**
 * Update stats (total and completed count)
 * @param {Array} todos - Array of todo objects
 */
function updateStats(todos) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  
  totalTodosSpan.textContent = total;
  completedTodosSpan.textContent = completed;
}

/**
 * Show or hide loading indicator
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show) {
  if (show) {
    loadingIndicator.classList.remove('hidden');
  } else {
    loadingIndicator.classList.add('hidden');
  }
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Fetch and display application version and status
 * Uses GET /status endpoint to get version info
 */
async function loadAppVersion() {
  try {
    const response = await fetch(STATUS_URL);
    if (response.ok) {
      const status = await response.json();
      
      // Update version display in header
      if (appVersionSpan) {
        appVersionSpan.textContent = `v${status.version}`;
        console.log(`📍 App Version: ${status.version}`);
      }
      
      // Update status display in footer
      if (appStatusSpan) {
        appStatusSpan.textContent = status.status;
        console.log(`✅ App Status: ${status.status}`);
      }
      
      // Log environment info
      console.log(`🌍 Environment: ${status.environment}`);
      console.log(`⏱️  Timestamp: ${status.timestamp}`);
    } else {
      console.warn('Failed to fetch app version');
      if (appStatusSpan) {
        appStatusSpan.textContent = 'offline';
      }
    }
  } catch (error) {
    console.error('Error fetching app version:', error);
    if (appStatusSpan) {
      appStatusSpan.textContent = 'offline';
    }
  }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Load todos when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Todo List Application loaded');
  
  // Fetch app version and status
  loadAppVersion();
  
  // Load todos list
  loadTodos();
});
