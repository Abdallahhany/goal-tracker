# Goal Tracker Backend

## Running with Docker

This project is configured to run using Docker and Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### Getting Started

1. Clone the repository
2. Navigate to the backend directory
3. Run the following command to start the backend and database:

```bash
docker-compose up
```

This will:
- Build the NestJS backend
- Start a PostgreSQL database
- Connect them together
- Expose the API on http://localhost:3000

For running in detached mode (in the background):

```bash
docker-compose up -d
```

### Stopping the Services

```bash
docker-compose down
```

To remove volumes as well:

```bash
docker-compose down -v
```

### Viewing Logs

```bash
docker-compose logs -f
```

For a specific service:

```bash
docker-compose logs -f backend
```

or 

```bash
docker-compose logs -f postgres
```

### Rebuilding

If you make changes to the code, you'll need to rebuild the Docker images:

```bash
docker-compose up --build
```

### Environment Variables

The environment variables are defined in the `.env` file. You can modify them as needed.

## Development

The Docker setup includes volume mounting for the source code, so changes you make to the code will be reflected in the container.
