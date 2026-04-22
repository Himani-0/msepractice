# 🚀 SpendSense — Complete Setup, VS Code & Render Deployment Guide

---

## PART 1: RUNNING ON VS CODE (MAC) — STEP BY STEP

### Prerequisites

Before starting, make sure you have these installed:

#### Step 1 — Install Node.js
1. Go to https://nodejs.org
2. Download the **LTS** version (e.g., v20.x)
3. Open the downloaded `.pkg` file and follow installer steps
4. Verify: Open Terminal → `node -v` → should show version
5. Also verify npm: `npm -v`

#### Step 2 — Install VS Code
1. Go to https://code.visualstudio.com
2. Download the Mac version
3. Drag to Applications folder
4. Open VS Code → Press `Cmd+Shift+P` → type "Shell Command" → select **"Install 'code' command in PATH"**

#### Step 3 — Install VS Code Extensions (Recommended)
In VS Code, go to Extensions (Cmd+Shift+X) and install:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **Thunder Client** (for testing APIs)
- **MongoDB for VS Code**

---

### Setting Up MongoDB Atlas (Free Cloud Database)

#### Step 4 — Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click **"Try Free"** → Sign up with Google or email
3. Choose **Free** (M0) cluster → Select region (e.g., Mumbai/Singapore for India)
4. Give it a name: `expense-tracker`
5. Click **"Create Cluster"** (takes 1-3 minutes)

#### Step 5 — Create Database User
1. In Atlas sidebar → **Database Access** → **"Add New Database User"**
2. Choose **Password** authentication
3. Username: `expenseuser`
4. Password: Click "Autogenerate Secure Password" → **copy and save this password!**
5. Role: **Atlas admin**
6. Click **"Add User"**

#### Step 6 — Allow Network Access
1. In Atlas sidebar → **Network Access** → **"Add IP Address"**
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Click **Confirm**

#### Step 7 — Get Your Connection String
1. Go to **Database** → Click **"Connect"** on your cluster
2. Choose **"Drivers"**
3. Copy the connection string — it looks like:
   ```
   mongodb+srv://expenseuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password from Step 5
5. Add your database name before `?`:
   ```
   mongodb+srv://expenseuser:yourpassword@cluster0.xxxxx.mongodb.net/expensetracker?retryWrites=true&w=majority
   ```
6. **Save this string** — you'll use it in the `.env` file

---

### Opening the Project in VS Code

#### Step 8 — Extract and Open Project
1. Extract the `expense-tracker.zip` file (double-click it)
2. Open VS Code
3. Click **File → Open Folder**
4. Select the extracted `expense-tracker` folder
5. Click **Open**

---

### Setting Up the Backend

#### Step 9 — Open Integrated Terminal
In VS Code: Press **Ctrl+`** (backtick) or go to **Terminal → New Terminal**

You'll see a terminal at the bottom of VS Code.

#### Step 10 — Navigate to Backend and Install Dependencies
```bash
cd backend
npm install
```
Wait for all packages to download. You'll see a `node_modules` folder appear.

#### Step 11 — Create the .env File
In VS Code Explorer (left panel), right-click on the `backend` folder → **New File** → name it `.env`

Paste this content (replace with YOUR values):
```
MONGO_URI=mongodb+srv://expenseuser:yourpassword@cluster0.xxxxx.mongodb.net/expensetracker?retryWrites=true&w=majority
JWT_SECRET=mySuper$ecretKey2024_changethis
PORT=5000
NODE_ENV=development
```

**Important:** 
- `MONGO_URI` = your connection string from Step 7
- `JWT_SECRET` = any random long string (make it long and random for security)

#### Step 12 — Run the Backend
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

**Keep this terminal open!** The backend must be running.

---

### Setting Up the Frontend

#### Step 13 — Open a New Terminal
In VS Code: Click the **+** button in the terminal panel (top right of terminal) to open a second terminal.

#### Step 14 — Navigate to Frontend and Install Dependencies
```bash
cd frontend
npm install
```
This takes 2-5 minutes (React has many dependencies).

#### Step 15 — Create Frontend .env File
In VS Code Explorer, right-click on the `frontend` folder → **New File** → name it `.env`

Paste:
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### Step 16 — Run the Frontend
```bash
npm start
```

React will automatically open `http://localhost:3000` in your browser.

You should see the **SpendSense** login page! 🎉

---

### Testing the App Locally

#### Step 17 — Test Registration
1. Click "Register"
2. Enter your Name, Email, and Password (min 6 chars)
3. Click "Create Account"
4. You should land on the Dashboard

#### Step 18 — Test Adding Expenses
1. Fill in the Add Expense form on the left
2. Enter a title, amount, category, and date
3. Click "+ Add Expense"
4. The expense should appear in the list on the right!

#### Step 19 — Verify in MongoDB Atlas
1. Go to Atlas → **Browse Collections**
2. You should see `users` and `expenses` collections with your data ✅

---

## PART 2: DEPLOYING ON RENDER — COMPLETE GUIDE

### What is Render?
Render is a cloud platform (like Heroku) that hosts web applications for free. We'll deploy:
- **Backend** as a "Web Service" on Render
- **Frontend** as a "Static Site" on Render

---

### Step 1 — Push Code to GitHub

#### Install Git (if not already)
Open Terminal: `git --version`
If not installed, Mac will prompt you to install Xcode Command Line Tools. Accept it.

#### Create GitHub Repository
1. Go to https://github.com → Sign in (or sign up)
2. Click **"+"** → **"New repository"**
3. Name: `expense-tracker`
4. Set to **Public**
5. Click **"Create repository"**

#### Push Your Code
In VS Code terminal (make sure you're in the root `expense-tracker` folder):

```bash
# Go to root folder
cd ..   # (if you're in backend or frontend)

# Initialize git
git init

# Create a root .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit: SpendSense MERN app"

# Add your GitHub repo as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git

# Push
git branch -M main
git push -u origin main
```

Enter your GitHub username and password (or use a Personal Access Token if prompted).

---

### Step 2 — Deploy Backend on Render

1. Go to https://render.com → Sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if prompted
4. Find and select your `expense-tracker` repository → Click **"Connect"**

**Configure the Web Service:**

| Setting | Value |
|---------|-------|
| Name | `expense-tracker-api` |
| Region | Singapore (closest to India) |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Instance Type | **Free** |

5. Scroll down to **Environment Variables** → Click **"Add Environment Variable"**:

Add these one by one:
```
MONGO_URI = (your full MongoDB Atlas connection string)
JWT_SECRET = (your secret key)
NODE_ENV = production
PORT = 5000
FRONTEND_URL = https://your-frontend.onrender.com
```

(You'll update `FRONTEND_URL` after deploying frontend — for now put a placeholder)

6. Click **"Create Web Service"**

Render will build and deploy your backend. Wait 2-5 minutes.

7. Once deployed, you'll see a URL like:
   `https://expense-tracker-api-xxxx.onrender.com`

**Copy this URL** — this is your backend API URL.

**Test it:** Open the URL in browser. You should see:
```json
{"message":"Expense Tracker API is running!","status":"OK"}
```

---

### Step 3 — Deploy Frontend on Render

#### First — Update Frontend API URL
Before deploying, update the frontend environment variable to point to your live backend.

In VS Code, edit `frontend/.env`:
```
REACT_APP_API_URL=https://expense-tracker-api-xxxx.onrender.com/api
```
Replace with your actual backend URL from Step 2.

Also, in `frontend/package.json`, remove or update the `"proxy"` line:
```json
"proxy": "https://expense-tracker-api-xxxx.onrender.com"
```

Commit and push the change:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

#### Deploy Frontend
1. On Render → Click **"New +"** → **"Static Site"**
2. Select your `expense-tracker` repository
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `expense-tracker-ui` |
| Branch | `main` |
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `build` |

4. Click **"Add Environment Variable"**:
```
REACT_APP_API_URL = https://expense-tracker-api-xxxx.onrender.com/api
```

5. Click **"Create Static Site"**

Wait 3-5 minutes for the build to finish.

Your frontend URL will be: `https://expense-tracker-ui-xxxx.onrender.com`

---

### Step 4 — Connect Frontend URL to Backend (CORS Fix)

Go back to your Backend service on Render:
1. Click on `expense-tracker-api` → **Environment**
2. Update `FRONTEND_URL` to your actual frontend URL:
   ```
   FRONTEND_URL = https://expense-tracker-ui-xxxx.onrender.com
   ```
3. Click **Save** — Render will auto-redeploy the backend

---

### Step 5 — Test Live App 🎉

Open your frontend URL: `https://expense-tracker-ui-xxxx.onrender.com`

1. Register a new user
2. Login
3. Add expenses
4. Filter by category

Everything should work live on the internet!

---

## COMMON ISSUES & FIXES

### ❌ "Cannot connect to MongoDB"
- Check MONGO_URI in your .env — make sure there are no extra spaces
- In Atlas → Network Access → make sure 0.0.0.0/0 is whitelisted
- Make sure the password in the URI is URL-encoded (replace `@` with `%40` if your password contains it)

### ❌ "CORS Error" in browser
- Make sure `FRONTEND_URL` env var in Render backend matches your frontend URL exactly
- No trailing slash at the end of the URL

### ❌ Frontend shows blank page
- Check browser console for errors (F12)
- Make sure `REACT_APP_API_URL` points to your live backend
- Check the Render logs for the static site build

### ❌ Render backend goes to sleep (Free tier)
Free tier services sleep after 15 minutes of inactivity. The first request after sleep takes ~30 seconds. This is normal on free tier. Use UptimeRobot (free) to ping your backend every 10 minutes to keep it awake.

### ❌ npm install fails
- Delete `node_modules` folder and try `npm install` again
- Make sure your Node.js version is 18+: `node -v`

---

## Summary of All Terminal Commands

### Local Development
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

### Git Commands
```bash
git add .
git commit -m "your message"
git push
```

### Check if ports are in use (Mac)
```bash
lsof -i :5000   # Check backend port
lsof -i :3000   # Check frontend port
kill -9 <PID>   # Kill a process by PID
```
