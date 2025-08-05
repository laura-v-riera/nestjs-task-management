# Variables
IMAGE_NAME=nestjs-app
CONTAINER_NAME=nestjs-dev
COMPOSE_FILE=docker-compose.yml

# Build images (dev and db via Compose)
build:
	docker-compose -f $(COMPOSE_FILE) build

# Run for production (without Compose)
prod:
	docker build -f Dockerfile.prod -t $(IMAGE_NAME):latest .
	docker run -d --env-file .env.stage.prod --name $(IMAGE_NAME)-prod -p 80:3000 $(IMAGE_NAME):latest

# Start dev environment using Docker Compose
dev:
	docker-compose -f $(COMPOSE_FILE) up

# Stop dev environment
stop:
	docker-compose -f $(COMPOSE_FILE) down

# Remove containers, networks, volumes
clean:
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans
