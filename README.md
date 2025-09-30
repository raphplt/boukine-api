# 📚 Boukine API

API backend du projet **Boukine**, une application mobile de lecture et de gestion de livres (scan, recherche, informations, etc.).
Cette API est construite avec **NestJS**, **TypeORM** et **PostgreSQL**, et expose des endpoints REST et GraphQL pour la gestion des entités principales.

---

## ⚙️ Stack technique

- **Framework** : [NestJS](https://nestjs.com/)
- **ORM** : TypeORM (PostgreSQL)
- **Langage** : TypeScript (ES2021)
- **Architecture** : modulaire, inspirée DDD
- **Tests** : Jest (unitaires + e2e)
- **Conteneurisation** : Docker / Docker Compose
- **CI/CD** : GitHub Actions (build, test, migrations)

---

## 📄 Documentation

- [Guide d'authentification](README_AUTH.md)

---

## 🛠️ Configuration

Variables principales (voir `.env.example`) :

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `NODE_ENV`, `PORT`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL`
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`, `REDIS_URL`

---

## 🗄️ Base de données (PostgreSQL)

### Principales entités
- **users**
  - `id`, `email`, `passwordHash`, `displayName`, `avatarUrl`, `locale`, `privacyLevel`
  - relations avec `sessions`, `collections`, `reviews`, etc.
- **sessions**
  - `id`, `user_id`, `device_id`, `refresh_token_hash`, `ip`, `user_agent`, `last_used_at`, `expires_at`, `revoked_at`, `rotated_from_session_id`
  - index sur `user_id`, `(device_id, user_id)` et `expires_at`
- **books / collections / reviews**
  - structure classique (voir modules correspondants)

---

## 🔑 Authentification & Sécurité

- JWT access & refresh tokens, avec rotation et détection de réutilisation
- Sessions par appareil (deviceId) avec hash Argon2id côté serveur
- Rate limiting sur `/auth/login` et `/auth/refresh`
- Pipe global de validation (`class-validator` + `class-transformer`)
- Mutex en mémoire ou Redis pour protéger les rafraîchissements concurrents
- Logs structurés sur les événements sensibles (login, refresh, logout)

---

## 📑 Endpoints REST (exemples)

- `POST /auth/register` → créer un utilisateur
- `POST /auth/login` → s'authentifier et créer une session
- `POST /auth/refresh` → rafraîchir les tokens (rotation)
- `POST /auth/logout` → révoquer la session courante
- `GET /auth/sessions` → consulter les sessions actives
- `DELETE /auth/sessions/:id` → révoquer une session spécifique
- `GET /users/me` → profil de l'utilisateur authentifié
- Endpoints métiers : `GET /books`, `POST /collections`, `POST /reviews`, etc.

---

## 🔄 GraphQL (optionnel)

Schéma (`schema.gql`) exposant les mêmes ressources que les endpoints REST :
- Queries : `books`, `book(id)`, `collections`, `reviews`
- Mutations : `addBook`, `addReview`, `createCollection`, `login`, `register`

---

## 📂 Structure du projet

```
src/
├── auth/                # Module d'authentification (controllers, services, strategies)
├── users/               # Module utilisateurs (controller REST + resolver GraphQL)
├── common/              # Décorateurs, types partagés
├── migrations/          # Migrations TypeORM
├── ...                  # Modules métiers (books, collections, reviews, etc.)
├── app.module.ts        # Module racine
└── main.ts              # Bootstrap NestJS
```

---

## 🚀 Commandes utiles

- **Développement** : `npm run start:dev`
- **Build** : `npm run build`
- **Tests unitaires** : `npm test`
- **Tests e2e** : `npm run test:e2e`
- **Migrations** :
  - `npm run migration:run`
  - `npm run migration:generate -- src/migrations/MyMigration`

---

## 📌 Notes

- L’API se veut modulaire et extensible (ajouts futurs : OCR, import externes, etc.).
- Les agents IA peuvent s’appuyer sur ce README et sur `README_AUTH.md` comme références techniques pour générer ou corriger du code.
