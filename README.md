# DefLink - Defense Industry Connector

[cloudflarebutton]

## Overview

DefLink is a minimalist, secure, and robust web platform designed to bridge the gap between Original Equipment Manufacturers (OEMs) in the defense sector and specialized Service Providers. The application operates in German and features two distinct workflows:

1. **OEM Portal (Protected):** Restricted area accessible via a shared system-wide password. OEMs post needs (services, specialists, projects) and view all requests.
2. **Provider Hub (Public):** Open directory for Service Providers to submit profiles with expertise details (Software, Hardware, AI, etc.), logos, and contacts.

No algorithmic matching or internal messaging—connections occur offline via contact details. Includes lightweight Admin Dashboard for moderation and password management.

**Tagline:** A streamlined, professional B2B platform connecting Defense OEMs with Service Providers through a password-protected request board and a public provider directory.

## Key Features

- **Split Landing Page:** OEM login (left, dark) vs. Provider directory (right, light).
- **OEM Workflow:** Password-protected form for needs submission + sortable list of all requests.
- **Provider Workflow:** Public profile submission form + filterable grid of approved profiles (with logos, categories, contacts).
- **Admin Dashboard:** Moderate entries, approve providers, edit/delete, manage OEM password.
- **German UI:** All text localized to German for target audience.
- **Responsive Design:** Mobile-first, flawless across devices.
- **Data Persistence:** Cloudflare Durable Objects with IndexedEntity pattern for OEM requests and provider profiles.
- **Security:** Shared OEM password (hashed), basic form validation, no complex auth.
- **Views:** Landing, OEM Login/Dashboard, Provider Directory/Registration, Admin.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS 3, shadcn/ui, React Router 6, Framer Motion, Lucide React, React Hook Form, Zod, TanStack Query, Sonner (toasts).
- **Backend:** Hono 4, Cloudflare Workers, Global Durable Object (via core-utils library).
- **Data Layer:** Custom IndexedEntity for CRUD + indexing (lists, pagination).
- **Styling:** Tailwind v3-safe utilities, shadcn/ui primitives, custom animations.
- **Deployment:** Cloudflare Workers/Pages, Wrangler CLI.
- **Dev Tools:** Bun, ESLint, TypeScript.

## Prerequisites

- [Bun](https://bun.sh/) (package manager & runtime)
- [Cloudflare Account](https://dash.cloudflare.com/) (free tier sufficient)
- Node.js (optional, Bun handles everything)

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
bun install
```

## Development

1. Start the development server (proxies API to Worker):

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `${PORT:-3000}`).

2. In a new terminal, generate TypeScript types from Worker:

```bash
bun run cf-typegen
```

3. Lint code:

```bash
bun run lint
```

## Usage

### Core Routes (React Router)

- `/` - Landing Page (split OEM/Provider entry points)
- `/oem-login` - OEM Password Entry
- `/oem-dashboard` - OEM Requests List + Form
- `/provider-directory` - Public Provider Grid
- `/provider-register` - Provider Profile Form
- `/admin` - Admin Moderation Dashboard

### API Endpoints (via `/api/*`)

Extend `worker/user-routes.ts` using Entities:
- `POST /api/oem-requests` - Create OEM request
- `GET /api/oem-requests` - List requests (paginated)
- `POST /api/providers` - Create provider profile
- `GET /api/providers` - List providers
- Custom: OEM password check, admin ops.

Frontend uses `src/lib/api-client.ts` for type-safe fetches.

### Customization

- **Entities:** Extend `worker/entities.ts` (e.g., `OemRequestEntity`, `ProviderEntity`).
- **Routes:** Add to `worker/user-routes.ts`.
- **UI:** Replace `src/pages/HomePage.tsx`; add routes in `src/main.tsx`.
- **Seeds:** Use `static seedData` in Entities.
- **Types:** Shared via `shared/types.ts`.

All UI in **German** (labels, placeholders, errors).

## Building

```bash
bun run build
```

Outputs static assets for Cloudflare Pages deployment.

## Deployment

Deploy full-stack app (Worker + Assets) to Cloudflare Edge:

```bash
bun run deploy
```

- Automatically builds frontend, bundles Worker.
- Deploys via Wrangler (uses `wrangler.jsonc`).
- Assets served from Pages, API via Worker.
- Durable Object state persists automatically.

For production:
- Set custom domain in Cloudflare Dashboard.
- Monitor via Cloudflare Observability.

[cloudflarebutton]

## Local Worker Testing

```bash
wrangler dev worker/index.ts --remote
```

## Architecture Notes

- **Single DO:** All data in `GlobalDurableObject` via `core-utils.ts` (Entities handle partitioning/indexing).
- **No External DB:** Pure edge-persistent storage.
- **Type-Safe:** Shared types, Zod validation.
- **Constraints:** No new bindings/DOs; use provided patterns.

## Troubleshooting

- **Infinite Loops:** Follow React/Zustand rules in prompt.
- **Types:** Run `bun run cf-typegen`.
- **CORS/Proxy:** Dev server handles `/api/*`.
- **Persistence:** DO state global per deployment.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contributing

1. Fork & PR.
2. Follow shadcn/ui + Tailwind standards.
3. Update tests/docs.

Built with ❤️ by Cloudflare Workers team. Questions? Open an issue.