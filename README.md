# Cely Precast Greener Blocks — Website

A one-page website for **Cely Precast Greener Blocks**, an early-stage startup making precast blocks with a much lower carbon footprint than conventional concrete blocks.

The site gives architects, engineers, builders, real estate developers, investors and collaboration partners one place to see what the company offers and to get in touch.

> **Status:** setup in progress. The application code and the development environment below are planned and are not in the repository yet.

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
3. Open the folder in VS Code and choose **Dev Containers: Reopen in Container**.
4. In the container terminal:
   ```bash
   npm install
   npm run dev
   ```
5. Open <http://localhost:5173>.

### Option B: docker compose only

```bash
cp .env.example .env
docker compose run --rm app npm install
docker compose up
```

To run any other command, use `docker compose run --rm app <command>`.

### Scripts

| Command           | What it does                       |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the dev server on port 5173  |
| `npm run build`   | Type-check and build to `dist/`    |
| `npm run preview` | Serve the production build locally |
| `npm run test`    | Run the Vitest tests               |
| `npm run lint`    | Run ESLint                         |
| `npm run format`  | Format the code with Prettier      |

## Environment variables

Configuration is read from environment variables. `.env.example` lists every variable and is checked into the repository. Your own `.env` is git-ignored and must never be committed.

| Variable             | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `VITE_CONTACT_EMAIL` | Address the contact form sends its email to |

Any variable that starts with `VITE_` ends up in the public JavaScript bundle. Never put secrets in one.

## Folder structure (planned)

```
.
├── .devcontainer/
│   └── devcontainer.json      # VS Code DevContainer config
├── public/                    # Static files copied as-is (favicon, images)
├── src/
│   ├── assets/                # Images and styles processed by Vite
│   ├── components/
│   │   ├── sections/          # One component per page section
│   │   ├── ui/                # Small reusable pieces (buttons, cards…)
│   │   └── __tests__/         # Vitest component tests
│   ├── content/               # Site text and data (products, roadmap, team)
│   ├── App.vue                # Page layout: puts the sections in order
│   ├── main.ts                # App entry point
│   └── style.css              # Tailwind entry point
├── .env.example               # Environment variables (no real values)
├── docker-compose.yml
├── Dockerfile
├── index.html
├── vercel.json                # SPA fallback rewrite
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
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
