# Doedongyeojido (돼동여지도)

This repository contains an MVP scaffold for **Doedongyeojido**, a location-based YouTube restaurant curation app.

## Structure

- `frontend/` – Next.js + TypeScript app with Tailwind CSS and basic PWA setup.
- `server/` – Express + TypeScript API server connecting to MongoDB.
- `crawler/` – Placeholder for future CLI scripts (e.g. `yt-dlp`) to populate the database.

Each directory has its own `package.json` and can be developed independently using the root workspace.

## Development

```bash
# Install dependencies for all workspaces
npm install

# Run Next.js frontend
cd frontend && npm run dev

# Run Express backend
cd ../server && npm run dev
```

The crawler scripts will run separately as a CLI when implemented.

