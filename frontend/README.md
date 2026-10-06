# Portfolio Frontend + Publify Admin Panel

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Fetches all content from the custom CMS backend at build/request time — no content is hardcoded in the frontend.

## Setup

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_BASE_URL at your running backend
npm run dev
```

Runs on `http://localhost:3000`. The backend (see `../backend`) must be running for content to appear — every page fails soft to an empty/fallback state if the API is unreachable, so the site never crashes to a blank screen.

## Pages

| Route | Content |
|---|---|
| `/` | Hero + featured projects + top skills |
| `/about` | Bio + grouped skills list |
| `/projects` | All projects |
| `/experience` | Chronological timeline |
| `/blog` | Published posts |
| `/blog/[slug]` | Single post |
| `/contact` | Contact form → `POST /contact` on the backend |

## Publify admin panel (the CMS UI)

Lives at `/admin` in this same app — no separate deploy needed. Sign in at `/admin/login` with the backend's seeded admin account (see the backend README), then manage every content type: About, Skills, Projects, Blog, Experience, Testimonials, Services, Media, and incoming contact Messages.

- Auth is JWT, stored in `localStorage` (`lib/adminApi.ts`), with a single silent refresh attempt on a 401 before forcing re-login.
- Most resources (Skills, Projects, Experience, Testimonials, Services, Blog) share one generic CRUD component, `components/admin/ResourceManager.tsx` — each page just supplies its field list.
- The client-side auth check in `AdminShell` is a UX guard only, not the real security boundary — every write still requires a valid admin JWT enforced by the backend itself. Someone can't fake being logged in and skip the API's own check.
- `/admin` is excluded from search indexing (`robots: noindex` in `app/admin/layout.tsx`), but it's not otherwise hidden — for real production use, put it behind an extra layer (VPN, IP allowlist, or a second auth factor) if that matters to you.

## Design system

- **Palette:** ink `#161A20`, paper `#F7F4EC`, accent `#1F6F63`, hairline `#DAD5C6` — warm, restrained, print-like rather than a SaaS-card look.
- **Type:** Fraunces (display, serif) for headlines, IBM Plex Sans (body) — loaded via `next/font/google`, so **the build machine needs internet access to fonts.googleapis.com**. If you're building in a network-restricted sandbox, either allow that domain or temporarily swap `app/layout.tsx` to system fonts (see git history / ask for a swap) to build locally.
- Layout is left-aligned, editorial, hairline-rule dividers between sections — no rounded "SaaS cards," no gradients.

## Verified

This scaffold was installed and run through `next build` in the sandbox that generated it — all 20 routes (8 public + login + dashboard + 10 content-type admin pages) compile, type-check, and prerender successfully. The only failure encountered along the way was Google Fonts being unreachable from that sandbox's restricted network — a sandbox limitation, not a code issue — and one real bug (a missing `Media` type) that the build caught and this version has fixed.

## Next steps

- Swap the blog post renderer for `react-markdown` if posts are authored in Markdown rather than plain text.
- Add `sitemap.ts` / `robots.ts` and per-page `generateMetadata` for stronger SEO once real content is in.
- Consider adding pagination to `ResourceManager` if any content type grows past a few dozen items — it currently loads each resource's full list at once.
