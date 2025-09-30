# Authentication Guide

## Overview
This document describes the authentication system implemented for the Boukine API. It provides JWT access and refresh tokens with rotation, refresh-token reuse detection, and per-device sessions backed by hashed refresh tokens.

## Environment Variables
Set the following variables (see `.env.example`):

- `JWT_ACCESS_SECRET` – required, secret used to sign access tokens
- `JWT_REFRESH_SECRET` – required, secret used to sign refresh tokens
- `JWT_ACCESS_TTL` – string duration (default `10m`)
- `JWT_REFRESH_TTL` – string duration (default `21d`)
- `RATE_LIMIT_WINDOW_MS` – rate limiting window in ms (default `60000`)
- `RATE_LIMIT_MAX` – requests per window (default `60`)
- `REDIS_URL` – optional; enables Redis-backed mutex & rate-limit store

## Entities
- `User` – stores user profile and `passwordHash`
- `Session` – per-device refresh session with hashed token, metadata, and rotation chain (`rotatedFromSessionId`)

## Token Model
- Access token payload: `{ sub, sid }`, short lived for API access
- Refresh token payload: `{ sub, jti }`, used to rotate sessions
- Refresh tokens are hashed (argon2id) before persisting
- Token reuse (mismatched hash) revokes the session and denies refresh

## HTTP Endpoints
| Method | Path | Description |
| ------ | ---- | ----------- |
| `POST` | `/auth/register` | Create a user account |
| `POST` | `/auth/login` | Email/password login, create session |
| `POST` | `/auth/refresh` | Rotate refresh token, issue new access token |
| `POST` | `/auth/logout` | Revoke current device session |
| `GET` | `/auth/sessions` | List user sessions |
| `DELETE` | `/auth/sessions/:id` | Revoke a specific session |
| `GET` | `/users/me` | Return authenticated user profile |

## Example Flow
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"P@ssw0rd!"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"P@ssw0rd!","deviceId":"device-1"}'
```
Use the returned tokens:
```bash
# Protected route
token="<accessToken>"
curl http://localhost:3000/users/me -H "Authorization: Bearer $token"

# Refresh
curl -X POST http://localhost:3000/auth/refresh \
  -H 'Content-Type: application/json' \
  -d '{"refreshToken":"<refreshToken>","deviceId":"device-1"}'
```

## Security Notes
- Refresh tokens are never stored in plain text; reuse triggers revocation
- Each device has an isolated session; revoking one does not affect others
- Optional Redis lock prevents concurrent refresh collisions
- Rate limiting protects `/auth/login` and `/auth/refresh`

## Migrations & Scripts
Run migrations with:
```bash
npm run migration:run
```
Generate new migrations:
```bash
npm run migration:generate -- src/migrations/NewMigrationName
```

## Testing
- Unit tests: `npm test`
- e2e tests: `npm run test:e2e`

## Rollback
- Revert the migration `SessionTable1704000000000`
- Remove the Auth module additions and dependencies
