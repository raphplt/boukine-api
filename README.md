# 📚 Boukine API

API backend du projet **Boukine**, une application mobile de lecture et de gestion de livres (scan, recherche, informations, etc.).
Cette API est construite avec **NestJS**, **TypeORM** et **PostgreSQL**, et expose des endpoints REST et/ou GraphQL pour la gestion des entités principales.

---

## ⚙️ Stack technique

- **Framework** : [NestJS](https://nestjs.com/)
- **ORM** : TypeORM
- **Base de données** : PostgreSQL
- **Langage** : TypeScript (ES2021)
- **Architecture** : modulaire, DDD (Domain Driven Design) inspirée
- **Tests** : Jest
- **Conteneurisation** : Docker / Docker Compose
- **CI/CD** : GitHub Actions (build, test, migrations)

---

## 🗄️ Base de données (PostgreSQL)

### Principales entités
- **users**
  - id, email, password (hash), username
  - relations avec `sessions`, `reviews`, `collections`
- **books**
  - id, isbn, title, author, publisher, published_date, cover_url
  - possibilité d’importer via API externes (Google Books, OpenLibrary)
- **collections**
  - id, name, description
  - relation N-N avec `books`
- **reviews**
  - id, user_id, book_id, rating, comment, created_at
- **sessions**
  - id, user_id, refresh_token, expires_at

---

## 🔑 Authentification & Sécurité

- JWT (access + refresh tokens)
- Middleware de validation NestJS
- Rate limiting sur endpoints sensibles
- Hashage des mots de passe via bcrypt
- Gestion des rôles utilisateur (admin, user)

---

## 🌐 API Externe & Intégrations

- **Google Books API / OpenLibrary** : récupération des métadonnées livres (ISBN, titres, auteurs, couverture, etc.)
- **Vision/Camera** (front → API) : envoi d’image pour traitement OCR (futur module)
- **QR Code Scanner** : décodage ISBN et récupération automatique des infos livre

---

## 📑 Endpoints REST (exemples)

- `POST /auth/register` → création d’un utilisateur
- `POST /auth/login` → login et génération de tokens
- `GET /books?search=...` → recherche dans DB + fallback vers API externe
- `POST /books` → ajout manuel d’un livre
- `GET /books/:id` → infos détaillées d’un livre
- `POST /reviews` → ajouter un avis sur un livre
- `GET /collections/:id` → récupérer une collection et ses livres

---

## 🔄 GraphQL (optionnel)

Schéma unifié (`schema.gql`) exposant les mêmes ressources que les endpoints REST.
- Queries : `books`, `book(id)`, `collections`, `reviews`
- Mutations : `addBook`, `addReview`, `createCollection`, `login`, `register`

---

## 📂 Structure du projet

/src
├── auth/ # Modules d'authentification
├── users/ # Gestion des utilisateurs
├── books/ # Gestion des livres
├── collections/ # Collections personnalisées
├── reviews/ # Avis et notations
├── common/ # Utils, guards, interceptors
├── database/ # Config et migrations
└── main.ts # Point d’entrée de l’app NestJS


---

## 🚀 Attendus techniques

- [ ] CRUD complet sur toutes les entités
- [ ] Authentification sécurisée avec JWT + refresh token
- [ ] Middleware global de logging et validation
- [ ] Pagination, filtres et tri sur `/books` et `/reviews`
- [ ] Tests unitaires et e2e minimum viables
- [ ] Documentation auto (Swagger ou GraphQL Playground)
- [ ] Gestion robuste des migrations TypeORM
- [ ] Dockerfile + docker-compose.yml pour dev & prod
- [ ] Intégration API externe (Google Books / OpenLibrary) avec fallback local
- [ ] CI/CD : lint, test, build avant merge

---

## 📌 Notes

- L’API doit être **scalable** : endpoints simples mais extensibles.
- Prévoir une abstraction pour supporter plusieurs sources externes (Google Books, OpenLibrary).
- Les agents IA peuvent s’appuyer sur ce README comme **point de repère technique** pour générer ou corriger du code.
