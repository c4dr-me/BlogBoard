# Blog Dashboard

A full-stack blog dashboard application built with React (Vite) and FastAPI. This README describes the project setup, features, environment configuration, and development guidelines for both frontend and backend components.

## Table of contents

- Project Overview
- Features
- Tech Stack
  - Frontend
  - Backend
- Quick Start Guide
  - Frontend Setup
  - Backend Setup
- Environment Variables
- Database Setup
- Project Structure
- API Overview
- Authentication
- Validation Strategy
  - Frontend (with Debounce)
  - Backend (Server-side)
- Contributing
- Troubleshooting

## Features

- User Authentication (Register/Login)
- Create, Read, Update, Delete blog posts
- Search functionality with debounce
- Responsive design
- Fast and efficient API
- Input validation
- Protected routes with JWT
- User dashboard
- Real-time form validation

---

## Project description

This repository provides the backend for a blog dashboard (users, posts, comments, tags). It exposes a REST API using FastAPI with JWT-based auth, Pydantic validation, and typical CRUD endpoints. Designed for local development and easy deployment.

Features:

- User registration & JWT authentication
- Use of callback & memo along with context with tanstack Query
- Input validation via Pydantic
- Optional DB migrations (Alembic)
- CORS support for frontend dashboard

---

## Tech Stack

### Frontend

- React 18
- Vite for build tooling
- React Router DOM for routing
- Context API for state management
- Axios for API calls
- Custom hooks for auth and utils
- Tanstack React Query for server state management and caching

### Backend

- Python 3.10+
- FastAPI framework
- SQLModel
- MySQL database
- Pydantic for validation
- Alembic for migrations
- JWT for authentication

---

## Quick Start Guide

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.10 or higher)
- MySQL

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Access the application at:
   ```
   http://localhost:5173
   ```

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Create & activate virtual environment:

   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file (see Environment Variables section)

5. Start the server (will initialize database for first time use as well):

   ```bash
   fastapi dev app/main.py
   ```

6. Access API documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

---

## Environment variables

Create a `.env` file at project root (or set env vars in your environment from `.env.example`). Example:

# Backend (.env)

- DATABASE_URL=mysql://user:password@localhost:3306/blog_db
- JWT_SECRET_KEY= use openssl to get 256 bits
- JWT_ALGORITHM=HS256
- ACCESS_TOKEN_EXPIRE_MINUTES=
- FRONTEND_ORIGINS=http://localhost:5173 // when deploying with origin not set as `*`, but not needed for this demo.

# Frontend (.env)

- VITE_API_BASE_URL=http://localhost:8000
- VITE_JWT_LOCAL_STORAGE_KEY=blog_auth_token

Notes:

- DATABASE_URL should be a full SQLAlchemy-style URL for MySQL
- JWT_SECRET_KEY should be kept secret and rotated in production
- FRONTEND_ORIGINS must match your frontend development server
- VITE\_ prefix is required for frontend environment variables

## Project Structure

### Frontend Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ConfirmDialog.jsx
│   │   ├── FloatingButton.jsx
│   │   ├── Layout.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── PasswordInput.jsx
│   │   ├── PostCard.jsx
│   │   ├── PostModal.jsx
│   │   └── SearchBar.jsx
│   ├── context/        # Auth context and providers
│   │   ├── AuthContext.js
│   │   ├── AuthGuards.jsx
│   │   └── AuthProvider.jsx
│   ├── hooks/          # Custom hooks
│   │   ├── useAuth.js
│   │   └── utilsAuth.js
│   ├── pages/          # Page components
│   │   ├── DashboardPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/       # API service layer
│   │   └── api.js
│   └── assets/         # Static assets
```

### Backend Structure

```
backend/
├── app/
│   ├── models/         # SQLAlchemy models
│   │   ├── post.py
│   │   └── user.py
│   ├── routes/         # API routes
│   │   ├── auth.py
│   │   └── post_routes.py
│   ├── schemas/        # Pydantic schemas
│   │   ├── post.py
│   │   └── user.py
│   ├── utils/          # Utility functions
│   │   └── auth.py
│   └── db/            # Database configuration
│       ├── database.py
│       └── session.py
├── alembic/           # Database migrations
└── requirements.txt   # Python dependencies
```

---

## Database schema (PostgreSQL)

Minimal SQL schema (save as schema.sql and run with psql or via migrations):

```sql
-- Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tags
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- PostTags (many-to-many)
CREATE TABLE post_tags (
    post_id INT,
    tag_id INT,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

To apply:

Use Alembic migrations (recommended for ongoing development).

---

## Migrations & seeding

If using Alembic:

1. Configure alembic.ini to use DATABASE_URL or set env in env.py.
2. Initialize (if not present):
   alembic init alembic
3. Create migration:
   alembic revision --autogenerate -m "create initial schema"
4. Apply:
   alembic upgrade head

Seed sample data:

- Provide a `scripts/seed.py` that loads env, connects to DB and inserts sample users/posts.
- Run:
  python scripts/seed.py

(Adjust examples to your project's ORM/async setup.)

---

## Running the app

Development:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Alternative (if you prefer a CLI wrapper and it is installed):
fastapi run app/main.py --reload --port 8000

Notes:

- Ensure .env is loaded. You can use python-dotenv in app startup or set envs externally.
- For production, run with a process manager and multiple workers (e.g., gunicorn + uvicorn workers).

---

## API Overview

### Authentication Endpoints

```
POST /auth/register     # Register new user
POST /auth/login       # Login user (returns JWT token)
GET /auth/me           # Get current user profile
```

### Posts Endpoints

```
GET /posts             # List all posts (with pagination & search)
GET /posts/{id}        # Get single post
POST /posts            # Create new post (auth required)
PUT /posts/{id}        # Update post (auth & author only)
DELETE /posts/{id}     # Delete post (auth & author only)
```

### Additional Features

- Pagination support for posts listing
- Search functionality with title/content filtering
- JWT-based authentication
- Protected routes with role-based access
- Input validation using Pydantic
- Error handling with proper status codes

For detailed API documentation and testing, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Validation Strategy

### Frontend Validation

- Real-time form validation using custom hooks
- Email format validation with regex
- Password strength requirements
- Debounced input validation for better performance
- Error messages

Example of form validation with debounce:

```javascript
// Custom hook for debounced validation
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage in form
const [email, setEmail] = useState("");
const debouncedEmail = useDebounce(email, 500);

useEffect(() => {
  validateEmail(debouncedEmail);
}, [debouncedEmail]);
```

### Backend Validation

- Request/response validation using Pydantic models
- Automatic validation of incoming JSON data
- Structured error responses (422 status code)
- Parameter validation for query params
- Secure password hashing

Example of Pydantic validation:

```python
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str | None = None

class PostCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    content: str = Field(..., min_length=10)
    published: bool = False
```

Security measures:

- Password hashing using bcrypt
- JWT token validation
- Role-based access control
- Input sanitization
- Protection against common vulnerabilities

---

## JWT auth basics

- Sign tokens with JWT_SECRET_KEY and algorithm (HS256).
- Typical token payload: { "sub": "<user_id>", "exp": <timestamp> }
- Use dependency to return current_user from token for protected endpoints.
- Short-lived access tokens and (optional) refresh tokens are recommended.

---

## Troubleshooting

### Frontend Issues

- "Network Error" - Ensure backend server is running and VITE_API_BASE_URL is correct
- "Invalid token" - Check if JWT token is expired or malformed
- "CORS error" - Verify FRONTEND_ORIGINS in backend .env matches your frontend URL

### Backend Issues

- Database connection error - Check MySQL credentials and ensure service is running
- 401 Unauthorized - Verify JWT_SECRET_KEY and token validity
- 422 Validation Error - Check request payload against API documentation
- Migration errors - Ensure database is created and alembic is properly configured

### Common Solutions

1. Clear browser cache and local storage
2. Restart development servers
3. Check console for detailed error messages
4. Verify environment variables are set correctly
5. Ensure all dependencies are installed
