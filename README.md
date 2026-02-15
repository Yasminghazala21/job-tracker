# Job Application Tracker

A full-stack web application to track your job applications — built with a backend-first approach using **Node.js**, **Express**, **MongoDB**, and **JWT authentication** stored in HTTP-only cookies. React frontend styled with **Tailwind CSS** and **Lucide icons**.

---

## Live Preview

| Page | Description |
|---|---|
| `/login` | Sign in with email and password |
| `/register` | Create a new account |
| `/dashboard` | View, add, edit, filter, and delete applications |

---

## Features

- **Secure Authentication** — JWT stored in HTTP-only cookies (XSS-proof)
- **User Isolation** — Every user sees only their own applications
- **Full CRUD** — Create, read, update, and delete job applications
- **Filtering & Search** — Filter by status, search by company name, sort by date
- **Dashboard Stats** — Live count of Applied, Interview, Offer, Rejected
- **Protected Routes** — Middleware guards every application endpoint
- **Centralized Error Handling** — Consistent error responses across the entire API
- **Responsive UI** — Works on desktop and mobile

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT creation and verification |
| cookie-parser | Reading HTTP-only cookies |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Axios | HTTP client (with interceptors) |
| Tailwind CSS (CDN) | Utility-first styling |
| Lucide React | Icon library |

---

## Project Structure

```
job-tracker/
│
├── job-tracker-server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js        # Register, login, logout, getMe
│   │   │   └── application.controller.js # CRUD + filtering logic
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js             # User schema + bcrypt hook
│   │   │   └── application.model.js      # Application schema + indexes
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js            # /api/auth/*
│   │   │   └── application.routes.js     # /api/applications/*
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js        # JWT verification (protect)
│   │   │   └── error.middleware.js       # Global error handler
│   │   │
│   │   ├── config/
│   │   │   └── db.js                     # MongoDB connection
│   │   │
│   │   ├── utils/
│   │   │   └── generateToken.js          # JWT + cookie generator
│   │   │
│   │   └── app.js                        # Express app setup
│   │
│   ├── server.js                         # Entry point
│   ├── .env                              # Environment variables
│   └── package.json
│
└── job-tracker-client/
    ├── public/
    │   └── index.html                    # Tailwind CDN loaded here
    │
    └── src/
        ├── api/
        │   └── axios.js                  # Pre-configured Axios instance
        │
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx
        │
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ApplicationForm.jsx       # Create + Edit form
        │   └── ApplicationList.jsx       # List + Filter + Delete
        │
        ├── App.jsx                       # Route definitions
        └── index.js                      # React entry point
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) — local or [Atlas](https://www.mongodb.com/atlas) (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/job-tracker.git
cd job-tracker
```

### 2. Set up the Backend

```bash
cd job-tracker-server
npm install
```

Create a `.env` file in `job-tracker-server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string:
> `your_mongodb_connection_string_here`

Start the backend:

```bash
npm run dev
```

### 3. Set up the Frontend

Open a **new terminal**:

```bash
cd job-tracker-client
npm install
npm start
```

App opens at **http://localhost:3000**

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register new user |
| `POST` | `/login` | Public | Login and receive JWT cookie |
| `POST` | `/logout` | Private | Clear JWT cookie |
| `GET` | `/me` | Private | Get current user info |

### Application Routes — `/api/applications`

All routes require a valid JWT cookie.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all applications (supports filtering) |
| `POST` | `/` | Create new application |
| `GET` | `/:id` | Get single application |
| `PUT` | `/:id` | Update application |
| `DELETE` | `/:id` | Delete application |

### Filtering & Sorting

```
GET /api/applications?status=Interview&search=Google&sort=oldest&page=1&limit=10
```

| Query Param | Type | Example | Description |
|---|---|---|---|
| `status` | string | `Applied` | Filter by status (comma-separated for multiple) |
| `search` | string | `Google` | Case-insensitive company name search |
| `sort` | string | `oldest` | `newest` (default) or `oldest` by applied date |
| `page` | number | `1` | Page number for pagination |
| `limit` | number | `10` | Results per page |

---

## Data Models

### User
```js
{
  name:      String,   // required, 2–50 chars
  email:     String,   // required, unique, lowercase
  password:  String,   // hashed with bcrypt (select: false)
  createdAt: Date,
  updatedAt: Date
}
```

### Job Application
```js
{
  user:        ObjectId,  // ref → User (ownership link)
  companyName: String,    // required
  role:        String,    // required
  jobLocation: String,    // required
  status:      String,    // enum: Applied | Interview | Rejected | Offer
  appliedDate: Date,      // defaults to today
  salaryRange: String,    // optional
  jobLink:     String,    // optional
  notes:       String,    // optional, max 1000 chars
  createdAt:   Date,
  updatedAt:   Date
}
```

---

## Authentication Flow

```
1. POST /register or /login
        │
        ▼
2. Server validates credentials
        │
        ▼
3. JWT signed with JWT_SECRET → stored in HTTP-only cookie
   (httpOnly: true, secure: true in prod, sameSite: strict)
        │
        ▼
4. Every protected request → browser auto-sends cookie
        │
        ▼
5. auth.middleware reads cookie → jwt.verify() → User.findById()
        │
        ▼
6. req.user populated → controller filters data by req.user._id
```

**Why HTTP-only cookies instead of localStorage?**
`localStorage` is accessible via JavaScript → vulnerable to XSS attacks.
HTTP-only cookies are invisible to JavaScript → XSS-proof by design.

---

## Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt with 12 salt rounds via Mongoose pre-save hook |
| XSS protection | JWT in `httpOnly` cookie — JS cannot read it |
| CSRF protection | `sameSite: 'strict'` cookie attribute |
| HTTPS enforcement | `secure: true` cookie in production |
| User enumeration prevention | Login returns identical error for wrong email or password |
| Data isolation | Every DB query scoped to `user: req.user._id` |
| Input validation | Mongoose schema validation (required, enum, maxlength) |
| Duplicate key handling | Friendly error message for existing email |

---

## Scripts

### Backend
```bash
npm run dev     # Start with nodemon (auto-restart on file save)
npm start       # Start without nodemon (production)
```

### Frontend
```bash
npm start       # Start development server on :3000
npm run build   # Create production build
```

---

## License

This project is licensed under the MIT License.

