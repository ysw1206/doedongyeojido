# Doedongyeojido (돼동여지도)

This repository contains an MVP scaffold for **Doedongyeojido**, a location-based YouTube restaurant curation app.

## Structure

- `frontend/` – Next.js + TypeScript app with Tailwind CSS and basic PWA setup.
- `server/` – Express + TypeScript API server connecting to MongoDB.
- `crawler/` – Placeholder for future CLI scripts (e.g. `yt-dlp`) to populate the database.

Each directory has its own `package.json` and can be developed independently using the root workspace.

## Development

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for MongoDB)

### Quick Start

```bash
# Install dependencies for all workspaces
npm install

# Start MongoDB with Docker
docker-compose up -d

# Run Next.js frontend
cd frontend && npm run dev

# Run Express backend
cd ../server && npm run dev
```

### MongoDB Setup

The project uses Docker to run MongoDB locally:

```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# Check MongoDB status
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Stop MongoDB
docker-compose down
```

**MongoDB Access:**
- **Database**: `doedong`
- **Username**: `admin`
- **Password**: `password123`
- **Port**: `27017`
- **Mongo Express UI**: http://localhost:8081 (admin/password123)

### API Endpoints

- `GET /places` - Get all restaurants
- `GET /places/:id` - Get restaurant by ID
- `POST /places` - Create new restaurant

### Frontend Pages

- `http://localhost:3000/` - Home page
- `http://localhost:3000/places` - Restaurant list
- `http://localhost:3000/place/[id]` - Restaurant detail
- `http://localhost:3000/map` - Map view

The crawler scripts will run separately as a CLI when implemented.

