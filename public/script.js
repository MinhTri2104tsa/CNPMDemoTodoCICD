// ==========================================
// ADVANCED TODO LIST APPLICATION - Frontend Script
// ==========================================
// Enhanced with status tracking, due dates, filtering, and stats
// Uses Fetch API and async/await with Bearer token auth
// ==========================================

/* eslint-disable no-unused-vars */

// API Configuration
const API_BASE_URL = window.location.origin;
const API_URL = `${API_BASE_URL}/todos`;
const STATUS_URL = `${API_BASE_URL}/status`;
const STATS_URL = `${API_BASE_URL}/stats`;
const AUTH_HEADER = 'Bearer 123456';

// DOM Elements
const todoInput = document.getElementById('todoInput');
const statusSelect = document.getElementById('statusSelect');
const dueDateInput = document.getElementById('dueDateInput');
const addBtn = document.getElementById('addBtn');
const filterStatus = document.getElementById('filterStatus');
const filterKeyword = document.getElementById('filterKeyword');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const todoList = document.getElementById('todoList');
const emptyMessage = document.getElementById('emptyMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const totalTodosSpan = document.getElementById('totalTodos');
const pendingTodosSpan = document.getElementById('pendingTodos');
const inProgressTodosSpan = document.getElementById('inProgressTodos');
const doneTodosSpan = document.getElementById('doneTodos');
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

// Filter event listeners
filterStatus.addEventListener('change', handleFilterChange);
filterKeyword.addEventListener('input', handleFilterChange);
clearFiltersBtn.addEventListener('click', clearFilters);

// ==========================================
// MAIN FUNCTIONS
// ==========================================

/**
 * Load all todos from server and display them
 */
async function loadTodos() {
  try {
    showLoading(true);
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': AUTH_HEADER
      }
    });

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
 * Load stats from server
 */
async function loadStats() {
  try {
    const response = await fetch(STATS_URL, {
      headers: {
        'Authorization': AUTH_HEADER
      }
    });

    if (response.ok) {
      const stats = await response.json();
      updateStatsDisplay(stats);
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

/**
 * Handle adding a new todo
 */
async function handleAddTodo() {
  const title = todoInput.value.trim();
  const status = statusSelect.value;
  const dueDate = dueDateInput.value;

  // Validate input
  if (!title) {
    alert('Please enter a todo title');
    return;
  }

  try {
    showLoading(true);
    const todoData = {
      title: title,
      status: status
    };

    if (dueDate) {
      todoData.dueDate = dueDate;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_HEADER
      },
      body: JSON.stringify(todoData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create todo');
    }

    // Clear input fields
    todoInput.value = '';
    dueDateInput.value = '';
    statusSelect.value = 'pending';
    todoInput.focus();

    // Reload todos and stats
    await loadTodos();
    await loadStats();
  } catch (error) {
    console.error('Error adding todo:', error);
    alert(`Failed to add todo: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

/**
 * Handle updating todo status
 * @param {number} id - Todo ID
 * @param {string} newStatus - New status
 */
async function handleUpdateStatus(id, newStatus) {
  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_HEADER
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    // Reload todos and stats
    await loadTodos();
    await loadStats();
  } catch (error) {
    console.error('Error updating todo:', error);
    alert('Failed to update todo. Please try again.');
  } finally {
    showLoading(false);
  }
}

/**
 * Handle updating todo title
 * @param {number} id - Todo ID
 * @param {string} newTitle - New title
 */
async function handleUpdateTitle(id, newTitle) {
  if (!newTitle.trim()) {
    alert('Title cannot be empty');
    return;
  }

  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_HEADER
      },
      body: JSON.stringify({ title: newTitle.trim() })
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
      method: 'DELETE',
      headers: {
        'Authorization': AUTH_HEADER
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    // Reload todos and stats
    await loadTodos();
    await loadStats();
  } catch (error) {
    console.error('Error deleting todo:', error);
    alert('Failed to delete todo. Please try again.');
  } finally {
    showLoading(false);
  }
}

/**
 * Handle filter changes
 */
function handleFilterChange() {
  loadTodos();
}

/**
 * Clear all filters
 */
function clearFilters() {
  filterStatus.value = '';
  filterKeyword.value = '';
  loadTodos();
}

// ==========================================
// UI RENDERING FUNCTIONS
// ==========================================

/**
 * Render todos list in DOM with filtering
 * @param {Array} todos - Array of todo objects
 */
function renderTodos(todos) {
  // Apply filters
  const statusFilter = filterStatus.value;
  const keywordFilter = filterKeyword.value.toLowerCase();

  let filteredTodos = todos;

  if (statusFilter) {
    filteredTodos = filteredTodos.filter(todo => todo.status === statusFilter);
  }

  if (keywordFilter) {
    filteredTodos = filteredTodos.filter(todo =>
      todo.title.toLowerCase().includes(keywordFilter)
    );
  }

  // Clear existing todos
  todoList.innerHTML = '';

  if (filteredTodos.length === 0) {
    // Show empty message
    emptyMessage.classList.remove('hidden');
    if (todos.length === 0) {
      emptyMessage.innerHTML = '<p>📭 No todos yet. Add one to get started!</p>';
    } else {
      emptyMessage.innerHTML = '<p>🔍 No todos match your filters.</p>';
    }
  } else {
    // Hide empty message
    emptyMessage.classList.add('hidden');

    // Render each todo
    filteredTodos.forEach(todo => {
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
  div.className = `todo-item status-${todo.status}`;

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#ffa726' },
    { value: 'in-progress', label: 'In Progress', color: '#42a5f5' },
    { value: 'done', label: 'Done', color: '#66bb6a' }
  ];

  const currentStatus = statusOptions.find(s => s.value === todo.status);
  const statusColor = currentStatus ? currentStatus.color : '#999';

  const dueDateDisplay = todo.dueDate ? formatDate(todo.dueDate) : 'No due date';
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'done';

  div.innerHTML = `
    <div class="todo-header">
      <span class="todo-title" contenteditable="true" onblur="handleUpdateTitle(${todo.id}, this.textContent)">${escapeHtml(todo.title)}</span>
      <div class="todo-actions">
        <select class="status-dropdown" onchange="handleUpdateStatus(${todo.id}, this.value)" style="background-color: ${statusColor}">
          ${statusOptions.map(option =>
            `<option value="${option.value}" ${option.value === todo.status ? 'selected' : ''}>${option.label}</option>`
          ).join('')}
        </select>
        <button class="btn-delete" onclick="handleDeleteTodo(${todo.id})">🗑️</button>
      </div>
    </div>
    <div class="todo-details">
      <div class="todo-meta">
        <small class="todo-date">Created: ${formatDate(todo.createdAt)}</small>
        <small class="todo-due ${isOverdue ? 'overdue' : ''}">Due: ${dueDateDisplay}</small>
      </div>
      ${todo.history && todo.history.length > 0 ? `
        <div class="todo-history">
          <small>History: ${todo.history.length} change${todo.history.length > 1 ? 's' : ''}</small>
        </div>
      ` : ''}
    </div>
  `;

  return div;
}

/**
 * Update stats display from server stats
 * @param {Object} stats - Stats object from server
 */
function updateStatsDisplay(stats) {
  totalTodosSpan.textContent = stats.total || 0;
  pendingTodosSpan.textContent = stats.pending || 0;
  inProgressTodosSpan.textContent = stats.inProgress || 0;
  doneTodosSpan.textContent = stats.done || 0;
}

/**
 * Update stats (fallback local calculation)
 * @param {Array} todos - Array of todo objects
 */
function updateStats(todos) {
  // This is a fallback - we prefer server stats
  if (!todos) return;

  const total = todos.length;
  const pending = todos.filter(t => t.status === 'pending').length;
  const inProgress = todos.filter(t => t.status === 'in-progress').length;
  const done = todos.filter(t => t.status === 'done').length;

  totalTodosSpan.textContent = total;
  pendingTodosSpan.textContent = pending;
  inProgressTodosSpan.textContent = inProgress;
  doneTodosSpan.textContent = done;
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
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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

      // Log timestamp
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

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Advanced Todo List Application loaded');

  // Fetch app version and status
  loadAppVersion();

  // Load todos and stats
  loadTodos();
  loadStats();
});
