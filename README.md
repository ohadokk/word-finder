# Infra Assignment – Article & Comment Platform

## Overview

This project is a microservices-based article and comment platform built with [NestJS](https://nestjs.com/), PostgreSQL, and Redis. It consists of two main services:

- **API Service** (`api/`): Handles HTTP requests for users, articles, and comments.
- **Worker Service** (`worker/`): Processes articles asynchronously (e.g., computes word offsets and frequencies) via Redis events.

## Project Structure

```plaintext
.
├── .env
├── .gitignore
├── docker-compose.yml
├── api/
│   ├── Dockerfile
│   ├── jest.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.module.ts
│       ├── main.ts
│       ├── redis.service.ts
│       ├── controllers/
│       ├── dto/
│       ├── entities/
│       ├── modules/
│       ├── repositories/
│       └── services/
└── worker/
    ├── Dockerfile
    ├── jest.config.ts
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── app.module.ts
        ├── main.ts
        ├── article-processor.controller.ts
        ├── article-processor.service.ts
        └── entities/
```

### API Service (`api/`)

- **Controllers**: Handle HTTP endpoints for users, articles, and comments.
- **Services**: Business logic for each resource.
- **Repositories**: Custom database queries, especially for articles (`ArticleRepository`).
- **Entities**: TypeORM models for `User`, `Article`, and `Comment`.
- **DTOs**: Data Transfer Objects for request/response validation and typing.
- **Redis Integration**: Publishes events (e.g., `article_created`) to Redis for asynchronous processing (`RedisService`).

### Worker Service (`worker/`)

- **ArticleProcessorController**: Listens for Redis events (e.g., `article_created`).
- **ArticleProcessorService**: Processes article bodies to compute word offsets and frequencies.
- **Entities**: Minimal `Article` entity for processing.

## Architecture

- **Database**: PostgreSQL, managed via TypeORM.
- **Event-Driven Processing**: When an article is created, the API service emits an event to Redis. The worker service listens for this event and processes the article asynchronously.
- **Microservices**: API and worker are separate NestJS applications, communicating via Redis.
- **Dockerized**: All services (API, worker, Redis, PostgreSQL) are orchestrated with Docker Compose.

## Running the Project

1. **Configure Environment**: Edit `.env` as needed.
2. **Start Services**:  

   ```sh
   docker-compose up --build
   ```

   This will start the API, worker, Redis, and PostgreSQL containers.

3. **API Endpoints**:  

   ```http
   # Users
   POST /users
   GET /users/:id

   # Articles
   POST /articles
   GET /articles/:id
   POST /articles/search
   GET /articles/search/most-common

   # Comments
   POST /comments
   GET /comments/:id
   GET /comments/article/:articleId
   ```

## Testing

- Each service includes unit tests using Jest.
- Run tests inside each service directory:

  ```sh
  npm run test
  ```

## Key Files

- `api/src/app.module.ts`: Main module for the API service.
- `api/src/repositories/article.repository.ts`: Custom queries for articles.
- `api/src/redis.service.ts`: Redis event publisher.
- `worker/src/app.module.ts`: Main module for the worker service.
- `worker/src/article-processor.service.ts`: Article processing logic.

---

**Note:**

- The API and worker communicate via Redis events.
- Article processing (word offsets, frequencies) is handled asynchronously by the worker.
