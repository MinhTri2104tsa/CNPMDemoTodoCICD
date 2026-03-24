You are a senior full-stack developer and DevOps engineer.

Create a complete Todo List web application with CI/CD using GitHub Actions.

========================
1. TECH STACK
========================
- Backend: Node.js with Express
- Frontend: HTML, CSS, Vanilla JavaScript
- No database (use in-memory array)

========================
2. FEATURES (BASIC + ADVANCED)
========================
Implement a clean Todo List app with:

Basic:
- Add a new todo
- Display all todos
- Mark todo as completed
- Delete todo

Advanced:
- Each todo has unique ID
- Validate input (no empty todo)
- Show loading state when calling API
- Use async/await with fetch API
- Clean UI (centered layout, buttons, hover effect)

========================
3. PROJECT STRUCTURE
========================
- server.js
- package.json
- public/
  - index.html
  - style.css
  - script.js

========================
4. BACKEND REQUIREMENTS
========================
Create REST API:

- GET /todos → return all todos
- POST /todos → create todo
- PUT /todos/:id → update status
- DELETE /todos/:id → delete todo

Requirements:
- Use Express
- Use JSON
- Handle errors properly
- Add comments for explanation

========================
5. FRONTEND REQUIREMENTS
========================
- Use fetch API
- Use async/await
- Render todo list dynamically
- Show loading indicator when fetching data
- Clean and simple UI

========================
6. GITHUB ACTIONS (CI/CD - ADVANCED)
========================
Create a workflow file at:
.github/workflows/ci.yml

Workflow must include:

- Trigger:
  - On push to main branch

- Jobs:
  1. Install dependencies
  2. Run simple test (echo or basic test)
  3. Run the server (optional)

- Use Node.js matrix:
  node-version: [16, 18]

- Use caching:
  cache node_modules

- Show logs clearly

========================
7. CODE QUALITY
========================
- Clean, readable code
- Add comments explaining each part
- Easy to understand for university DevOps report

========================
8. OUTPUT
========================
Generate:
- Full backend code (server.js)
- Full frontend code (HTML, CSS, JS)
- package.json
- GitHub Actions YAML file

Make sure the project can run with:
npm install
node server.js