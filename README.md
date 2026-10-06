# Publify

### Modern Content Management & Publishing Platform

Publify is a modern, full-stack content management and publishing platform designed to make digital content **easy to create, organize, manage, and publish**.

Built with **Next.js, Spring Boot, PostgreSQL, and JWT-based authentication**, Publify provides a professional public-facing website alongside a secure administrative content management system.

---

## Overview

Publify separates the public publishing experience from the administrative CMS.

The public website is designed for visitors, readers, and prospective users, while the protected admin application provides authenticated content management capabilities.

```text
                         Publify
                            │
             ┌──────────────┴──────────────┐
             │                             │
        Public Website                 Admin CMS
             │                             │
       Content Discovery             Authentication
       Blogs & Projects              Content Management
       About & Services              Media Management
       Contact                       Messages
             │                             │
             └──────────────┬──────────────┘
                            │
                     Spring Boot API
                            │
                       PostgreSQL
```

---

## Product Vision

Publify is being built around a simple principle:

> **Your content. Beautifully managed.**

The platform is intended to provide the foundation for modern publishing workflows while maintaining a clean, premium, and distraction-free user experience.

---

## Core Features

### Public Website

* Premium responsive interface
* Modern landing page
* About section
* Services
* Projects
* Experience
* Testimonials
* Published blog content
* Individual blog pages
* Contact form
* Responsive navigation and footer
* API-driven public content

### Content Management

Authenticated administrators can manage:

* Projects
* Blog posts
* About information
* Services
* Skills
* Experience
* Testimonials
* Media
* Contact messages

### Blog Management

* Create blog posts
* Edit existing posts
* Delete posts
* Draft and published states
* Unique slugs
* Cover images
* Publication timestamps
* Public blog rendering

### Media Management

* Image uploads
* Media library
* Image preview
* File metadata
* Public media URLs
* Upload validation
* Maximum upload size configuration

### Authentication

* JWT authentication
* Access tokens
* Refresh tokens
* BCrypt password hashing
* Role-based authorization
* Protected administrative endpoints
* Stateless Spring Security architecture

---

## Technology Stack

### Frontend

| Technology   | Purpose         |
| ------------ | --------------- |
| Next.js 14   | React framework |
| React 18     | UI              |
| TypeScript   | Type safety     |
| Tailwind CSS | Styling         |
| Lucide React | Interface icons |

### Backend

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| Spring Boot 3.2.5 | REST API                       |
| Java 17           | Backend runtime                |
| Spring Security   | Authentication & authorization |
| JJWT              | JWT token handling             |
| Spring Data JPA   | Persistence                    |
| Hibernate         | ORM                            |
| Lombok            | Boilerplate reduction          |
| PostgreSQL        | Production database            |
| H2                | Local development database     |

### Infrastructure

| Technology | Purpose                  |
| ---------- | ------------------------ |
| Git        | Version control          |
| GitHub     | Source repository        |
| Docker     | Backend containerization |
| Render     | Production hosting       |
| PostgreSQL | Production database      |

---

## Architecture

Publify uses a separated frontend/backend architecture.

```text
Browser
   │
   ▼
Next.js Frontend
   │
   │ HTTPS / REST API
   ▼
Spring Boot API
   │
   ├── Authentication
   ├── Content APIs
   ├── Media APIs
   └── Contact APIs
   │
   ▼
PostgreSQL
```

The frontend and backend can therefore be deployed independently.

---

## Project Structure

```text
Publify/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── publify/
│   │       │           ├── controller/
│   │       │           ├── dto/
│   │       │           ├── exception/
│   │       │           ├── model/
│   │       │           ├── repository/
│   │       │           ├── security/
│   │       │           └── service/
│   │       │
│   │       └── resources/
│   │
│   ├── Dockerfile
│   ├── pom.xml
│   └── application.yml
│
├── frontend/
│   ├── app/
│   │   ├── admin/
│   │   ├── about/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── experience/
│   │   ├── projects/
│   │   └── page.tsx
│   │
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── .gitignore
└── README.md
```

---

## Backend API

The Spring Boot application exposes REST endpoints for authentication and content management.

### Public endpoints

```text
GET  /about
GET  /skills
GET  /projects
GET  /experience
GET  /testimonials
GET  /services
GET  /blogs
GET  /blogs/{slug}
GET  /media/{filename}
POST /contact
```

### Authentication

```text
POST /auth/login
POST /auth/refresh
```

### Protected administration

Administrative create, update, delete, media-management, and message-management operations require authentication.

---

## Authentication Model

Publify currently uses JWT-based authentication.

```text
Login
  │
  ▼
Email + Password
  │
  ▼
Spring Security
  │
  ▼
JWT Access Token + Refresh Token
  │
  ▼
Authenticated API Requests
```

Access tokens are short-lived while refresh tokens provide a longer-lived mechanism for obtaining new access tokens.

Passwords are stored using BCrypt hashing rather than plaintext credentials.

---

## Local Development

### Prerequisites

Install:

* Java 17
* Maven
* Node.js
* npm
* Git

---

### 1. Clone the repository

```bash
git clone https://github.com/Imprawin7/Publify.git
cd Publify
```

---

### 2. Start the backend

```bash
cd backend
mvn clean package -DskipTests
```

Run:

```bash
java -jar target/publify-api-1.0.0.jar
```

The backend runs on:

```text
http://localhost:8080
```

---

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

## Local Environment Configuration

The frontend can use:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

The backend supports environment-based configuration for production values.

Important production variables include:

```text
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=<production database URL>
JWT_SECRET=<strong secret>
JWT_ACCESS_TOKEN_EXPIRY_MS=900000
JWT_REFRESH_TOKEN_EXPIRY_MS=604800000
FRONTEND_ORIGIN=<frontend URL>
```

Never commit production secrets to Git.

---

## Default Development Administrator

The local development environment includes a seeded administrator account:

```text
Email:    admin@publify.local
Password: ChangeMe123!
```

### Security Notice

The default development credentials **must not be used for a production administrator account**.

Production credentials should be supplied through environment variables and managed securely.

---

## Production Deployment

Publify is currently structured for deployment using Render.

### Production Architecture

```text
                     Render
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
     Frontend       Backend       PostgreSQL
     Next.js       Spring Boot      Database
```

### Production Services

**Frontend**

```text
https://publify-nih3.onrender.com
```

**Backend**

```text
https://publify-api.onrender.com
```

The frontend communicates with the backend through HTTPS REST requests.

---

## Backend Deployment

The backend includes a multi-stage Dockerfile.

```text
Maven Build
     │
     ▼
Spring Boot JAR
     │
     ▼
Java 17 Runtime
     │
     ▼
Docker Container
```

Render uses the backend Dockerfile to build and run the API.

---

## Database

### Development

Local development uses an H2 in-memory database.

```text
jdbc:h2:mem:publify
```

### Production

Production uses PostgreSQL through the Spring `prod` profile.

```text
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=<Render PostgreSQL Internal Database URL>
```

The production database should always use a secure, private connection where supported by the hosting provider.

---

## Security

Publify includes several security controls:

* JWT authentication
* BCrypt password hashing
* Stateless authentication
* Role-based endpoint authorization
* CORS configuration
* Protected administrative routes
* Environment-based secrets
* Production H2 console disabled
* Separate public and authenticated API access

Production deployments should always use:

* Strong JWT secrets
* Secure administrator credentials
* HTTPS
* Restricted CORS origins
* Secure database credentials
* Proper persistent storage for uploaded media

---

## Admin CMS

The administrative interface is intentionally separated from the public website.

```text
/admin
```

The admin application provides management interfaces for:

```text
Dashboard
├── About
├── Projects
├── Blogs
├── Experience
├── Services
├── Skills
├── Testimonials
├── Media
└── Messages
```

The public website and admin CMS use different layouts and access rules.

---

## Content Model

Publify currently supports the following primary content entities:

```text
About
Blog
Experience
Media
Message
Project
ServiceItem
Skill
Testimonial
User
```

The architecture is designed to evolve toward a more complete multi-user CMS model.

---

## Roadmap

Publify is being developed incrementally.

### Phase 1 — Production Foundation

* [x] Spring Boot backend
* [x] Next.js frontend
* [x] JWT authentication
* [x] Administrative CMS
* [x] Public website
* [x] PostgreSQL production configuration
* [x] Docker backend deployment
* [x] Render backend deployment
* [x] Render frontend deployment

### Phase 2 — Account System

* [ ] Public registration
* [ ] Account creation
* [ ] Secure onboarding
* [ ] Password management
* [ ] Account settings

### Phase 3 — Workspace Architecture

* [ ] Workspaces
* [ ] Workspace membership
* [ ] Workspace switching
* [ ] Workspace-level permissions
* [ ] Content ownership

### Phase 4 — Roles & Collaboration

Planned roles:

```text
OWNER
ADMIN
EDITOR
AUTHOR
```

Planned capabilities include:

* Member invitations
* Role management
* Permission controls
* Collaborative publishing
* Workspace administration

### Phase 5 — Publishing Platform

* [ ] Publishing workflows
* [ ] Scheduled publishing
* [ ] Content revisions
* [ ] Draft management
* [ ] Content search
* [ ] Categories
* [ ] Tags
* [ ] SEO controls
* [ ] Analytics

---

## Design Principles

Publify follows several product and engineering principles:

### 1. Content First

The interface should keep content creation and publishing at the center of the experience.

### 2. Simple by Default

Complex functionality should remain understandable and accessible.

### 3. Professional Visual Language

Publify uses restrained typography, generous spacing, subtle borders, and focused visual hierarchy rather than excessive decoration.

### 4. Secure by Design

Authentication, authorization, secrets, and production configuration are treated as core infrastructure.

### 5. Modular Architecture

Frontend, backend, authentication, content, and infrastructure should remain independently maintainable.

### 6. Progressive Development

New architecture should be introduced in controlled phases without unnecessarily disrupting existing functionality.

---

## Important Production Considerations

### Media Storage

The current backend stores uploaded media using the application filesystem.

On cloud platforms such as Render, application filesystems may be ephemeral depending on the service configuration.

For production-scale media storage, Publify should eventually use durable object storage such as:

* Amazon S3
* Cloudflare R2
* Cloudinary
* Another compatible object-storage provider

### Database Migrations

The current production configuration uses Hibernate schema updates during the initial deployment stage.

As the platform evolves, dedicated database migration tooling such as Flyway or Liquibase should be introduced.

### Authentication Expansion

The current authentication model is administrator-oriented.

The planned account and workspace architecture will move authorization from a single global administrator model toward:

```text
User
  │
  ▼
Workspace Membership
  │
  ▼
Workspace
  │
  ├── Role
  ├── Permissions
  └── Content
```

---

## Repository

Source code:

[GitHub — Imprawin7/Publify](https://github.com/Imprawin7/Publify?utm_source=chatgpt.com)

---

## License

This project is currently maintained as a private/product development project.

License terms should be defined before distributing the software publicly.

---

## Status

**Publify is actively under development.**

The current production foundation includes a deployed Next.js frontend, Spring Boot API, and PostgreSQL database, with further account, workspace, collaboration, and publishing capabilities planned for subsequent development phases.
