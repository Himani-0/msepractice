# 💰 SpendSense — Personal Expense Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for tracking daily personal expenses, built as an FSD exam project.

---

## 📁 Project Structure

```
expense-tracker/
├── backend/                  # Node.js + Express API server
│   ├── models/
│   │   ├── User.js           # Mongoose User schema
│   │   └── Expense.js        # Mongoose Expense schema
│   ├── routes/
│   │   ├── auth.js           # POST /register, POST /login
│   │   └── expense.js        # POST /expense, GET /expenses, DELETE /expense/:id
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT token verification middleware
│   ├── .env.example          # Environment variable template
│   ├── package.json
│   └── server.js             # App entry point
│
├── frontend/                 # React.js SPA
│   ├── public/
│   │   └── index.html        # HTML shell
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js  # Global auth state (React Context)
│   │   ├── pages/
│   │   │   ├── Login.js        # Login page
│   │   │   ├── Register.js     # Register page
│   │   │   └── Dashboard.js    # Main expense dashboard
│   │   ├── utils/
│   │   │   └── api.js          # Axios API helper functions
│   │   ├── App.js              # Router + route protection
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   └── package.json
│
└── README.md
```

---

## 📄 File-by-File Documentation

### Backend

#### `server.js`
**Purpose:** Entry point for the Node.js/Express server.
**Why we use it:** Sets up Express app, attaches CORS, JSON parsing middleware, mounts route files, and connects to MongoDB via Mongoose. Listens on the configured PORT.
**Key packages:** `express`, `mongoose`, `cors`, `dotenv`

#### `models/User.js`
**Purpose:** Defines the MongoDB schema for a User.
**Fields:**
- `name` — Full name (required, trimmed)
- `email` — Unique, lowercase, validated format
- `password` — Stored as a bcrypt hash (never plain text)

**Why we use it:** Mongoose schemas enforce structure on MongoDB documents. The `pre('save')` hook automatically hashes passwords before storing, so we never accidentally store plain text. The `matchPassword` instance method allows clean password comparison at login.

#### `models/Expense.js`
**Purpose:** Defines the MongoDB schema for an Expense.
**Fields:**
- `userId` — ObjectId reference to the User who owns this expense
- `title` — Short description (e.g., "Lunch at Dhaba")
- `amount` — Number, must be > 0
- `category` — Enum: Food, Travel, Bills, Shopping, Health, Entertainment, Education, Other
- `date` — Date of the expense
- `notes` — Optional extra details

**Why we use it:** References `User` via `ObjectId` to create a one-to-many relationship. Enum validation ensures only valid categories are stored.

#### `middleware/authMiddleware.js`
**Purpose:** Protects routes that require authentication.
**Why we use it:** Reads the `Authorization: Bearer <token>` header, verifies the JWT using the secret key, looks up the user in the database, and attaches `req.user` to the request. If verification fails, returns 401. Applied to all expense routes.

#### `routes/auth.js`
**Purpose:** Handles user registration and login.
**Endpoints:**
- `POST /api/register` — Validates input, checks for duplicate email, creates user (password is hashed by model hook), returns JWT token + user info.
- `POST /api/login` — Finds user by email, compares password using `bcrypt`, returns JWT token + user info.

**Why we use it:** Separating auth logic into its own route file keeps `server.js` clean and follows the Single Responsibility Principle.

#### `routes/expense.js`
**Purpose:** CRUD operations for expenses (all protected by `authMiddleware`).
**Endpoints:**
- `POST /api/expense` — Creates a new expense linked to `req.user._id`
- `GET /api/expenses` — Returns all expenses for the logged-in user; supports `?category=` filter
- `DELETE /api/expense/:id` — Deletes an expense (verifies ownership first)

---

### Frontend

#### `src/index.js`
**Purpose:** React DOM entry point.
**Why we use it:** Renders the `<App />` component into `#root`, wrapping it with `AuthProvider` so authentication state is globally available.

#### `src/App.js`
**Purpose:** Sets up client-side routing with React Router v6.
**Why we use it:** Defines three routes (`/login`, `/register`, `/dashboard`). `PrivateRoute` redirects unauthenticated users to `/login`. `PublicRoute` redirects already-logged-in users to `/dashboard`. This prevents unauthorized access without a backend call on every navigation.

#### `src/context/AuthContext.js`
**Purpose:** Global authentication state management.
**Why we use it:** React Context API lets us share `user`, `token`, `login()`, `register()`, and `logout()` across all components without prop drilling. Persists token in `localStorage` so the user stays logged in after page refresh. Sets Axios default `Authorization` header so every API call is automatically authenticated.

#### `src/utils/api.js`
**Purpose:** Centralized Axios API functions for expenses.
**Why we use it:** Keeps all API URLs and request logic in one place. If the backend URL changes, we only update it here. Functions: `getExpenses(filters)`, `addExpense(data)`, `deleteExpense(id)`.

#### `src/pages/Register.js`
**Purpose:** Registration form UI.
**Why we use it:** Collects Name, Email, Password. Validates locally before calling `register()` from `AuthContext`. On success, user is auto-navigated to Dashboard. Shows error messages for duplicate email, short password, etc.

#### `src/pages/Login.js`
**Purpose:** Login form UI.
**Why we use it:** Collects Email + Password, calls `login()` from `AuthContext`. On success, JWT is stored and user is redirected to Dashboard.

#### `src/pages/Dashboard.js`
**Purpose:** Main application interface — the heart of the app.
**Why we use it:** Displays stat cards (total spent, transaction count, average), a form to add expenses, and a filterable list of expenses. Supports category filtering (bonus feature), delete, and shows real-time totals. Uses `useEffect` to fetch data on mount and on filter change.

#### `src/index.css`
**Purpose:** Global CSS styles.
**Why we use it:** Uses CSS custom properties (variables) for a consistent dark theme. Includes styles for auth pages, dashboard, stat cards, expense items, filter buttons, and responsive layout. Uses Google Fonts: `Syne` (display) + `DM Mono` (monospace numbers).

---

## 🔑 Key Technologies

| Technology | Role | Why Used |
|---|---|---|
| MongoDB | NoSQL database | Flexible schema, great with JS, free cloud tier (Atlas) |
| Mongoose | ODM for MongoDB | Schema validation, middleware hooks, easy querying |
| Express.js | Web framework for Node | Minimal, fast, widely used for REST APIs |
| Node.js | JavaScript runtime | Runs JS on server, same language as frontend |
| React 18 | Frontend UI library | Component-based, fast re-renders, huge ecosystem |
| React Router v6 | Client-side routing | Enables SPA navigation without full page reload |
| React Context API | State management | Built-in, no extra dependency needed for auth state |
| bcryptjs | Password hashing | Industry standard, never store plain text passwords |
| jsonwebtoken (JWT) | Authentication tokens | Stateless auth, no session storage needed on server |
| Axios | HTTP client | Cleaner API than fetch, supports default headers |
| dotenv | Environment variables | Keeps secrets out of code / git |
| CORS | Cross-origin requests | Allows frontend (different port) to call backend |

---

## 🔐 Security Practices
- Passwords are **never stored in plain text** — bcrypt hashes them with a salt factor of 10
- JWT tokens **expire after 7 days**
- Protected routes verify token on **every request** via middleware
- Expense delete verifies **ownership** (you can only delete your own expenses)
- Environment secrets (DB URI, JWT secret) stored in **`.env` file**, never in code

---

## 🌐 API Reference

### Auth
| Method | Route | Auth | Body | Response |
|--------|-------|------|------|----------|
| POST | `/api/register` | No | `{name, email, password}` | `{token, user}` |
| POST | `/api/login` | No | `{email, password}` | `{token, user}` |

### Expenses
| Method | Route | Auth | Body/Query | Response |
|--------|-------|------|------------|----------|
| POST | `/api/expense` | JWT | `{title, amount, category, date, notes}` | `{expense}` |
| GET | `/api/expenses` | JWT | `?category=Food` | `{expenses[], total, count}` |
| DELETE | `/api/expense/:id` | JWT | — | `{message}` |
