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

- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

## Backend Setup

1. Install Java 17+ and Maven.
2. Start backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
3. API runs on `http://localhost:8080`.

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
