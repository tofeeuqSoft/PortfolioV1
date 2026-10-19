# Portfolio Website — Tauhidul Islam (Tofeeuq)

A full-stack MERN portfolio where the site itself is the proof of skill: public
portfolio + private admin CMS backed by a REST API and MongoDB.

- **Stack:** MongoDB, Express.js, React.js (Vite), Node.js, Tailwind CSS
- **Scope (v1 / MVP):** public portfolio site, admin dashboard, REST API,
  authentication, contact form, CV download, theme toggle.

## Structure

```
PortfolioV1/
├─ client/   React + Vite + Tailwind CSS
└─ server/   Node + Express + Mongoose
```

## Prerequisites

- Node.js 18+
- A MongoDB connection string (local or Atlas)

## Setup

### 1. Server

```bash
cd server
cp .env.example .env          # then edit values
npm install
npm run seed                  # creates admin user + demo content
npm run dev                   # http://localhost:5000
```

### 2. Client

```bash
cd client
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                   # http://localhost:5173
```

Default admin credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in
`server/.env` (set by `npm run seed`).

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| server | `npm run dev` | Run API with nodemon |
| server | `npm start` | Run API (production) |
| server | `npm run seed` | Seed database |
| client | `npm run dev` | Vite dev server |
| client | `npm run build` | Production build |
| client | `npm run lint` | ESLint |

## API

All responses use `{ success, data, message }`. See the requirement document
section 10 for the full endpoint list.

## SEO

- `GET /sitemap.xml` — dynamic sitemap built from projects and published posts
- `GET /robots.txt` — allows all, disallows `/admin`
- Per-route `<title>`, meta, canonical, Open Graph/Twitter tags, and JSON-LD
  (`Person`, `CreativeWork`, `BlogPosting`) are injected client-side

Set `SITE_URL` in `server/.env` to your production domain so the sitemap points
at the right host.

## Root scripts

Convenience wrappers from the repo root:

| Command | Purpose |
|---------|---------|
| `npm run install:all` | Install server + client deps |
| `npm run dev:server` / `npm run dev:client` | Run each dev server |
| `npm run build` | Build the client |
| `npm run start` | Start the API (serves `client/dist` when present) |
| `npm run seed` | Seed the database |
| `npm run lint` | Lint the client |
| `npm test` | Run server + client tests |

## Testing

- **API:** import `postman/portfolio.postman_collection.json` and
  `postman/portfolio.postman_environment.json` into Postman. Run **Auth → Login**
  first (Postman stores the httpOnly cookie automatically), then the rest.
  Request tests assert status codes and key fields.
- **Unit tests:**
  - `server` — `npm test` uses the built-in Node test runner
    (`server/tests/*.test.js`).
  - `client` — `npm test` runs Vitest (`src/**/*.test.js`) with jsdom.

CI runs both suites on every push/PR to `main`.

## Deployment (free tier)

Deploy the whole app as one **monolithic service on Render**: Express serves both
the REST API and the built React app from a single origin, backed by a free
MongoDB Atlas cluster. `render.yaml` is a ready blueprint.

### 1. Database — MongoDB Atlas (free M0)
1. Create a free **M0** cluster at <https://mongodb.com/atlas>.
2. Add a database user (username + password).
3. Under **Network Access**, allow `0.0.0.0/0` (Render has no fixed IP).
4. Copy the connection string:
   `mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/portfolio?retryWrites=true&w=majority`

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/portfolio.git
git push -u origin main
```

### 3. Client build variables
Create `client/.env.production` with:
```
VITE_API_URL=/api
```

### 4. Render Blueprint
1. In Render: **New → Blueprint**, point it at the repo.
2. Fill the `sync: false` secrets: `MONGO_URI`, `CLIENT_ORIGIN`, `SITE_URL`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, optional `GITHUB_TOKEN` and SMTP values.
   `JWT_SECRET` is generated automatically.
3. Set `CLIENT_ORIGIN` and `SITE_URL` to the deployed URL
   (`https://<service-name>.onrender.com`).

### 5. Seed once
After the first deploy, open the service **Shell** and run:
```bash
npm --prefix server run seed
```
Then log in at `/admin/login` and **change the default password**.

### Notes
- The blueprint has **no persistent disk** so it runs on the free plan. Uploaded
  images/CV are written to disk and lost on restart/redeploy — move to
  Cloudinary / Cloudflare R2 (or add a paid `disk:` block) for durable uploads.
- Free web services sleep after ~15 min of inactivity, so the first request cold
  starts (~50s). A scheduled ping to `/api/health` (e.g. cron-job.org) keeps it
  warm.
- Production cookies use `secure + sameSite=none`; the same-origin HTTPS deploy
  works as-is.

### Split deploy (optional)

Host the client on Vercel/Netlify and the API on Render, then set
`VITE_API_URL` / `VITE_API_ORIGIN` to the API host and `CLIENT_ORIGIN` on the
server to the client host.

CI: `.github/workflows/ci.yml` lints and builds the client and syntax-checks the
server on every push/PR to `main`.
