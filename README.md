# 📝 Todo List Application

A complete, production-ready Todo List web application with **CI/CD using GitHub Actions**. Perfect for learning and demonstrating DevOps practices and modern full-stack development.

## 🎯 Features

### ✅ Basic Features
- **Add Todos** - Create new todo items with validation
- **List Todos** - View all todos with real-time updates
- **Delete Todos** - Remove completed or unwanted todos
- **Mark Complete** - Toggle todo completion status
- **Stats Display** - View total and completed todo count

### 🚀 Advanced Features
- **REST API** - Full-featured HTTP API endpoints
- **Version Management** - Easy-to-update version system
- **Health Check** - `/status` endpoint for monitoring
- **Comprehensive Logging** - Console logs for CI/CD visibility
- **Error Handling** - Proper validation and error responses
- **Responsive UI** - Beautiful, mobile-friendly interface
- **XSS Protection** - HTML escaping for security

### 🔄 CI/CD Pipeline
- **GitHub Actions Workflow** - Automated testing and deployment
- **Matrix Testing** - Test on multiple Node.js versions (16.x, 18.x, 20.x)
- **Dependency Caching** - Speed up builds with npm cache
- **Security Scanning** - npm audit for vulnerability detection
- **Deployment Steps** - Automated deployment to production
- **Comprehensive Reporting** - Detailed pipeline logs

---

## 📦 Project Structure

```
TodoDemo/
├── server.js              # Express.js backend server
├── config.js              # Configuration & version management
├── test.js                # API test suite
├── package.json           # Dependencies & scripts
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions CI/CD pipeline
├── public/
│   ├── index.html        # Frontend HTML
│   ├── style.css         # Frontend styles
│   └── script.js         # Frontend JavaScript
└── node_modules/         # Dependencies (auto-installed)
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Testing**: Node.js built-in (http module)
- **CI/CD**: GitHub Actions
- **Version Control**: Git

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com)
- **GitHub Account** (for CI/CD)

Verify installation:
```bash
node --version
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
🚀 Todo List Application is running!
📍 Server Address: http://localhost:3000
📦 Version: 1.0.0
🌍 Environment: development
═══════════════════════════════════════════════════════
```

### 4️⃣ Open in Browser

Visit: **http://localhost:3000**

You should see the Todo List application with a purple gradient background!

### 5️⃣ Stop the Server

Press `Ctrl + C` in the terminal.

---

## 📡 API Reference

### GET /todos
Retrieve all todos

```bash
curl http://localhost:3000/todos
```

**Response:**
```json
[
  {
    "id": 1,
    "text": "Learn Node.js",
    "completed": false,
    "createdAt": "2024-03-26T10:30:00.000Z"
  }
]
```

### POST /todos
Create a new todo

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Build an app"}'
```

**Request Body:**
```json
{
  "text": "Your todo text here"
}
```

**Response:** (201 Created)
```json
{
  "id": 1,
  "text": "Build an app",
  "completed": false,
  "createdAt": "2024-03-26T10:30:00.000Z"
}
```

### PUT /todos/:id
Update todo completion status

```bash
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### DELETE /todos/:id
Delete a todo

```bash
curl -X DELETE http://localhost:3000/todos/1
```

### GET /status
Health check & version info

```bash
curl http://localhost:3000/status
```

**Response:**
```json
{
  "status": "running",
  "version": "1.0.0",
  "appName": "Todo List Application",
  "environment": "development",
  "timestamp": "2024-03-26T10:30:00.000Z",
  "uptime": 123.456,
  "totalTodos": 5
}
```

---

## 🧪 Testing

### Run Tests Locally

```bash
npm test
```

**What it tests:**
- ✅ Server is running and responds to health checks
- ✅ `/status` endpoint returns correct data with version
- ✅ Version follows semantic versioning (x.y.z)
- ✅ GET /todos returns an array
- ✅ POST /todos creates a new todo
- ✅ DELETE /todos/:id removes a todo
- ✅ Error handling works correctly

**Example output:**
```
═══════════════════════════════════════════════════════
🧪 TODO LIST APPLICATION - TEST SUITE
═══════════════════════════════════════════════════════

📍 Test Group 1: Health Check

✅ PASS | Server responds to /status endpoint
✅ PASS | /status returns correct structure
✅ PASS | Version follows semantic versioning (x.y.z)
✅ PASS | Status is "running"

📍 Test Group 2: GET /todos Endpoint

✅ PASS | GET /todos returns 200 status
✅ PASS | GET /todos returns an array

[... more tests ...]

═══════════════════════════════════════════════════════
📊 TEST SUMMARY
═══════════════════════════════════════════════════════
✅ Passed: 14
❌ Failed: 0
📈 Total:  14
═══════════════════════════════════════════════════════

🎉 All tests passed! Application is ready for deployment.
```

---

## 📝 Changing the Version

The application version is defined in `config.js`. To change it:

### Edit config.js
```javascript
const config = {
  // Change this version number
  version: '1.1.0',  // ← Update here
  
  appName: 'Todo List Application',
  // ... rest of config
};
```

Then:
1. Commit the change to Git
2. Push to GitHub
3. GitHub Actions will automatically run tests with the new version
4. Check the workflow logs to see the version in logs

---

## 🔄 GitHub Actions CI/CD Setup

### Prerequisites
1. Push your code to GitHub
2. Make sure `.github/workflows/ci.yml` exists in your repository

### How It Works

The CI/CD pipeline automatically triggers when:
- ✅ **You push code to `main` branch** - Full pipeline runs
- ✅ **You create a pull request** - Tests run automatically
- ✅ **On any push to `develop` branch** - Tests run

### Workflow Stages

#### 1️⃣ **🧪 Test Job** (Matrix: 16.x, 18.x, 20.x)
- Checkout code
- Setup Node.js
- Cache dependencies
- Install dependencies
- Run test suite

#### 2️⃣ **🏗️ Build Job**
- Checkout code
- Setup Node.js
- Install dependencies
- Verify project structure
- Check syntax
- Display package info

#### 3️⃣ **🔒 Security Job**
- Checkout code
- Install dependencies
- Run npm audit

#### 4️⃣ **🚀 Deploy Job** (Only on `main` branch push)
- Pre-deployment checks
- Build artifacts
- Deploy application
- Post-deployment verification

#### 5️⃣ **📊 Report Job**
- Generate comprehensive report
- Display final status

### View Workflow Results

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select a workflow run
4. View detailed logs for each job and step

**Example output in workflow:**
```
[INFO] [2024-03-26T10:30:00.000Z] [INFO] 🚀 Todo List Server is running!
[INFO] [2024-03-26T10:30:00.000Z] [INFO] 📦 Version: 1.0.0
[INFO] [2024-03-26T10:30:02.000Z] [INFO] POST /todos - New todo created: "Test task" (ID: 1)
[INFO] [2024-03-26T10:30:05.000Z] [INFO] DELETE /todos/1 - Todo deleted: "Test task"
[INFO] [2024-03-26T10:30:08.000Z] [INFO] GET /status - Health check request
```

---

## 🎓 Learning Outcomes

By studying and using this project, you'll learn:

### Backend Development
- ✅ Node.js & Express.js fundamentals
- ✅ REST API design principles
- ✅ Middleware usage
- ✅ Error handling
- ✅ Logging best practices
- ✅ Configuration management

### Frontend Development
- ✅ Vanilla JavaScript (no frameworks)
- ✅ Fetch API & async/await
- ✅ DOM manipulation
- ✅ CSS animations & styling
- ✅ XSS prevention
- ✅ User experience design

### DevOps & CI/CD
- ✅ GitHub Actions workflow syntax
- ✅ CI/CD pipeline stages
- ✅ Automated testing
- ✅ Build verification
- ✅ Security scanning
- ✅ Deployment automation
- ✅ Environment variables
- ✅ Caching strategies
- ✅ Matrix testing

### Version Control
- ✅ Git workflows
- ✅ Pull requests
- ✅ Branch management
- ✅ Commit messages

---

## 📊 Example Workflow: Making a Change

### Step 1: Update Version
Edit `config.js`:
```javascript
version: '1.1.0',
```

### Step 2: Commit and Push
```bash
git add config.js
git commit -m "Bump version to 1.1.0"
git push origin main
```

### Step 3: Watch GitHub Actions
1. Go to GitHub repository
2. Click **Actions** tab
3. See workflow run through all stages:
   - Testing on 3 Node versions ✅
   - Build verification ✅
   - Security scan ✅
   - Deployment ✅
   - Final report with new version ✅

### Step 4: Check Logs
- View console logs showing new version
- See todo operations logged during tests
- Confirm all 14 tests passed

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
npm install
```

### Issue: Port 3000 already in use

**Solution 1:** Kill existing process
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Solution 2:** Use different port
```bash
PORT=3001 npm start
```

### Issue: Tests not running

**Ensure server is not already running**
```bash
# Kill any existing server first
# Then run tests
npm test
```

### Issue: GitHub Actions tests failing

**Check the workflow logs:**
1. Go to Actions tab in GitHub
2. Click on failed workflow
3. Expand "Run Tests" step
4. Read the error messages
5. Common issues:
   - Server not starting
   - Port already in use
   - Missing dependencies

---

## 📚 Documentation Files

- **server.js** - Backend server with detailed comments
- **config.js** - Configuration management
- **test.js** - Comprehensive test suite documentation
- **public/script.js** - Frontend JavaScript with JSDoc comments
- **.github/workflows/ci.yml** - CI/CD pipeline documentation

---

## 🎯 Next Steps

After understanding this project:

1. **Extend the API**
   - Add database (MongoDB, PostgreSQL)
   - Add user authentication
   - Add todo categories/tags

2. **Improve Testing**
   - Add more comprehensive tests
   - Implement code coverage
   - Add performance tests

3. **Enhance CI/CD**
   - Add Docker containerization
   - Deploy to cloud (AWS, Azure, Heroku)
   - Add canary deployments
   - Implement blue-green deployments

4. **Scale the Application**
   - Add microservices
   - Implement message queues
   - Add real-time updates with WebSockets

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
