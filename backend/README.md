# Backend - Mini ERP + CRM

Backend REST API for the Mini ERP + CRM Operations Portal.

The backend is responsible for authentication, authorization, customer management, product management, inventory operations, stock movements, sales challans, dashboard data, and database communication.

---

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt/bcryptjs
- Zod
- CORS
- Helmet
- REST APIs

---

# Architecture

The backend follows a layered architecture:

```text
HTTP Request
     │
     ▼
Middleware
     │
     ├── JWT Authentication
     ├── Role Authorization
     ├── Validation
     └── Error Handling
     │
     ▼
Routes
     │
     ▼
Controllers
     │
     ▼
Services
     │
     ▼
Prisma ORM
     │
     ▼
PostgreSQL