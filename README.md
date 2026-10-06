# Publify — Full Stack Project (local test guide)

Publify is the custom headless CMS engine (Spring Boot API + admin panel). This repo also contains the portfolio site it powers.

    publify/
      backend/    Spring Boot 3 + JWT custom CMS API   (http://localhost:8080)
      frontend/   Next.js 14 site + /admin panel       (http://localhost:3000)

## Run locally (2 terminals)

Prerequisites: Java 17+, Maven 3.9+, Node 18+ (internet access for first dependency download).

**Terminal 1 — backend**
    cd backend
    mvn spring-boot:run
Uses an in-memory H2 database (data resets on restart). Seeded admin: admin@publify.local / ChangeMe123!

**Terminal 2 — frontend**
    cd frontend
    npm install
    cp .env.example .env.local
    npm run dev

## Test checklist
1. Open http://localhost:3000/admin/login and sign in with the seeded admin.
2. Admin > About: fill headline/bio/email, Save.
3. Admin > Projects: add a project with Featured ticked. Add a few Skills and one Experience entry.
4. Admin > Blog: add a post with status PUBLISHED.
5. Admin > Media: upload an image.
6. Open http://localhost:3000 — content appears within ~60 seconds (revalidate window; restart `npm run dev` or wait to see it sooner).
7. Submit the /contact form, then check Admin > Messages. (Email sending needs SMTP env vars; without them it just logs a failure and the message is still saved.)

## Honest status
- Frontend: installed and `next build` passes (all 20 routes).
- Backend: NOT compiled in the sandbox that generated it (Maven Central was unreachable). It was reviewed carefully, but expect possible small compile errors on first `mvn spring-boot:run`. Paste any error and it can be fixed quickly.
