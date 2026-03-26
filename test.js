// ==========================================
// TODO LIST - BASIC TEST SUITE
// ==========================================
// Simple Node.js test script to verify:
// 1. Server starts properly
// 2. /status endpoint returns correct data
// 3. /todos endpoints work correctly
// ==========================================

const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
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
 * @returns {Promise} - Response data
 */
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
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
  console.log('🧪 TODO LIST APPLICATION - TEST SUITE');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ==========================================
    // TEST 1: Health Check - Server is running
    // ==========================================
    console.log('📍 Test Group 1: Health Check\n');

    try {
      const response = await makeRequest('GET', '/status');
      assert(
        'Server responds to /status endpoint',
        response.status === 200,
        `Status: ${response.status}`
      );

      // Test status response structure
      const { status, version, appName, environment, timestamp } = response.body || {};
      assert(
        '/status returns correct structure',
        status && version && appName && timestamp,
        `Version: ${version}, Status: ${status}`
      );

      // Test version format
      const versionRegex = /^\d+\.\d+\.\d+$/;
      assert(
        'Version follows semantic versioning (x.y.z)',
        versionRegex.test(version),
        `Version: ${version}`
      );

      assert(
        'Status is "running"',
        status === 'running',
        `Status: ${status}`
      );

      console.log(`   📦 App: ${appName} v${version}`);
      console.log(`   🌍 Environment: ${environment}`);
      console.log(`   ⏱️  Timestamp: ${timestamp}\n`);

    } catch (error) {
      logTestResult(
        'Server health check',
        false,
        `Error: ${error.message}`
      );
      console.log('   ⚠️  Make sure server is running: node server.js\n');
      process.exit(1);
    }

    // ==========================================
    // TEST 2: REST API - GET /todos
    // ==========================================
    console.log('📍 Test Group 2: GET /todos Endpoint\n');

    const getTodosResponse = await makeRequest('GET', '/todos');
    assert(
      'GET /todos returns 200 status',
      getTodosResponse.status === 200,
      `Status: ${getTodosResponse.status}`
    );

    assert(
      'GET /todos returns an array',
      Array.isArray(getTodosResponse.body),
      'Initial todos list'
    );

    console.log(`   📋 Initial todos count: ${getTodosResponse.body.length}\n`);

    // ==========================================
    // TEST 3: REST API - POST /todos
    // ==========================================
    console.log('📍 Test Group 3: POST /todos Endpoint\n');

    const newTodo = { text: 'Test todo from CI tests' };
    const createResponse = await makeRequest('POST', '/todos', newTodo);

    assert(
      'POST /todos returns 201 status',
      createResponse.status === 201,
      `Status: ${createResponse.status}`
    );

    assert(
      'POST /todos returns todo object',
      createResponse.body && createResponse.body.id,
      `ID: ${createResponse.body?.id}`
    );

    const createdTodoId = createResponse.body?.id;
    assert(
      'Created todo has all properties',
      createResponse.body.text && createResponse.body.completed !== undefined,
      `Text: ${createResponse.body?.text}`
    );

    console.log(`   ✅ Todo created with ID: ${createdTodoId}\n`);

    // ==========================================
    // TEST 4: REST API - Verify todo was added
    // ==========================================
    console.log('📍 Test Group 4: Verify Todos\n');

    const updatedTodosList = await makeRequest('GET', '/todos');
    assert(
      'Todo list updated after POST',
      updatedTodosList.body.length > 0,
      `Total todos: ${updatedTodosList.body.length}`
    );

    assert(
      'Created todo appears in list',
      updatedTodosList.body.some(t => t.id === createdTodoId),
      `Todo ID ${createdTodoId} found`
    );

    console.log();

    // ==========================================
    // TEST 5: REST API - DELETE /todos/:id
    // ==========================================
    console.log('📍 Test Group 5: DELETE /todos Endpoint\n');

    const deleteResponse = await makeRequest('DELETE', `/todos/${createdTodoId}`);

    assert(
      'DELETE /todos/:id returns 200 status',
      deleteResponse.status === 200,
      `Status: ${deleteResponse.status}`
    );

    assert(
      'DELETE response contains deleted todo',
      deleteResponse.body && deleteResponse.body.deletedTodo,
      'Deleted todo data returned'
    );

    console.log(`   ✅ Todo deleted successfully\n`);

    // ==========================================
    // TEST 6: REST API - Verify todo was deleted
    // ==========================================
    console.log('📍 Test Group 6: Verify Deletion\n');

    const finalTodosList = await makeRequest('GET', '/todos');
    assert(
      'Deleted todo no longer in list',
      !finalTodosList.body.some(t => t.id === createdTodoId),
      `Todo IDs: ${finalTodosList.body.map(t => t.id).join(', ')}`
    );

    console.log();

    // ==========================================
    // ERROR HANDLING TEST
    // ==========================================
    console.log('📍 Test Group 7: Error Handling\n');

    const invalidResponse = await makeRequest('POST', '/todos', { text: '' });
    assert(
      'Empty todo returns 400 error',
      invalidResponse.status === 400,
      `Status: ${invalidResponse.status}`
    );

    const notFoundResponse = await makeRequest('GET', '/todos/99999');
    // Note: GET /todos/:id would need to be implemented in server
    // This tests the general API robustness

    console.log();

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
    console.log('⚠️  Some tests failed. Please review the errors above.\n');
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
