# Full-Stack Todo App

This project is a full-stack web application with a React + Vite frontend and a Node.js + Express + MongoDB Atlas backend.

## Live Deployment
- **Frontend**: [https://to-do-sage-eight.vercel.app/](https://to-do-sage-eight.vercel.app/)
- **Backend**: [https://todo-app-backend-28ey.onrender.com](https://todo-app-backend-28ey.onrender.com)

---

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas

---

## Folder Structure

```text
ToDo/
├── backend/
│   ├── .env              # Environment variables (PORT=5000)
│   ├── .env.example      # Environment variables template
│   ├── .gitignore        # Ignores node_modules and .env
│   ├── package.json      # Backend scripts and dependencies
│   └── server.js         # Minimal Express server with /api/health
├── frontend/
│   ├── index.html        # Main HTML file
│   ├── package.json      # Frontend scripts and dependencies
│   ├── vite.config.js    # Vite configuration with API proxy to port 5000
│   └── src/
│       ├── App.jsx       # Starter React component with health check tester
│       ├── App.css       # Clean, simple component styles
│       ├── index.css     # Base CSS reset
│       └── main.jsx      # React entry point
├── .gitignore            # Root git ignore file
└── package.json          # Root scripts
```

---

## Installed Backend Dependencies
- **`express`**: Web framework for building the REST API.
- **`dotenv`**: Loads environment variables from the `.env` file into `process.env`.
- **`cors`**: Enables Cross-Origin Resource Sharing.
- **`mongoose`**: ODM for MongoDB *(installed now for use in later phases)*.

---

## How to Run Phase 1

### 1. Start the Backend
Open a terminal in the project root:
```bash
cd backend
npm run dev
```
The server will start using Node's built-in watch mode (`node --watch server.js`):
```text
Server is running on http://localhost:5000
```

### 2. Start the Frontend
Open a **separate** terminal in the project root:
```bash
cd frontend
npm run dev
```
Open your browser at:
```text
http://localhost:5173
```

---

## How to Test the `/api/health` Endpoint

You can test the health check in three ways:

1. **In the Browser**:
   Visit [http://localhost:5000/api/health](http://localhost:5000/api/health)
   Expected response:
   ```json
   {
     "status": "ok",
     "message": "Backend is running"
   }
   ```

2. **In the Terminal** (PowerShell / Command Prompt):
   ```powershell
   curl http://localhost:5000/api/health
   ```
   or:
   ```powershell
   Invoke-RestMethod http://localhost:5000/api/health
   ```

3. **In the Frontend UI**:
   Open [http://localhost:5173](http://localhost:5173) and click the **Check /api/health** button.
