# CelyMary Greener Precast Blocks — Website

A one-page website for **CelyMary Greener Precast Blocks**, an early-stage startup making precast blocks with a much lower carbon footprint than conventional concrete blocks.

The site gives architects, engineers, builders, real estate developers, investors and collaboration partners one place to see what the company offers and to get in touch.

> **Status:** all MVP sections (US-01 to US-04) are built.

## What the site covers

- **Hero and "Our solution":** lower-carbon precast blocks, made with recycled industrial materials and produced locally.
- **Products:** the planned range, all marked _in development_: standard building blocks, solar panel ballast blocks, paving blocks, retaining wall and landscaping blocks, and kerbs and edging.
- **For customers, investors and partners:** what we offer each group, our current stage and roadmap, and the team.
- **Contact:** a form that opens a pre-filled email.

## Tech stack

- [Vue 3](https://vuejs.org/) + TypeScript
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) for tests
- ESLint + Prettier
- DevContainer with Docker / docker compose
- Hosted on [Vercel](https://vercel.com/) as a static build

## Getting started

### Requirements

- [Docker](https://www.docker.com/) with docker compose
- [VS Code](https://code.visualstudio.com/) with the **Dev Containers** extension (recommended)

You don't need Node.js on your machine. Everything runs inside the container.

### Option A: VS Code DevContainer (recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/Selam1627/Cely-Precast-Blocks.git
   cd Cely-Precast-Blocks
   ```
2. Copy the example environment file and fill in the values:
   ```bash
   cp .env.example .env
   ```
3. Open the folder in VS Code and choose **Dev Containers: Reopen in Container**. The first time, this builds the image and runs `npm install`.
4. In the container terminal:
   ```bash
   npm run dev
   ```
5. Open <http://localhost:5173>.

### Option B: docker compose only

```bash
cp .env.example .env
docker compose run --rm app npm install
docker compose up
```

Then open <http://localhost:5173>. Stop the server with `Ctrl+C`.

If another app already uses port 5173, set `DEV_PORT` in `.env` (for example `DEV_PORT=5180`) and open that port instead.

To run any other command, use `docker compose run --rm app <command>`, for example `docker compose run --rm app npm run test`.

### Scripts

| Command                | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the dev server on port 5173       |
| `npm run build`        | Type-check and build to `dist/`         |
| `npm run preview`      | Serve the production build on port 4173 |
| `npm run test`         | Run the Vitest tests once               |
| `npm run test:watch`   | Run the tests again on every change     |
| `npm run type-check`   | Check TypeScript types                  |
| `npm run lint`         | Run ESLint                              |
| `npm run lint:fix`     | Run ESLint and fix what it can          |
| `npm run format`       | Format all files with Prettier          |
| `npm run format:check` | Check formatting without changing files |

## Environment variables

Configuration is read from environment variables. `.env.example` lists every variable and is checked into the repository. Your own `.env` is git-ignored and must never be committed.

| Variable             | Purpose                                                     |
| -------------------- | ----------------------------------------------------------- |
| `VITE_CONTACT_EMAIL` | Address the contact form sends its email to                 |
| `DEV_PORT`           | Port on your computer for the dev server (default 5173)     |
| `PREVIEW_PORT`       | Port on your computer for the preview server (default 4173) |

`DEV_PORT` and `PREVIEW_PORT` are only read by docker compose, not by the website.

Any variable that starts with `VITE_` ends up in the public JavaScript bundle. Never put secrets in one.

## Folder structure

```
.
├── .devcontainer/
│   └── devcontainer.json      # VS Code DevContainer config
├── docs/                      # Project documentation
├── public/                    # Static files copied as-is (favicon, images)
├── src/
│   ├── assets/                # Images processed by Vite
│   ├── components/
│   │   ├── sections/          # One component per page section
│   │   └── ui/                # Small reusable pieces (buttons, cards…)
│   ├── content/               # Site text and data (products, roadmap, team)
│   ├── utils/                 # Plain TypeScript helpers (contact form rules)
│   ├── App.vue                # Page layout: puts the sections in order
│   ├── env.d.ts               # Types for environment variables
│   ├── main.ts                # App entry point
│   └── style.css              # Tailwind entry point
├── tests/                     # Vitest tests (*.spec.ts)
├── .env.example               # Environment variables (no real values)
├── docker-compose.yml         # Dev container service "app"
├── Dockerfile                 # Dev image (Node.js 24)
├── index.html
├── vercel.json                # Vercel build settings and SPA fallback
├── vite.config.ts
├── vitest.config.ts
├── tsconfig*.json             # TypeScript configs (app, node, vitest)
├── eslint.config.js
├── .prettierrc.json
├── CLAUDE.md                  # Guidance for Claude Code
└── README.md
```

## Deployment

Vercel builds the site with `npm run build` and serves the static files from `dist/`. In `vercel.json`, a rewrite sends every route to `index.html` (SPA fallback). Set the environment variables in the Vercel project settings.

## Contributing

- `main` is production and `develop` is integration.
- Create each feature in a `feature/<name>` branch from `develop`.
- Once a feature is validated, merge it into `develop` with `git merge --no-ff feature/<name>` and push `develop`. No pull request is needed.
- Never commit directly to `main`.
- Write commit messages in the [Conventional Commits](https://www.conventionalcommits.org/) format (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).
