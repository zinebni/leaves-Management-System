# Docker Setup for Leaves Management System

This document explains how to run the application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

## Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example ./server/.env
   ```

2. Edit `./server/.env` with your actual values.

---

## Development Mode (Hot Reload)

In development, only MongoDB runs in Docker while frontend/backend run locally with hot-reload.

### Start MongoDB:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Run backend locally:
```bash
cd server
npm install
npm run server   # Uses nodemon for hot-reload
```

### Run frontend locally:
```bash
cd frontend
npm install
npm run dev      # Vite dev server at http://localhost:5173
```

### Stop MongoDB:
```bash
docker-compose -f docker-compose.dev.yml down
```

---

## Production Mode (Full Docker Stack)

All services run in Docker containers.

### Build and Start:
```bash
docker-compose up -d --build
```

### Access the Application:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api/

### View Logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop Services:
```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ Deletes Data):
```bash
docker-compose down -v
```

---

## Using MongoDB Atlas (Cloud)

To use MongoDB Atlas instead of local MongoDB:

1. Edit `./server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/gestion-conge
   ```

2. In `docker-compose.yml`, comment out or remove the `mongodb` service and update `server`:
   ```yaml
   server:
     # Remove this line:
     # depends_on:
     #   mongodb:
     #     condition: service_healthy
     environment:
       # Remove this override to use .env value:
       # - MONGODB_URI=mongodb://mongodb:27017/gestion-conge
       - NODE_ENV=production
   ```

3. Rebuild and start:
   ```bash
   docker-compose up -d --build
   ```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `docker-compose ps` | List running containers |
| `docker-compose restart server` | Restart backend |
| `docker-compose exec server sh` | Shell into server container |
| `docker-compose exec mongodb mongosh` | MongoDB shell |
| `docker system prune -a` | Clean up unused images |

---

## Ports Reference

| Service | Container Port | Host Port |
|---------|---------------|-----------|
| Frontend (nginx) | 80 | 8080 |
| Backend (internal) | 4000 | - |
| MongoDB (dev only) | 27017 | 27017 |

---

## Troubleshooting

### Container won't start
```bash
docker-compose logs <service-name>
```

### MongoDB connection issues
- Ensure MongoDB is healthy: `docker-compose ps`
- Check if using correct URI in `.env`

### Frontend not loading API
- Check nginx logs: `docker-compose logs frontend`
- Verify backend is healthy: `docker-compose ps`

---

## Notes

- **Backend script**: Uses `npm start` (runs `node server.js`). For development with nodemon, run locally with `npm run server`.
- **Uploads**: Server uploads are persisted in a Docker volume (`leaves-server-uploads`).
- **CORS**: In production, CORS origin should be updated in `server/server.js` to match your domain.

