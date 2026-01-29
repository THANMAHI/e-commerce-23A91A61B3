# LuxeStore E-commerce Application

A modern, performant, and secure e-commerce application built with Next.js, Prisma, and NextAuth.js.

## Features

- **Server-Side Rendering (SSR)**: SEO-friendly product listings and details.
- **Authentication**: Secure user login with NextAuth.js (GitHub/Google).
- **Cart Management**: Add, remove, and update items in the cart.
- **Search & Filter**: Real-time server-side search functionality.
- **Dockerized**: Easy deployment with Docker Compose.
- **Premium UI**: Responsive design with Tailwind CSS.

## Prerequisites

- Docker & Docker Compose
- Node.js (v16+) - *Optional, for local dev without Docker*

## Setup Instructions

### 1. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```
Fill in the required values in `.env`:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `GITHUB_ID` & `GITHUB_SECRET`: From your GitHub OAuth App settings.
- `NEXTAUTH_SECRET`: Generate one with `openssl rand -base64 32`.

### 2. Run with Docker (Recommended)

Start the application and database:
```bash
docker-compose up --build
```
This command will:
- Start PostgreSQL.
- Seed the database with initial products.
- Build and start the Next.js app on `http://localhost:3000`.

### 3. Local Development (Manual)

If you prefer running without Docker:
```bash
# Install dependencies
npm install

# Initialize database
npx prisma generate
npx prisma db push
node prisma/seed.js

# Start dev server
npm run dev
```

## Testing

The application is instrumented with `data-testid` attributes for automated testing.
Check `submission.json` for the test user credentials.

## API Endpoints

- `GET /api/cart`: Get cart items.
- `POST /api/cart`: Add item to cart.
- `PUT /api/cart`: Update item quantity.
- `DELETE /api/cart`: Remove item from cart.
