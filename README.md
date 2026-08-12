# Mini ERP + CRM Operations Portal

A full-stack ERP and CRM operations portal designed for a wholesale/distribution business. The application provides role-based access, customer relationship management, product and inventory management, stock movement tracking, and sales challan workflows.

The project is built using React and TypeScript on the frontend, Node.js/Express and TypeScript on the backend, Prisma ORM, and PostgreSQL.

---

## Features

### Authentication & Role-Based Access

- JWT-based authentication
- Secure password hashing
- Protected routes
- Role-based authorization
- Four application roles:
  - Admin
  - Sales
  - Warehouse
  - Accounts
- Persistent frontend authentication
- Logout functionality

### Customer CRM

- Create customers
- View customer list
- Search customers
- View customer details
- Update customer information
- Customer classification
- Customer status management
- Follow-up information

### Product Management

- Create products
- View products
- Update products
- Search/filter products
- Unique SKU management
- Product pricing
- Current stock visibility
- Minimum stock levels
- Warehouse location

### Inventory Management

- Current stock tracking
- Stock movement history
- IN and OUT stock movements
- Stock validation
- Low-stock identification
- Prevention of negative inventory

### Sales Challans

- Create challans
- Save challans as drafts
- Confirm challans
- Cancel challans
- Customer association
- Multiple products per challan
- Stock validation during confirmation
- Automatic stock reduction
- Stock movement generation
- Product snapshot preservation
- Stock restoration during cancellation

### Dashboard

The dashboard provides an overview of operational information such as:

- Customers
- Products
- Low-stock inventory
- Challans
- Recent operational information

Dashboard values are retrieved from the backend rather than being hard-coded.

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Frontend Language | TypeScript |
| Frontend Build Tool | Vite |
| Routing | React Router |
| HTTP Client | Axios |
| Notifications | React Hot Toast |
| Backend | Node.js |
| Backend Framework | Express.js |
| Backend Language | TypeScript |
| Authentication | JWT |
| Password Security | bcrypt/bcryptjs |
| Validation | Zod |
| ORM | Prisma |
| Database | PostgreSQL |
| API Style | REST |
| API Testing | Postman |
| Version Control | Git/GitHub |

---

# Architecture

The application follows a layered full-stack architecture.

```text
                    ┌─────────────────────┐
                    │      User           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │    TypeScript       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Axios API Services  │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Express Backend     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Middleware          │
                    │ JWT / Roles /       │
                    │ Validation / Errors │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Routes              │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Controllers         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Services            │
                    │ Business Logic      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Prisma ORM          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ PostgreSQL          │
                    └─────────────────────┘