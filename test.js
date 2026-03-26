// ==========================================
// ADVANCED TODO LIST - COMPREHENSIVE TEST SUITE
// ==========================================
// Tests enhanced features: auth, filtering, stats, validation
// Includes one failing scenario for CI/CD demo
// ==========================================

const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const AUTH_HEADER = 'Bearer 123456';

const TESTS = {
  passed: 0,
  failed: 0,
  results: []
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Make HTTP request to the API
 * @param {string} method - HTTP method
 * @param {string} path - URL path
 * @param {object} body - Request body (optional)
 * @param {object} headers - Additional headers (optional)
 * @returns {Promise} - Response data
 */
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': AUTH_HEADER,
      ...headers
    };

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: defaultHeaders
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Log test result
 * @param {string} testName - Name of the test
 * @param {boolean} passed - Whether test passed
 * @param {string} message - Optional message
 */
function logTestResult(testName, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} | ${testName}`);
  if (message) {
    console.log(`   └─ ${message}`);
  }

  TESTS.results.push({
    name: testName,
    passed,
    message
  });

  if (passed) {
    TESTS.passed++;
  } else {
    TESTS.failed++;
  }
}

/**
 * Assert condition and log result
 * @param {string} testName - Test name
 * @param {boolean} condition - Condition to assert
 * @param {string} message - Message
 */
function assert(testName, condition, message = '') {
  logTestResult(testName, condition, message);
}

// ==========================================
// TEST SUITE
// ==========================================

async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🧪 ADVANCED TODO LIST - COMPREHENSIVE TEST SUITE');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ==========================================
    // TEST GROUP 1: HEALTH CHECKS
    // ==========================================
    console.log('📍 Test Group 1: Health Checks\n');

    // Test /status endpoint
    try {
      const statusResponse = await makeRequest('GET', '/status', null, {});
      assert(
        '/status returns 200 without auth',
        statusResponse.status === 200,
        `Status: ${statusResponse.status}`
      );

      const { status, version, timestamp } = statusResponse.body || {};
      assert(
        '/status returns correct structure',
        status && version && timestamp,
        `Version: ${version}, Status: ${status}`
      );

      assert(
        'Status is "running"',
        status === 'running',
        `Status: ${status}`
      );

      console.log(`   📦 App Version: ${version}`);
      console.log(`   ⏱️  Timestamp: ${timestamp}\n`);

    } catch (error) {
      logTestResult(
        '/status endpoint test',
        false,
        `Error: ${error.message}`
      );
    }

    // Test /health endpoint
    try {
      const healthResponse = await makeRequest('GET', '/health', null, {});
      assert(
        '/health returns 200 without auth',
        healthResponse.status === 200,
        `Status: ${healthResponse.status}`
      );

      assert(
        '/health returns {status: "ok"}',
        healthResponse.body && healthResponse.body.status === 'ok',
        'Health check response'
      );

      console.log('   ✅ Health check passed\n');

    } catch (error) {
      logTestResult(
        '/health endpoint test',
        false,
        `Error: ${error.message}`
      );
    }

    // ==========================================
    // TEST GROUP 2: AUTHENTICATION
    // ==========================================
    console.log('📍 Test Group 2: Authentication\n');

    // Test without auth header
    const noAuthResponse = await makeRequest('GET', '/todos', null, { 'Authorization': '' });
    assert(
      'GET /todos requires auth',
      noAuthResponse.status === 401,
      `Status: ${noAuthResponse.status}`
    );

    // Test with invalid token
    const invalidAuthResponse = await makeRequest('GET', '/todos', null, { 'Authorization': 'Bearer invalid' });
    assert(
      'Invalid token returns 401',
      invalidAuthResponse.status === 401,
      `Status: ${invalidAuthResponse.status}`
    );

    console.log('   🔐 Authentication working correctly\n');

    // ==========================================
    // TEST GROUP 3: BASIC CRUD OPERATIONS
    // ==========================================
    console.log('📍 Test Group 3: Basic CRUD Operations\n');

    // Create a todo
    const newTodo = {
      title: 'Test Todo for CI/CD',
      status: 'pending',
      dueDate: '2026-03-30'
    };

    const createResponse = await makeRequest('POST', '/todos', newTodo);
    assert(
      'POST /todos returns 201',
      createResponse.status === 201,
      `Status: ${createResponse.status}`
    );

    const createdTodo = createResponse.body;
    assert(
      'Created todo has all fields',
      createdTodo && createdTodo.id && createdTodo.title && createdTodo.status && createdTodo.history,
      `ID: ${createdTodo?.id}, Title: ${createdTodo?.title}`
    );

    const todoId = createdTodo.id;
    console.log(`   ✅ Todo created with ID: ${todoId}\n`);

    // Get all todos
    const getAllResponse = await makeRequest('GET', '/todos');
    assert(
      'GET /todos returns 200',
      getAllResponse.status === 200,
      `Status: ${getAllResponse.status}`
    );

    assert(
      'GET /todos returns array',
      Array.isArray(getAllResponse.body),
      'Response is array'
    );

    // Update todo
    const updateData = {
      status: 'in-progress',
      title: 'Updated Test Todo'
    };

    const updateResponse = await makeRequest('PUT', `/todos/${todoId}`, updateData);
    assert(
      'PUT /todos/:id returns 200',
      updateResponse.status === 200,
      `Status: ${updateResponse.status}`
    );

    assert(
      'Todo status updated',
      updateResponse.body.status === 'in-progress',
      `Status: ${updateResponse.body.status}`
    );

    assert(
      'Todo title updated',
      updateResponse.body.title === 'Updated Test Todo',
      `Title: ${updateResponse.body.title}`
    );

    console.log('   ✅ Todo updated successfully\n');

    // ==========================================
    // TEST GROUP 4: FILTERING
    // ==========================================
    console.log('📍 Test Group 4: Filtering\n');

    // Filter by status
    const statusFilterResponse = await makeRequest('GET', '/todos?status=in-progress');
    assert(
      'GET /todos?status=pending returns 200',
      statusFilterResponse.status === 200,
      `Status: ${statusFilterResponse.status}`
    );

    // Filter by keyword
    const keywordFilterResponse = await makeRequest('GET', '/todos?keyword=updated');
    assert(
      'GET /todos?keyword=test returns 200',
      keywordFilterResponse.status === 200,
      `Status: ${keywordFilterResponse.status}`
    );

    console.log('   🔍 Filtering working correctly\n');

    // ==========================================
    // TEST GROUP 5: STATISTICS
    // ==========================================
    console.log('📍 Test Group 5: Statistics\n');

    const statsResponse = await makeRequest('GET', '/stats');
    assert(
      'GET /stats returns 200',
      statsResponse.status === 200,
      `Status: ${statsResponse.status}`
    );

    const stats = statsResponse.body;
    assert(
      'Stats has all required fields',
      stats && typeof stats.total === 'number' &&
      typeof stats.pending === 'number' &&
      typeof stats.inProgress === 'number' &&
      typeof stats.done === 'number',
      `Stats: ${JSON.stringify(stats)}`
    );

    console.log(`   📊 Stats: Total: ${stats.total}, Pending: ${stats.pending}, In-Progress: ${stats.inProgress}, Done: ${stats.done}\n`);

    // ==========================================
    // TEST GROUP 6: VALIDATION
    // ==========================================
    console.log('📍 Test Group 6: Validation\n');

    // Test empty title
    const emptyTitleResponse = await makeRequest('POST', '/todos', { title: '' });
    assert(
      'Empty title returns 400',
      emptyTitleResponse.status === 400,
      `Status: ${emptyTitleResponse.status}`
    );

    // Test invalid status
    const invalidStatusResponse = await makeRequest('POST', '/todos', {
      title: 'Test Todo',
      status: 'invalid-status'
    });
    assert(
      'Invalid status returns 400',
      invalidStatusResponse.status === 400,
      `Status: ${invalidStatusResponse.status}`
    );

    // Test invalid due date
    const invalidDateResponse = await makeRequest('POST', '/todos', {
      title: 'Test Todo',
      dueDate: 'invalid-date'
    });
    assert(
      'Invalid due date returns 400',
      invalidDateResponse.status === 400,
      `Status: ${invalidDateResponse.status}`
    );

    console.log('   ✅ Validation working correctly\n');

    // ==========================================
    // TEST GROUP 7: ERROR HANDLING
    // ==========================================
    console.log('📍 Test Group 7: Error Handling\n');

    // Test 404 for non-existent todo
    const notFoundResponse = await makeRequest('GET', '/todos/99999');
    assert(
      'GET /todos/99999 returns 404',
      notFoundResponse.status === 404,
      `Status: ${notFoundResponse.status}`
    );

    // Test 404 for invalid endpoint
    const invalidEndpointResponse = await makeRequest('GET', '/invalid-endpoint');
    assert(
      'Invalid endpoint returns 404',
      invalidEndpointResponse.status === 404,
      `Status: ${invalidEndpointResponse.status}`
    );

    console.log('   ⚠️ Error handling working correctly\n');

    // ==========================================
    // TEST GROUP 8: CLEANUP & ADVANCED FEATURES
    // ==========================================
    console.log('📍 Test Group 8: Cleanup & Advanced Features\n');

    // Delete the test todo
    const deleteResponse = await makeRequest('DELETE', `/todos/${todoId}`);
    assert(
      'DELETE /todos/:id returns 200',
      deleteResponse.status === 200,
      `Status: ${deleteResponse.status}`
    );

    // Verify todo was deleted
    const finalTodosResponse = await makeRequest('GET', '/todos');
    const todoExists = finalTodosResponse.body.some(t => t.id === todoId);
    assert(
      'Todo was deleted successfully',
      !todoExists,
      'Todo no longer exists'
    );

    console.log('   🧹 Cleanup completed\n');

    // ==========================================
    // TEST GROUP 9: FAILING SCENARIO (FOR CI/CD DEMO)
    // ==========================================
    console.log('📍 Test Group 9: Failing Scenario (Intentional)\n');

    // This test is designed to FAIL for CI/CD demonstration
    // It tests a non-existent feature that should return 404
    const failingTestResponse = await makeRequest('GET', '/todos/export');
    assert(
      'GET /todos/export should work (but it doesn\'t - intentional fail)',
      failingTestResponse.status === 200,
      `This test is designed to fail for CI/CD demo. Status: ${failingTestResponse.status}`
    );

    console.log('   💥 Intentional failing test completed\n');

  } catch (error) {
    console.error('❌ Test suite error:', error.message);
    process.exit(1);
  }

  // ==========================================
  // TEST SUMMARY
  // ==========================================
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ Passed: ${TESTS.passed}`);
  console.log(`❌ Failed: ${TESTS.failed}`);
  console.log(`📈 Total:  ${TESTS.passed + TESTS.failed}`);
  console.log('═══════════════════════════════════════════════════════\n');

  // Return exit code based on test results
  const allPassed = TESTS.failed === 0;
  if (allPassed) {
    console.log('🎉 All tests passed! Application is ready for deployment.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check the results above.\n');
    console.log('💡 Note: One test is intentionally designed to fail for CI/CD demonstration.\n');
    process.exit(1);
  }
}

// ==========================================
// RUN TESTS
// ==========================================

// Add timeout to prevent hanging
const testTimeout = setTimeout(() => {
  console.error('❌ Tests timed out after 30 seconds');
  console.error('Make sure the server is running: node server.js');
  process.exit(1);
}, 30000);

runTests().finally(() => clearTimeout(testTimeout));
