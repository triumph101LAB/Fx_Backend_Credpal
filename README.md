# FX Trading App — Backend

A production-ready backend system for an FX trading application built with NestJS, PostgreSQL, Redis, and TypeORM. Users can register, verify their email, fund a multi-currency wallet, and trade or convert currencies using real-time FX rates.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Architectural Decisions](#architectural-decisions)
- [Key Assumptions](#key-assumptions)
- [Scalability Considerations](#scalability-considerations)

---

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Cache:** Redis (ioredis)
- **Auth:** JWT + Passport
- **Email:** Nodemailer (Gmail SMTP) + BullMQ async queue
- **Docs:** Swagger UI
- **Validation:** class-validator + class-transformer

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- Redis v5+
- NestJS CLI (`npm install -g @nestjs/cli`)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/fx-trading-app.git
cd fx-trading-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create the database
```bash
psql -U postgres -c "CREATE DATABASE fx_trading;"
```

### 4. Configure environment variables
```bash
cp .env.example .env
```
Fill in your values in `.env` (see Environment Variables section below).

### 5. Start Redis
```bash
redis-server
```

### 6. Start the application
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 7. Access Swagger docs
```
http://localhost:3000/api/docs
```

---

## Environment Variables

Create a `.env` file in the project root:
```env
# App
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=fx_trading

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Mail (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_gmail@gmail.com
MAIL_PASS=your_16char_app_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# FX API
FX_API_KEY=your_exchangerate_api_key
FX_API_URL=https://v6.exchangerate-api.com/v6
FX_CACHE_TTL=300
```

> For Gmail, generate an App Password at myaccount.google.com/apppasswords (requires 2FA enabled).
> For the FX API key, sign up free at exchangerate-api.com.

---

## API Documentation

Full interactive documentation is available at `http://localhost:3000/api/docs` via Swagger UI.

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | No | Register user and send OTP email |
| POST | /auth/verify | No | Verify OTP and receive JWT token |
| POST | /auth/login | No | Login and receive JWT token |
| POST | /auth/resend-otp | No | Resend OTP if expired or not received |

### Wallet Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /wallet | JWT | Get all currency balances |
| POST | /wallet/fund | JWT | Fund wallet in any supported currency |
| POST | /wallet/convert | JWT | Convert between currencies |
| POST | /wallet/trade | JWT | Trade NGN against foreign currencies |

### FX Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /fx/rates | JWT | Get real-time FX rates (base defaults to NGN) |

### Transactions Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /transactions | JWT | Paginated transaction history |

### Example Requests

**Register**
```json
POST /auth/register
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

**Verify OTP**
```json
POST /auth/verify
{
  "email": "user@example.com",
  "otp": "482910"
}
```

**Fund Wallet**
```json
POST /wallet/fund
Authorization: Bearer <token>
{
  "amount": 100000,
  "currency": "NGN"
}
```

**Convert Currency**
```json
POST /wallet/convert
Authorization: Bearer <token>
{
  "fromCurrency": "NGN",
  "toCurrency": "USD",
  "amount": 50000
}
```

**Trade**
```json
POST /wallet/trade
Authorization: Bearer <token>
{
  "fromCurrency": "USD",
  "toCurrency": "NGN",
  "amount": 100
}
```

**Get Transaction History**
```
GET /transactions?page=1&limit=20
Authorization: Bearer <token>
```

---

## Architectural Decisions

### 1. Multi-currency wallet design
Each user has one row per currency in the `wallet_balances` table, enforced by a composite unique constraint on `(userId, currency)`. This is cleaner and more queryable than storing balances as JSON in a single column. New currency rows are created lazily on first conversion — no pre-seeding required.

### 2. Atomic transactions with pessimistic locking
All wallet operations use TypeORM's `QueryRunner` to wrap balance updates and transaction record creation in a single atomic database transaction. Pessimistic write locks (`SELECT FOR UPDATE`) prevent race conditions when concurrent requests hit the same wallet simultaneously.

### 3. Three-layer FX rate fetching
```
Redis cache (5 min TTL) → External API → PostgreSQL fallback
```
This ensures the app remains functional even when the external FX API is unavailable, using the last known rate from the database as a fallback.

### 4. Idempotency with reference keys
Every fund, convert and trade operation accepts an optional `reference` field. If a transaction with that reference already succeeded, the same response is returned without reprocessing. This prevents duplicate transactions caused by network retries.

### 5. Async email with BullMQ
OTP emails are pushed to a Redis-backed BullMQ queue instead of being sent synchronously. This means the register endpoint returns instantly regardless of email server speed. The queue worker handles retries automatically (3 attempts, 5 second backoff).

### 6. Balance arithmetic in PostgreSQL
Balance updates use PostgreSQL arithmetic expressions (`CAST(balance AS DECIMAL) + amount`) instead of read-modify-write in JavaScript. This eliminates floating point precision errors and reduces the risk of stale data under concurrent load.

---

## Key Assumptions

1. **NGN is the primary funding currency** — users fund their wallets in NGN by default, though any supported currency can be funded directly.
2. **FX rates are directional** — the rate for NGN→USD is fetched independently from USD→NGN. Both use real-time data from exchangerate-api.com.
3. **No transaction fees** — conversion rates are applied as-is with no platform fee. This can be added by applying a configurable multiplier to the rate.
4. **OTPs expire in 10 minutes** — this is a reasonable balance between security and user convenience. The resend endpoint handles expired OTPs.
5. **Supported currencies are fixed** — the currency enum (NGN, USD, EUR, GBP, CAD, JPY) can be extended by adding values to the enum without any schema changes.
6. **`synchronize: true` is for development only** — in production this would be replaced with TypeORM migrations to prevent accidental schema changes.
7. **Single region deployment assumed** — the current architecture assumes one PostgreSQL primary. A production deployment would add read replicas.

---

## Scalability Considerations

### What is already implemented

| Feature | Implementation | Impact |
|---------|---------------|--------|
| Redis caching | FX rates cached for 5 minutes | Reduces external API calls from millions to ~288/day |
| Pessimistic locking | SELECT FOR UPDATE on balance rows | Safe under any level of concurrent traffic |
| Database indexes | userId, createdAt, reference indexed | Query time stays milliseconds regardless of table size |
| Connection pooling | Max 20 PostgreSQL connections | Handles thousands of simultaneous requests efficiently |
| Rate limiting | 100 req/min per IP globally | Prevents abuse and DDoS |
| Async email queue | BullMQ + Redis | Register endpoint is non-blocking at any scale |
| Pagination cap | Max 100 records per page | Prevents memory exhaustion from large result sets |
| Atomic operations | QueryRunner transactions | Data consistency guaranteed under concurrent load |
| Idempotency | Reference key deduplication | Prevents duplicate transactions from retries |

### What to add for production at millions of users

- **Read replicas** — route all read queries (getBalances, getHistory, getRates) to PostgreSQL read replicas, writes go to primary only
- **Horizontal scaling** — run multiple NestJS instances behind an Nginx load balancer. The app is fully stateless so any instance can handle any request
- **Database migrations** — replace `synchronize: true` with TypeORM migrations for safe schema changes in production
- **Dedicated monitoring** — add Datadog or New Relic for request tracing, slow query detection, and alerting
- **Scheduled FX rate refresh** — replace on-demand fetching with a cron job that pre-fetches and warms the Redis cache every 5 minutes
- **Message broker** — replace BullMQ with Apache Kafka for event streaming at very high volumes

---

## Running Tests
```bash
# Unit tests
npm run test

# End to end tests
npm run test:e2e

# Coverage
npm run test:cov
```

---
