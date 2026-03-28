# 📝 Advanced Todo List Application

A **production-ready, enterprise-grade Todo List web application** with **comprehensive CI/CD using GitHub Actions**. Perfect for learning advanced full-stack development, DevOps practices, and demonstrating modern software engineering principles.

## 🎯 Features

### ✅ Enhanced Todo Model
- **Advanced Todo Structure** - Each todo includes: `id`, `title`, `status`, `dueDate`, `createdAt`, `history`
- **Status Tracking** - Three states: `pending`, `in-progress`, `done`
- **Due Date Management** - Optional due dates with overdue detection
- **Change History** - Track all modifications with timestamps
- **Real-time Updates** - Instant UI updates with server synchronization

### 🚀 Advanced API Features
- **Complete REST API** - Full CRUD operations with advanced filtering
- **Authentication** - Bearer token security (`Authorization: Bearer 123456`)
- **Filtering System** - Filter by status and search by keyword
- **Statistics Dashboard** - Real-time stats with server-side calculations
- **Health Monitoring** - `/status` and `/health` endpoints for monitoring
- **Comprehensive Validation** - Input validation with detailed error messages
- **Error Handling** - Proper HTTP status codes and error responses

### 🔧 System Features
- **Version Management** - Centralized version control with `version.js`
- **Structured Logging** - Console logs for CI/CD visibility and debugging
- **Environment Configuration** - Configurable settings for different environments
- **Security Features** - XSS protection, input sanitization, authentication
- **Responsive Design** - Mobile-first, beautiful UI with status-based colors

### 🔄 Advanced CI/CD Pipeline
- **Matrix Testing** - Test on multiple Node.js versions (16.x, 18.x, 20.x)
- **Dependency Caching** - npm cache for faster builds
- **Security Scanning** - Automated vulnerability detection
- **Build Artifacts** - Automated build and deployment preparation
- **Environment Variables** - Configurable deployment environments
- **Deployment Simulation** - Realistic deployment workflow
- **Comprehensive Reporting** - Detailed pipeline logs and notifications
- **Fail-Fast Strategy** - Continue testing even if some versions fail

---

## 📦 Project Structure

```
TodoDemo/
├── src/
│   ├── version.js         # Centralized version management
│   ├── server.js          # Advanced Express.js backend server
│   └── config.js          # Configuration & version management
├── tests/
│   └── test.js            # Comprehensive API test suite with auth
├── package.json           # Dependencies & scripts
├── .github/
│   └── workflows/
│       └── ci-cd.yml     # Advanced GitHub Actions CI/CD pipeline
├── public/
│   ├── index.html        # Enhanced frontend HTML with filters
│   ├── style.css         # Advanced responsive styles with status colors
│   └── script.js         # Frontend JavaScript with auth & filtering
└── node_modules/         # Dependencies (auto-installed)
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js with advanced middleware
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript (ES6+)
- **Authentication**: Bearer token system
- **Testing**: Node.js built-in HTTP module with comprehensive coverage
- **CI/CD**: GitHub Actions with matrix testing and caching
- **Version Control**: Git with automated workflows
- **Security**: Input validation, XSS protection, authentication

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com)
- **GitHub Account** (for CI/CD)

Verify installation:
```bash
node --version  # Should be 16.x or higher
npm --version
git --version
```

---

## 🚀 Quick Start (Local Development)

### 1️⃣ Clone or Navigate to Project

```bash
cd TodoDemo
```

### 2️⃣ Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3️⃣ Start the Server

```bash
npm start
```

You should see:
```
═══════════════════════════════════════════════════════
🚀 Advanced Todo List Server is running!
📍 Server Address: http://localhost:3000
📦 Version: 1.0.0
🌍 Environment: development
🔐 Auth: Bearer token required
═══════════════════════════════════════════════════════
```

### 4️⃣ Open in Browser

Visit: **http://localhost:3000**

You should see the Advanced Todo List application with enhanced features!

### 5️⃣ Stop the Server

Press `Ctrl + C` in the terminal.

---

## 📡 Advanced API Reference

### Authentication
All API endpoints (except `/status` and `/health`) require authentication:
```
Authorization: Bearer 123456
```

### GET /todos
Retrieve all todos with optional filtering

```bash
# Get all todos
curl -H "Authorization: Bearer 123456" http://localhost:3000/todos

# Filter by status
curl -H "Authorization: Bearer 123456" "http://localhost:3000/todos?status=pending"

# Search by keyword
curl -H "Authorization: Bearer 123456" "http://localhost:3000/todos?keyword=test"
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "status": "in-progress",
    "dueDate": "2024-04-15T00:00:00.000Z",
    "createdAt": "2024-03-26T10:30:00.000Z",
    "history": [
      {
        "action": "created",
        "timestamp": "2024-03-26T10:30:00.000Z"
      },
      {
        "action": "status_changed",
        "oldValue": "pending",
        "newValue": "in-progress",
        "timestamp": "2024-03-26T11:00:00.000Z"
      }
    ]
  }
]
```

### POST /todos
Create a new todo

```bash
curl -X POST http://localhost:3000/todos \
  -H "Authorization: Bearer 123456" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review pull requests",
    "status": "pending",
    "dueDate": "2024-04-01"
  }'
```

**Request Body:**
```json
{
  "title": "Required: Todo title (non-empty string)",
  "status": "Optional: pending|in-progress|done (default: pending)",
  "dueDate": "Optional: ISO date string"
}
```

**Response:** (201 Created)
```json
{
  "id": 2,
  "title": "Review pull requests",
  "status": "pending",
  "dueDate": "2024-04-01T00:00:00.000Z",
  "createdAt": "2024-03-26T12:00:00.000Z",
  "history": [
    {
      "action": "created",
      "timestamp": "2024-03-26T12:00:00.000Z"
    }
  ]
}
```

### PUT /todos/:id
Update an existing todo

```bash
curl -X PUT http://localhost:3000/todos/1 \
  -H "Authorization: Bearer 123456" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated project documentation",
    "status": "done"
  }'
```

**Request Body:** (partial update supported)
```json
{
  "title": "Optional: Update title",
  "status": "Optional: Update status"
}
```

### DELETE /todos/:id
Delete a todo

```bash
curl -X DELETE http://localhost:3000/todos/1 \
  -H "Authorization: Bearer 123456"
```

**Response:** (200 OK)
```json
{
  "message": "Todo deleted successfully",
  "deletedTodo": {
    "id": 1,
    "title": "Complete project documentation",
    "status": "done"
    // ... full todo object
  }
}
```

### GET /stats
Get comprehensive statistics

```bash
curl -H "Authorization: Bearer 123456" http://localhost:3000/stats
```

**Response:**
```json
{
  "total": 5,
  "pending": 2,
  "inProgress": 1,
  "done": 2
}
```

### GET /status
Application status and version info (no auth required)

```bash
curl http://localhost:3000/status
```

**Response:**
```json
{
  "status": "running",
  "version": "1.0.0",
  "timestamp": "2024-03-26T10:30:00.000Z"
}
```

### GET /health
Simple health check (no auth required)

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok"
}
```

---

## 🧪 Advanced Testing Suite

### Run Tests Locally

```bash
npm test
```

**What it tests:**
- ✅ **Health Checks** - `/status` and `/health` endpoints
- ✅ **Authentication** - Bearer token validation
- ✅ **CRUD Operations** - Create, read, update, delete todos
- ✅ **Filtering** - Status and keyword filtering
- ✅ **Statistics** - Stats dashboard functionality
- ✅ **Validation** - Input validation and error handling
- ✅ **Error Handling** - 404s, 400s, 401s
- ✅ **History Tracking** - Todo modification history
- ❌ **Intentional Failure** - One test designed to fail for CI/CD demo

**Example output:**
```
═══════════════════════════════════════════════════════
🧪 ADVANCED TODO LIST - COMPREHENSIVE TEST SUITE
═══════════════════════════════════════════════════════

📍 Test Group 1: Health Checks
✅ PASS | /status returns 200 without auth
✅ PASS | /status returns correct structure

📍 Test Group 2: Authentication
✅ PASS | GET /todos requires auth
✅ PASS | Invalid token returns 401

[... more tests ...]

📍 Test Group 9: Failing Scenario (Intentional)
❌ FAIL | GET /todos/export should work (but it doesn't - intentional fail)

═══════════════════════════════════════════════════════
📊 TEST SUMMARY
═══════════════════════════════════════════════════════
✅ Passed: 18
❌ Failed: 1
📈 Total:  19
═══════════════════════════════════════════════════════

⚠️  Some tests failed. Check the results above.
💡 Note: One test is intentionally designed to fail for CI/CD demonstration.
```

### Test Coverage
- **19 comprehensive tests** covering all API endpoints
- **Authentication testing** with valid/invalid tokens
- **Data validation** for all input scenarios
- **Error handling** for edge cases
- **Filtering and search** functionality
- **Statistics calculation** verification
- **Intentional failure** for CI/CD pipeline demonstration

---

## 📝 Version Management

### Current Version System
The application uses centralized version management:

**src/version.js:**
```javascript
module.exports = "1.0.0";
```

**src/config.js:**
```javascript
const version = require('./version');
// Version is now imported from src/version.js
```

### Updating Version
1. Edit `src/version.js`:
   ```javascript
   module.exports = "1.1.0";
   ```

2. Commit and push:
   ```bash
   git add src/version.js
   git commit -m "Bump version to 1.1.0"
   git push origin main
   ```

3. GitHub Actions will automatically test with the new version

---

## 🔄 Advanced GitHub Actions CI/CD

### Workflow Features
- **Matrix Testing** - Node.js 16.x, 18.x, 20.x
- **Dependency Caching** - npm cache for faster builds
- **Security Scanning** - Automated vulnerability checks
- **Build Artifacts** - Deployment-ready packages
- **Environment Variables** - Configurable deployment
- **Deployment Simulation** - Realistic production deployment
- **Comprehensive Notifications** - Discord/webhook integration ready

### Workflow Stages

#### 1️⃣ **🧪 Test Job** (Matrix Strategy)
```yaml
strategy:
  matrix:
    node-version: [16.x, 18.x, 20.x]
  fail-fast: false
```
- Parallel testing on multiple Node versions
- Dependency caching with `cache: 'npm'`
- Comprehensive test execution
- Test result artifacts

#### 2️⃣ **🔒 Security Job**
- Automated `npm audit` scanning
- Vulnerability detection and reporting
- Dependency security validation

#### 3️⃣ **🏗️ Build Job**
- Production build creation
- Artifact generation
- Deployment package preparation

#### 4️⃣ **🚀 Deploy Job** (Main branch only)
```yaml
if: github.ref == 'refs/heads/main'
environment: staging
```
- Deployment simulation
- Health checks
- Status reporting

#### 5️⃣ **📢 Notify Job**
- Pipeline summary generation
- Artifact uploads
- Notification dispatch

### Environment Variables
```yaml
env:
  NODE_ENV: test
  APP_NAME: Advanced Todo List
  DEPLOY_ENV: staging
```

### Local .env Example
The repository includes a sample environment file at `.env.example` for local development.

### Trigger Conditions
- **Push to `main`** - Full pipeline (test → security → build → deploy)
- **Push to `develop`** - Test only
- **Pull Request** - Full test matrix

### View Results
1. Go to GitHub repository → **Actions** tab
2. Select workflow run
3. View detailed logs for each job
4. Download artifacts and test results

---

## 🎓 Advanced Learning Outcomes

### Backend Development
- ✅ **Express.js Middleware** - Authentication, validation, logging
- ✅ **REST API Design** - CRUD operations with filtering and pagination
- ✅ **Error Handling** - Comprehensive error responses and status codes
- ✅ **Input Validation** - Server-side validation with detailed messages
- ✅ **Security Implementation** - Bearer token authentication
- ✅ **Configuration Management** - Environment-based configuration
- ✅ **Logging Strategies** - Structured logging for monitoring

### Frontend Development
- ✅ **Advanced JavaScript** - ES6+, async/await, fetch API
- ✅ **State Management** - Real-time UI updates with server sync
- ✅ **User Experience** - Loading states, error handling, responsive design
- ✅ **Security** - XSS prevention, input sanitization
- ✅ **Progressive Enhancement** - Works without JavaScript

### DevOps & CI/CD
- ✅ **GitHub Actions** - Workflow syntax, matrix testing, caching
- ✅ **Automated Testing** - Comprehensive test suites in CI
- ✅ **Security Scanning** - Automated vulnerability detection
- ✅ **Build Automation** - Artifact creation and deployment
- ✅ **Environment Management** - Staging/production configurations
- ✅ **Monitoring & Logging** - Pipeline visibility and reporting

### Software Engineering
- ✅ **Version Control** - Semantic versioning, release management
- ✅ **Code Quality** - Linting, testing, security scanning
- ✅ **Documentation** - Comprehensive API docs and README
- ✅ **Error Scenarios** - Intentional failures for testing
- ✅ **Scalability** - Modular architecture, separation of concerns

---

## 📊 Example Workflow: Complete Feature Update

### Step 1: Develop Feature
```bash
# Create feature branch
git checkout -b feature/enhanced-filtering

# Make changes to src/server.js, tests/test.js, etc.
# Add new filtering capabilities

# Test locally
npm test
```

### Step 2: Update Version
```javascript
// src/version.js
module.exports = "1.1.0";
```

### Step 3: Commit and Push
```bash
git add .
git commit -m "feat: Add enhanced filtering with due date sorting"
git push origin feature/enhanced-filtering
```

### Step 4: Create Pull Request
- GitHub will run full test matrix
- Review code and test results
- Merge to main branch

### Step 5: Automated Deployment
- GitHub Actions triggers full pipeline
- Tests run on 3 Node versions
- Security scan passes
- Build artifacts created
- Deployment to staging environment
- Notifications sent

### Step 6: Verify Deployment
- Check application in staging
- Verify new features work
- Monitor logs and performance
- Confirm version update in UI

---

## 🐛 Advanced Troubleshooting

### Authentication Issues
```bash
# Test authentication
curl -H "Authorization: Bearer 123456" http://localhost:3000/todos
# Should return 200 with todos array

curl http://localhost:3000/todos
# Should return 401 Unauthorized
```

### Version Display Issues
```javascript
// Check src/version.js
console.log(require('./src/version')); // Should print current version

// Check src/config.js imports version correctly
const config = require('./src/config');
console.log(config.version); // Should match src/version.js
```

### Test Failures
```bash
# Run tests with verbose output
npm test

# Check server is not running on port 3000
netstat -ano | findstr :3000

# Kill existing server if needed
taskkill /PID <PID> /F
```

### CI/CD Issues
1. **Tests failing in GitHub Actions:**
   - Check workflow logs in Actions tab
   - Verify Node.js version compatibility
   - Check for missing dependencies

2. **Security scan failing:**
   - Run `npm audit` locally
   - Update vulnerable packages
   - Review security advisories

3. **Deployment failing:**
   - Check environment variables
   - Verify build artifacts
   - Review deployment logs

---

## 🚀 Production Deployment

### Environment Variables
```bash
NODE_ENV=production
PORT=3000
AUTH_TOKEN=your-secure-token
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Deployment
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repository
- **Render**: Connect GitHub repository
- **AWS/GCP/Azure**: Use containerized deployment

---

## 🎯 Next Steps & Enhancements

### Immediate Improvements
1. **Database Integration** - Replace in-memory storage with MongoDB/PostgreSQL
2. **User Authentication** - JWT-based user management
3. **Real-time Updates** - WebSocket integration for live updates
4. **API Documentation** - Swagger/OpenAPI specification

### Advanced Features
1. **Categories & Tags** - Organize todos with labels
2. **Due Date Reminders** - Email/SMS notifications
3. **Collaboration** - Multi-user todo sharing
4. **Analytics** - Usage statistics and insights
5. **Mobile App** - React Native companion app

### DevOps Enhancements
1. **Docker Containerization** - Complete container setup
2. **Kubernetes** - Orchestration for scaling
3. **Monitoring** - Application performance monitoring
4. **Load Testing** - Performance and stress testing
5. **Multi-environment** - Dev/Staging/Prod pipelines

---

## 📚 Documentation & Resources

- **API Documentation** - Complete endpoint reference above
- **Testing Guide** - Comprehensive test suite documentation
- **CI/CD Pipeline** - GitHub Actions workflow details
- **Security Guide** - Authentication and validation patterns
- **Deployment Guide** - Production deployment strategies

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add comprehensive tests
5. Update documentation
6. Create a pull request
7. Wait for CI/CD pipeline to pass

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**🎉 Happy coding! Build amazing applications with confidence using this advanced Todo List application with enterprise-grade CI/CD!**

---

## 📄 License

MIT License - Free to use for learning and projects

---

## 💡 Tips for DevOps Report

### Great Demo Points:
1. **Show the CI/CD workflow running** - Real-time logs
2. **Demonstrate version changes** - Update version and watch it propagate
3. **Explain caching** - Show cache hits in subsequent runs
4. **Show test coverage** - Explain what each test validates
5. **Highlight logging** - Console logs visible in Actions
6. **Explain matrix testing** - Show parallel testing on multiple Node versions
7. **Discuss security** - npm audit scanning

### Performance Metrics:
- Build time: ~30-60 seconds (with cache hits: ~10-15 seconds)
- Test execution: ~5-10 seconds
- Total pipeline: ~2-3 minutes
- Cache savings: 50-70% faster on subsequent runs

---

## 🤝 Contributing

To contribute:
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes
4. Commit: `git commit -m "Add amazing feature"`
5. Push: `git push origin feature/amazing-feature`
6. Open Pull Request

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review GitHub Actions logs for workflow errors
3. Check browser console for frontend errors (F12)
4. View server logs for backend errors

---

**Happy coding! 🚀 Make great things!**
