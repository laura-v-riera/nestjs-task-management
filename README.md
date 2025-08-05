# NestJS Task Management API

A task management REST API built following the **"NestJS Zero to Hero - Modern TypeScript Back-end Development"** course.

## Live Demo

The API is deployed and available at: **https://ec2-13-51-72-235.eu-north-1.compute.amazonaws.com/**

## Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── user/               # User entity and decorators
│   ├── dto/                # Auth DTOs
│   └── jwt/                # JWT Passport strategy
│   ├── auth.controller.ts  # Authentication endpoints
│   ├── auth.service.ts     # Authentication business logic
│   ├── auth.module.ts      # Auth module configuration
├── tasks/                  # Tasks module
│   ├── dto/                # Task DTOs
│   ├── task.entity.ts      # Task entity with user relationship
│   ├── tasks.controller.ts # Task endpoints with logging
│   ├── tasks.service.ts    # Task business logic
│   ├── tasks.repository.ts # Task database operations
│   └── tasks.module.ts     # Tasks module configuration
├── config.schema.ts        # Environment variables validation schema
├── app.module.ts           # Root application module
└── main.ts                 # Application entry point
```

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **CI/CD**: GitHub Actions
- **Containerization**: Docker & Docker Compose

## Features

- **Task Management**: Create, read, update, and delete tasks
- **User Authentication**: JWT-based authentication and authorization
- **Task Filtering**: Filter tasks by status and search terms
- **Data Validation**: Input validation using class-validator
- **Database Integration**: PostgreSQL with TypeORM
- **Security**: Password hashing, JWT tokens, and request validation
- **Logging**: Built-in request and action logging
- **Testing**: Unit and integration tests
- **CI/CD**: Automated testing with GitHub Actions
- **Containerized**: Docker and Docker Compose setup with Makefile commands

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Make (optional, for convenience commands)

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/laura-v-riera/nestjs-task-management.git
cd nestjs-task-management
```

2. Start the development environment:
```bash
make dev
```

The API will be available at `http://localhost:3000`

## Make Commands

The project includes a Makefile for convenient Docker operations:

```bash
# Build all images
make build

# Start development environment (app + database)
make dev

# Stop development environment
make stop

# Clean up containers, networks, and volumes
make clean

# Build and run production image
make prod
```

## API Endpoints

All task endpoints require authentication via JWT token. Include the token in the Authorization header: `Bearer <token>`

### Authentication
- `POST /auth/signup` - Create a new user account
- `POST /auth/signin` - Sign in and get JWT token

### Tasks
- `GET /tasks` - Get all user's tasks (with optional filtering)
  - Query parameters: `status` (OPEN, IN_PROGRESS, DONE), `search`
- `GET /tasks/:id` - Get a specific task by ID
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id/status` - Update task status
- `DELETE /tasks/:id` - Delete a task

## Testing

It includes unit tests for tasks and auth services.

```bash
# Run unit tests
yarn test

# Run tests in Docker container
docker-compose exec app yarn test
```

Tests are automatically run on every push and pull request via GitHub Actions.