# Ecommerce Full Stack App (React + Spring Boot)

This project contains:

- `frontend`: React (Vite) UI for authentication, dashboard, and profile management.
- `backend`: Spring Boot REST API with JWT auth, RBAC, and seeded demo data.

## Features

- User registration and login using JWT authentication.
- Role-based access control:
  - `ROLE_ADMIN` can view, add, update, and delete products.
  - `ROLE_USER` can only view products.
- User profile management:
  - View profile
  - Update profile details
  - Change password
- Shared global frontend styling in `frontend/src/style.css`.

## Predefined Users

Passwords satisfy the same strong rules as registration (mixed case, digit, special `@$!%*?&`, 8+ characters).

- **Admin**: `admin` / `Admin@123` — `admin@gmail.com`
- **Admin 2**: `admin2` / `Admin2@demo` — `admin2@gmail.com`
- **User**: `user` / `User@12345` — `user@gmail.com`

## Backend Setup

1. Install Java 17+ and Maven.
2. Configure environment variables for Google SSO (recommended via `.env`):
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `OAUTH2_REDIRECT_URI` (default: `http://localhost:5173/oauth-success`)
3. Start backend:
   ```bash
   cd backend
   # Windows PowerShell (loads backend/.env automatically)
   ./run-with-env.ps1

   # Or default Maven run
   mvn spring-boot:run
   ```
4. API runs on `http://localhost:8080`.

## Frontend Setup

1. Install Node.js 18+.
2. Start frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. App runs on `http://localhost:5173`.

## API Endpoints

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Products
  - `GET /api/products` (ADMIN/USER)
  - `POST /api/products` (ADMIN)
  - `PUT /api/products/{id}` (ADMIN)
  - `DELETE /api/products/{id}` (ADMIN)
- Profile
  - `GET /api/profile`
  - `PUT /api/profile`
  - `PUT /api/profile/change-password`

## GitHub Private Repository Upload

After creating a private repository on GitHub, run:

```bash
git init
git add .
git commit -m "Initial full stack ecommerce app with RBAC"
git branch -M main
git remote add origin <your-private-repo-url>
git push -u origin main
```
