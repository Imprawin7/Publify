# Publify — Backend (API + CMS engine)

Publify is a custom-built headless CMS and REST API, used here to power the portfolio site. Java 17 + Spring Boot 3 + Spring Security (JWT) + JPA.

## Quick start (zero setup, H2 in-memory DB)

Requires Java 17+ and Maven installed locally (the Maven wrapper isn't bundled in this scaffold — add one with `mvn -N wrapper:wrapper` if you want it):

```bash
mvn spring-boot:run
```

The app boots on `http://localhost:8080` using an in-memory H2 database (data resets on restart) and seeds one admin user automatically:

- **email:** `admin@publify.local` (override with `ADMIN_SEED_EMAIL`)
- **password:** `ChangeMe123!` (override with `ADMIN_SEED_PASSWORD`)

**Change these before any real deployment.**

## Running against real PostgreSQL

```bash
export DB_URL=jdbc:postgresql://localhost:5432/publify
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

## Environment variables

| Var | Purpose | Default |
|---|---|---|
| `JWT_SECRET` | HMAC signing key for JWTs — **must** be changed and kept secret in production | dev placeholder |
| `FRONTEND_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `UPLOAD_DIR` | Local folder for uploaded media | `uploads` |
| `MAIL_HOST` / `MAIL_PORT` / `MAIL_USERNAME` / `MAIL_PASSWORD` | SMTP for contact-form notification emails | — |
| `CONTACT_NOTIFY_EMAIL` | Where contact-form submissions are emailed | `you@example.com` |
| `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` | First admin account, created on first boot only | see above |

## API summary

- `POST /auth/login`, `POST /auth/refresh` — JWT auth
- `GET/PUT /about` · `GET/POST/PUT/DELETE /skills` · `/projects` · `/blogs` · `/experience` · `/testimonials` · `/services`
  - GET on all of these is public; writes require the admin JWT (`Authorization: Bearer <accessToken>`)
- `POST /contact` (public) · `GET /messages`, `PUT /messages/{id}/read` (admin)
- `POST /upload/image` (admin) → returns a `Media` record with a servable `url`
- `GET /media/{filename}` (public) — serves the uploaded file bytes
- `GET /media/library` (admin) — lists all uploaded media

Full endpoint list and DB schema: see the project documentation.

## What's stubbed / needs attention before production

- Email sending needs real SMTP credentials (Gmail app password, SES, etc.) — currently fails silently and just logs if unset.
- File storage is local disk (`uploads/`) — swap `FileStorageService` for S3/Cloudinary for a real deployment (multi-instance hosting won't share local disk).
- No refresh-token revocation list yet — refresh tokens are valid until expiry even after "logout". Add a token blacklist table if you need hard logout.
- No rate limiting on `/auth/login` or `/contact` yet — add e.g. Bucket4j or a gateway-level limiter before going live.
- This was scaffolded without a live Maven Central connection in the build sandbox, so it hasn't been compiled here — brace/structure-checked instead. Run `./mvnw compile` yourself on first pull to confirm; standard Spring Boot 3.2 + Java 17 setup, so it should build cleanly.
