# Infra Assignment – Article & Comment Platform

## Overview

This project is a microservices-based article and comment platform built with [NestJS](https://nestjs.com/), PostgreSQL, and Redis. It consists of two main services:

- **API Service** (`api/`): Handles HTTP requests for users, articles, and comments.
- **Worker Service** (`worker/`): Processes articles asynchronously (e.g., computes word offsets and frequencies) via Redis events.

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

   > **You can find a ready-to-use Postman collection for all endpoints in [API.postman_collection.json](./API.postman_collection.json) at the project root.**

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
