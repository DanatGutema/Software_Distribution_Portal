# Software_Distribution_Portal

A centralized internal platform designed to help engineers upload, manage, and download software packages, Windows image files, and bank-specific configuration resources.

The system was built to improve operational efficiency, reduce configuration mismatches, and provide district engineers with quick access to the correct software versions and deployment assets.

---

## Overview
The system is an internally developed solution that centralizes software distribution and version management.

It helps prevent issues such as:

* OS and software version mismatches
* incorrect bank-specific configurations
* outdated image usage
* deployment delays for field and district engineers

---

## Key Features

* Secure authentication and authorization
* Role-based access control
* Upload and download software packages
* Windows image file management
* Bank-specific resource organization
* Resume interrupted downloads
* Version control support
* Search and filtering
* REST API architecture
* Admin seeding and automatic initialization

---

## Tech Stack

### Frontend

* **React**
* **Vite**
* **TypeScript**
* **Tailwind CSS**
* **Axios**

### Backend

* **Node.js**
* **Express.js**
* **REST API**

### Database

* **PostgreSQL**
* **Prisma ORM**

### Authentication & Security

* **JWT (JSON Web Token)**
* **Cookie-based authentication**
* **bcrypt** for password hashing
* **cookie-parser**

### File Handling

* **Multer** for file uploads

---

## System Architecture

```text
React Frontend
     ↓
Express REST API (Node.js)
     ↓
Prisma ORM
     ↓
PostgreSQL Database
```

---

## Authentication Flow

```text
Login
  ↓
Generate Access Token (15 min)
  ↓
Generate Refresh Token (7 days)
  ↓
Store token in secure cookies
  ↓
Middleware verifies token
  ↓
Grant protected route access
```

---

## Backend Structure

The backend is built using Express middleware architecture.

Typical middleware flow:

```js
(req, res, next)
```

Used for:

* authentication
* authorization
* request validation
* error handling
* file upload processing

---

## API Endpoints

Example routes:

```text
/api/auth
/api/banks
/api/files
/api/images
```

---

## Admin Seeding

The project includes a seeding script that automatically ensures admin user availability.

Behavior:

* if admin exists → update
* if admin does not exist → create automatically

---

## Installation

```bash
git clone <your-repo-url>
cd moti-hub
npm install
```

---

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Run Backend

```bash
cd backend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret
PORT=5000
```

---

## Purpose

This system was developed internally to support engineering teams by providing a reliable centralized repository for software deployment resources and operational files.

---

## Author

Developed by **Danat Gutema**
