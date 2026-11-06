# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

A one-page company website for **CelyMary Greener Precast Blocks**, an early-stage startup making precast blocks with a much lower carbon footprint than conventional concrete blocks.

- **Audience:** architects, engineers, builders, real estate developers, potential investors and collaboration partners.
- **Problem it solves:** these people have no single place to learn what the company offers and get in touch.

## Stack

- Vue 3 (Composition API) + TypeScript
- Vite
- Tailwind CSS
- Vitest for tests
- ESLint + Prettier
- DevContainer with Docker / docker compose
- Vercel: static build to `dist/`, configured in `vercel.json`. No SPA fallback: the site has one page and no router, so unknown paths return a 404

## Working rules

### Git workflow

- `main` is production and `develop` is integration.
- Each feature goes in a `feature/<name>` branch created from `develop`.
- After the user validates a feature, Claude merges it into `develop` with `git merge --no-ff feature/<name>`, then pushes `develop`. No pull request is needed.
- **Never commit directly to `main`.**
- Commit or push only when the user asks.

### Commits

- Use the Conventional Commits format: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- Example: `feat(products): add products section with planned range`.

### Development environment

- The development environment is a DevContainer. **All commands run through Docker**, never on the host.
- From the host, run commands as `docker compose run --rm app <command>`. In the DevContainer terminal, run them directly.
- The Vite dev server must listen on `0.0.0.0:5173` so the host can reach it.

### Secrets

- Never write secrets in the code. Use environment variables.
- `.env` is in `.gitignore`. `.env.example` is versioned and lists every variable with placeholder values only.
- Variables that start with `VITE_` are bundled into public client code. They must never hold secrets.

### Confidentiality (public repository)

- **Never describe the block materials, recipes, formulations or production process** anywhere: code, comments, docs, commit messages, PR descriptions, test fixtures or placeholder text.
- The website describes benefits only: **lower carbon**, **recycled industrial materials**, **local production**.
- If a request would reveal any of the above, stop and ask the user first.

### Honesty

- The company is early-stage. **Do not invent** statistics, carbon-saving figures, certifications, testimonials, customer names, partner logos or team members.
- Use only facts the user gives you. Where content is missing, use an obvious placeholder (for example `[TODO: team member name]`) and tell the user.
- Mark every product as _in development_.

## Conventions

- Components: `<script setup lang="ts">`, PascalCase file names, one component per page section in `src/components/sections/` (for example `HeroSection.vue`).
- Reusable small pieces go in `src/components/ui/`.
- Keep site text and data (products, roadmap, team) in typed files in `src/content/`, not hard-coded in templates. This makes the Spanish version (US-05) easier later.
- Style with Tailwind utility classes. Don't add UI libraries or other dependencies without asking.
- Mobile-first, responsive layout. Use semantic HTML and accessible markup: labelled form fields, alt text, keyboard navigation and enough color contrast.
- Tests: Vitest + Vue Test Utils, in `tests/`, named `<Component>.spec.ts`. Import app code through the `@/` alias (for example `@/App.vue`).
- Project documentation goes in `docs/`.
- Before a change is done, run all checks through Docker:
  ```bash
  docker compose run --rm app sh -c "npm run lint && npm run format:check && npm run test && npm run build"
  ```

## User stories

### MVP

- **US-01 — Hero and "Our solution":** headline, short value proposition, call to action to contact. "Our solution" covers lower carbon, recycled industrial materials and local production.
- **US-02 — Products:** the planned range: standard building blocks, solar panel ballast blocks, paving blocks, retaining wall and landscaping blocks, and kerbs and edging. Each is labelled **"in development"**. **No technical specs.**
- **US-03 — For customers / investors / partners:** what we offer each group, the company's current stage and roadmap, and the team.
- **US-04 — Contact form:** fields for name, email, visitor type, product of interest and message. On submit, it opens a pre-filled email (`mailto:`) to the address in `VITE_CONTACT_EMAIL`. No backend.

### Backlog

- **US-05 — Spanish version.**
- **US-06 — News and milestones.**
- **US-07 — Carbon savings calculator.** Do not build it without real, user-provided figures (see Honesty).
