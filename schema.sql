-- =========================================================
-- Boukine — Schéma PostgreSQL initial (corrigé)
-- =========================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS citext;

-- =========================
-- ENUMS (types métiers)
-- =========================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reading_status') THEN
    CREATE TYPE reading_status AS ENUM ('to_read','reading','paused','dropped','read');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'scan_type') THEN
    CREATE TYPE scan_type AS ENUM ('isbn','photo');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'scan_status') THEN
    CREATE TYPE scan_status AS ENUM ('pending','processing','completed','failed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'import_source') THEN
    CREATE TYPE import_source AS ENUM ('goodreads','csv');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'import_status') THEN
    CREATE TYPE import_status AS ENUM ('pending','processing','completed','failed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reaction_type') THEN
    CREATE TYPE reaction_type AS ENUM ('like','dislike');
  END IF;
END$$;

-- =========================
-- AUTH & COMPTES
-- =========================
CREATE TABLE IF NOT EXISTS app_user (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           CITEXT UNIQUE NOT NULL,
  email_verified  TIMESTAMPTZ,
  password_hash   TEXT,                              -- null si provider-only
  display_name    TEXT,
  avatar_url      TEXT,
  locale          TEXT DEFAULT 'fr',
  privacy_level   TEXT DEFAULT 'public',             -- public | friends | private
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_provider_account (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL,                     -- 'google' | 'apple' | ...
  provider_id     TEXT NOT NULL,                     -- sub/subject du provider
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_id)
);

CREATE TABLE IF NOT EXISTS user_session (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  refresh_token   TEXT NOT NULL,
  user_agent      TEXT,
  ip              INET,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_token (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  purpose         TEXT NOT NULL,                     -- 'verify_email' | 'reset_password'
  token           TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  consumed_at     TIMESTAMPTZ,
  UNIQUE (purpose, token)
);

CREATE TABLE IF NOT EXISTS user_follow (
  follower_id     UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  followee_id     UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (follower_id, followee_id),
  CHECK (follower_id <> followee_id)
);

-- =========================
-- LIVRES & MÉTADONNÉES
-- =========================
CREATE TABLE IF NOT EXISTS author (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  sort_key        TEXT,
  bio             TEXT,
  birth_year      INT,
  death_year      INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS author_name_trgm ON author USING GIN (name gin_trgm_ops);

CREATE TABLE IF NOT EXISTS publisher (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS series (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  UNIQUE (title)
);

CREATE TABLE IF NOT EXISTS book_work (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  subtitle        TEXT,
  description     TEXT,
  language        TEXT,                              -- ISO 639-1
  subjects        TEXT[],
  cover_image_url TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS book_work_title_trgm ON book_work USING GIN (title gin_trgm_ops);

CREATE TABLE IF NOT EXISTS book_work_author (
  work_id         UUID NOT NULL REFERENCES book_work(id) ON DELETE CASCADE,
  author_id       UUID NOT NULL REFERENCES author(id) ON DELETE RESTRICT,
  position        INT NOT NULL DEFAULT 0,
  PRIMARY KEY (work_id, author_id)
);

CREATE TABLE IF NOT EXISTS edition (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id         UUID NOT NULL REFERENCES book_work(id) ON DELETE CASCADE,
  isbn10          TEXT,
  isbn13          TEXT,
  ean             TEXT,
  format          TEXT,                              -- hardcover, paperback, ebook, ...
  page_count      INT,
  publish_date    DATE,
  publisher_id    UUID REFERENCES publisher(id) ON DELETE SET NULL,
  language        TEXT,
  cover_image_url TEXT,
  dimensions      TEXT,
  weight_grams    INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (isbn13),
  UNIQUE (isbn10)
);

-- Unicité conditionnelle pour éditions sans ISBN (réduit les doublons évidents)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_edition_fallback
ON edition (
  work_id,
  COALESCE(publisher_id, '00000000-0000-0000-0000-000000000000'::uuid),
  COALESCE(publish_date, '1900-01-01'::date),
  COALESCE(format, '?'),
  COALESCE(page_count, -1)
)
WHERE isbn13 IS NULL AND isbn10 IS NULL;

CREATE TABLE IF NOT EXISTS series_membership (
  series_id       UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  work_id         UUID NOT NULL REFERENCES book_work(id) ON DELETE CASCADE,
  number_in_series NUMERIC,
  PRIMARY KEY (series_id, work_id)
);

CREATE TABLE IF NOT EXISTS book_identifier (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id         UUID REFERENCES book_work(id) ON DELETE CASCADE,
  edition_id      UUID REFERENCES edition(id) ON DELETE CASCADE,
  scheme          TEXT NOT NULL,                     -- 'openlibrary:work'|'openlibrary:olid'|'google'|'asin'|'oclc'|'ean',...
  value           TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((work_id IS NOT NULL) OR (edition_id IS NOT NULL)),
  UNIQUE (scheme, value)
);

-- =========================
-- COLLECTIONS & LECTURE
-- =========================
CREATE TABLE IF NOT EXISTS collection (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  privacy_level   TEXT DEFAULT 'private',
  position        INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS user_book (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  work_id         UUID NOT NULL REFERENCES book_work(id) ON DELETE CASCADE,
  preferred_edition_id UUID REFERENCES edition(id) ON DELETE SET NULL,
  status          reading_status NOT NULL DEFAULT 'to_read',
  rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
  started_at      DATE,
  finished_at     DATE,
  owned           BOOLEAN DEFAULT FALSE,
  notes           TEXT,
  tags            TEXT[],
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, work_id)
);

CREATE TABLE IF NOT EXISTS collection_item (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id   UUID NOT NULL REFERENCES collection(id) ON DELETE CASCADE,
  work_id         UUID NOT NULL REFERENCES book_work(id) ON DELETE CASCADE,
  position        INT NOT NULL DEFAULT 0,
  added_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (collection_id, work_id)
);

-- =========================
-- CONTENUS & RÉACTIONS
-- =========================
CREATE TABLE IF NOT EXISTS review (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  work_id         UUID NOT NULL REFERENCES book_work(id) ON DELETE CASCADE,
  rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
  title           TEXT,
  body            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, work_id)
);

CREATE TABLE IF NOT EXISTS reaction (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  entity_type     TEXT NOT NULL,                     -- 'review' | 'work'
  entity_id       UUID NOT NULL,                     -- cible UUID
  type            reaction_type NOT NULL DEFAULT 'like',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, entity_type, entity_id)
);

-- =========================
-- SCAN / IMPORT / EXPORT
-- =========================
CREATE TABLE IF NOT EXISTS scan_job (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID REFERENCES app_user(id) ON DELETE SET NULL,
  type                scan_type NOT NULL,
  status              scan_status NOT NULL DEFAULT 'pending',
  input_isbn          TEXT,
  input_file_key      TEXT,                           -- chemin storage si photo
  detected_isbn       TEXT,
  matched_work_id     UUID REFERENCES book_work(id) ON DELETE SET NULL,
  matched_edition_id  UUID REFERENCES edition(id) ON DELETE SET NULL,
  message             TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS import_job (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  source          import_source NOT NULL,
  file_key        TEXT NOT NULL,
  status          import_status NOT NULL DEFAULT 'pending',
  summary         JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS export_job (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  format          TEXT NOT NULL,                      -- 'json' | 'csv'
  file_key        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ready_at        TIMESTAMPTZ
);

-- =========================
-- NOTIFICATIONS & DEVICES
-- =========================
CREATE TABLE IF NOT EXISTS notification (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,                      -- 'follow' | 'comment' | 'import_done' | ...
  payload         JSONB NOT NULL,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS device_push_token (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL,                      -- 'expo' | 'ios' | 'android'
  token           TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (platform, token)
);

-- =========================
-- MÉDIAS / UPLOADS (optionnel)
-- =========================
CREATE TABLE IF NOT EXISTS media_asset (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id   UUID REFERENCES app_user(id) ON DELETE SET NULL,
  kind            TEXT NOT NULL,                      -- 'cover' | 'avatar' | 'import_file' | ...
  storage_key     TEXT NOT NULL,                      -- ex: s3://bucket/key
  content_type    TEXT,
  width           INT,
  height          INT,
  size_bytes      BIGINT,
  sha256_hex      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- RECHERCHE (mat view simple)
-- =========================
DROP MATERIALIZED VIEW IF EXISTS mv_work_search;
CREATE MATERIALIZED VIEW mv_work_search AS
SELECT
  w.id,
  unaccent(lower(w.title)) AS title_norm,
  COALESCE(string_agg(a.name, ' ' ORDER BY bwa.position), '') AS authors_str,
  setweight(to_tsvector('simple', coalesce(w.title,'')), 'A') ||
  setweight(to_tsvector('simple', coalesce(string_agg(a.name,' '),'')), 'B') AS ts
FROM book_work w
LEFT JOIN book_work_author bwa ON bwa.work_id = w.id
LEFT JOIN author a ON a.id = bwa.author_id
GROUP BY w.id;

CREATE INDEX IF NOT EXISTS mv_work_search_ts_idx ON mv_work_search USING GIN (ts);
