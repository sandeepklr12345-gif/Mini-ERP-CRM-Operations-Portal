# 🏢 Mini ERP + CRM Operations Portal

**A full-stack operations management platform for wholesale and distribution businesses.**

The Mini ERP + CRM Operations Portal unifies customer management, product catalogues, inventory tracking, stock movement auditing, and sales challan processing in a single web application. Built with React, TypeScript, Node.js, Express, Prisma, and PostgreSQL, it combines a responsive interface with backend-enforced permissions and reliable inventory workflows.

<p align="center">
  <strong>CRM · Inventory · Sales Operations · Role-Based Access Control</strong>
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Business Workflow](#-business-workflow)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Database Design](#-database-design)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [API Overview](#-api-overview)
- [Security and Data Integrity](#-security-and-data-integrity)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

## 🎯 Overview

Wholesale and distribution operations involve several connected activities: maintaining customer relationships, managing product catalogues, tracking available stock, and fulfilling customer orders. When these activities are handled independently, teams can lose visibility into inventory, customer follow-ups, and dispatch records.

This project addresses that challenge through a unified operations portal.

### What the system provides

- A centralized customer CRM with follow-up tracking.
- Product and inventory management with stock movement history.
- Sales challan creation, confirmation, and cancellation.
- Role-based access for administrators and operational teams.
- JWT-based authentication for protected API access.
- Transactional inventory updates to help prevent inconsistent stock records.

**Project objective:** Demonstrate how a modular full-stack application can connect CRM and ERP workflows while enforcing business rules at the backend.

## ✨ Key Features

### 🔐 1. Authentication and Access Control

- JWT-based authentication.
- Protected API endpoints.
- Role-Based Access Control (RBAC).
- Role-specific access to operational modules.
- Password hashing and authenticated frontend requests.

### 👥 2. Customer Relationship Management

- Maintain customer records and business information.
- Track customer status across lead, active, and inactive stages.
- Record customer follow-up notes.
- View customer-related sales and order history where supported.
- Organize customer information for sales operations.

### 📦 3. Product Catalogue and Inventory

- Maintain product records and unique SKU identifiers.
- Track current stock levels.
- Record stock-in and stock-out operations.
- Maintain an audit trail of inventory movements.
- Identify products that fall below configured stock thresholds.
- Prevent stock from becoming negative through server-side validation.

### 🧾 4. Sales Challan Management

- Create sales challans containing multiple products.
- Maintain a draft before final confirmation.
- Validate available inventory before dispatch confirmation.
- Deduct stock when a challan is confirmed.
- Record corresponding stock movements.
- Cancel confirmed challans with the appropriate inventory restoration.

### 📊 5. Operations Dashboard

- Present operational summaries in one interface.
- Surface customer, product, inventory, and challan information.
- Help users identify low-stock items and review recent activity.

### 🔄 6. Consistent Data Management

- Use Prisma ORM to interact with the relational database.
- Organize backend responsibilities into routes, controllers, and services.
- Apply database transactions to critical inventory workflows.
- Keep historical challan information consistent with the original transaction.

## 🔁 Business Workflow

The application connects customer management to inventory and dispatch operations.

```mermaid
flowchart TD
    A[Customer Management] --> B[Product Catalogue]
    B --> C[Create Sales Challan]
    C --> D[Save as Draft]
    D --> E{Confirm Challan}
    E -->|Insufficient Stock| F[Reject Confirmation]
    F --> D
    E -->|Stock Available| G[Atomic Database Transaction]
    G --> H[Deduct Inventory]
    G --> I[Record Stock Movement]
    H --> J[Confirmed Challan]
    I --> J
    J --> K{Cancel Challan?}
    K -->|Yes| L[Restore Inventory]
    K -->|No| M[Retain Transaction Record]
```

### Inventory integrity

A draft challan does not deduct inventory. During confirmation, the backend validates stock availability and processes the related inventory updates within a database transaction.

If an item does not have sufficient stock, the confirmation should fail without committing partial inventory changes.

When a confirmed challan is cancelled, the corresponding stock is restored through the cancellation workflow.

This approach helps preserve consistency between sales records and inventory balances.

## 🏗️ System Architecture

The application follows a layered client-server architecture.

```mermaid
flowchart TB
    U[User]
    FE[React and TypeScript Frontend]
    AX[Axios HTTP Client]
    API[Express REST API]
    AUTH[JWT Authentication and RBAC]
    CTRL[Controllers and Validation]
    SVC[Business Logic Services]
    ORM[Prisma ORM]
    DB[(PostgreSQL Database)]

    U --> FE
    FE --> AX
    AX --> API
    API --> AUTH
    AUTH --> CTRL
    CTRL --> SVC
    SVC --> ORM
    ORM --> DB
```

### Architecture responsibilities

| Layer | Responsibility |
|---|---|
| Frontend | User interface, navigation, forms, and operational views |
| HTTP client | API communication and JWT authorization headers |
| REST API | Request routing and endpoint handling |
| Authentication and RBAC | Identity verification and permission enforcement |
| Controllers | Request processing and response formatting |
| Services | Business rules and transactional operations |
| Prisma ORM | Database queries and transaction management |
| PostgreSQL | Persistent relational data storage |

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript |
| Frontend tooling | Vite |
| HTTP communication | Axios |
| Backend runtime | Node.js |
| Backend framework | Express.js |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Authentication | JSON Web Tokens (JWT) |
| Password security | bcryptjs |
| Development tools | npm, Git, Postman |

## 📁 Project Structure

```text
Mini-ERP-CRM-Operations-Portal/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
│
├── .gitignore
└── README.md
```

*The tree illustrates the main architectural areas. Individual filenames and folders may differ from the current repository.*

## 👤 User Roles

The application is designed around four operational roles.

| Role | Primary responsibility |
|---|---|
| `ADMIN` | Administrative access and overall system management |
| `SALES` | Customer relationship management and sales challans |
| `WAREHOUSE` | Product catalogue and inventory operations |
| `ACCOUNTS` | Financial and transaction-related operational visibility |

Access should be enforced by backend authorization rules, not merely by hiding frontend buttons or pages.

## 🗄️ Database Design

The relational data model supports the application's principal business entities.

| Entity | Purpose |
|---|---|
| `User` | User accounts, credentials, and assigned roles |
| `Customer` | Customer and business information |
| `CustomerFollowup` | Customer interaction and follow-up history |
| `Product` | Product catalogue, SKU, pricing, and stock details |
| `StockMovement` | Historical inventory movement records |
| `Challan` | Sales challan header, customer, and status |
| `ChallanItem` | Product quantities and item-level challan information |
| `ChallanSequence` | Sequential challan numbering |

The exact model names should be checked against `backend/prisma/schema.prisma` before treating this list as the complete database schema.

## 🚀 Getting Started

### Prerequisites

Install the following:

- Node.js and npm.
- PostgreSQL.
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/sandeepklr12345-gif/Mini-ERP-CRM-Operations-Portal.git
cd Mini-ERP-CRM-Operations-Portal
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a backend `.env` file and configure the required environment variables using the next section.

### 3. Configure the database

Create a PostgreSQL database and provide its connection string through `DATABASE_URL`.

Then run the Prisma commands appropriate for the repository's existing migration setup:

```bash
npx prisma generate
npx prisma migrate deploy
```

For a new development database without existing migrations, use the project's documented development workflow instead of `migrate deploy`.

### 4. Start the backend

Use the development script defined in `backend/package.json`. For projects configured with `dev` as the development script:

```bash
npm run dev
```

The backend has previously been configured to run on:

`http://localhost:5000`

### 5. Configure and start the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Configure the frontend API base URL to point to the backend. The expected local API base is:

`http://localhost:5000/api`

Start the frontend using its configured Vite development script:

```bash
npm run dev
```

The frontend has previously been configured to run on:

`http://localhost:5173`

**Note:** Confirm the actual scripts and environment variable names in each `package.json` and the application's configuration before running these commands.

## 🔧 Environment Configuration

Keep environment variables in local `.env` files that are excluded from version control.

Typical configuration includes:

**Backend `.env`**

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/minierp_db"
JWT_SECRET="REPLACE_WITH_A_STRONG_RANDOM_SECRET"
```

**Frontend configuration**

```env
VITE_API_URL=http://localhost:5000/api
```

These names are illustrative and should match the variables read by the current source code.

### Security checklist

- Never commit `.env` files or database credentials.
- Use a strong, randomly generated JWT secret.
- Store passwords as hashes, not plaintext.
- Keep authorization checks on the backend.
- Validate inputs before performing database operations.
- Use appropriate production secrets and database permissions.

## 🌐 API Overview

The backend exposes REST endpoints for the main application modules.

| Module | Purpose |
|---|---|
| `/api/auth` | Authentication and user identity |
| `/api/customers` | Customer management and follow-ups |
| `/api/products` | Product catalogue operations |
| `/api/inventory` | Stock operations and movement history |
| `/api/challans` | Sales challan workflows |
| `/api/dashboard` | Operational dashboard data |

The exact HTTP methods, request payloads, permissions, and response schemas are defined by the backend implementation.

If API documentation is enabled, inspect the backend's configured documentation endpoint or import the project's Postman collection to explore and test requests.

## 🛡️ Security and Data Integrity

The project emphasizes several important backend engineering practices:

- **Authentication:** Verify user identity before accessing protected resources.
- **Authorization:** Apply role-based permissions to sensitive operations.
- **Password protection:** Hash passwords before storing them.
- **Transactional updates:** Keep challan confirmation and associated inventory updates consistent.
- **Stock validation:** Reject dispatches that exceed available inventory.
- **Auditability:** Record stock movements for operational traceability.
- **Configuration security:** Keep credentials outside committed source code.

## 🔮 Future Enhancements

Potential extensions include:

- PDF generation and download for sales challans.
- Advanced inventory reports and stock forecasting.
- Multi-warehouse stock transfers.
- Barcode or QR-code-based product identification.
- Exportable customer and sales reports.
- Automated integration and end-to-end tests.
- Notifications for overdue customer follow-ups and low stock.
- Deployment monitoring and CI/CD automation.

These are proposed enhancements, not claims about currently implemented functionality.

## 🎓 Learning Outcomes

This project demonstrates practical application of:

- Full-stack web development.
- REST API design.
- JWT authentication and role-based authorization.
- Relational database modeling with Prisma.
- Transaction-safe business logic.
- Separation of controllers, services, and data access.
- Integration between frontend state and backend APIs.

## 👨‍💻 Author

**Sandeep K**

GitHub: [sandeepklr12345-gif](https://github.com/sandeepklr12345-gif)

Project: [Mini ERP + CRM Operations Portal](https://github.com/sandeepklr12345-gif/Mini-ERP-CRM-Operations-Portal)

---

*Developed to bring customer management, inventory control, and sales operations into one cohesive application.*
