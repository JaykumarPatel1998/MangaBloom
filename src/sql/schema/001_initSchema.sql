-- +goose Up
CREATE TABLE manga (
    id UUID PRIMARY KEY,
    title TEXT,
    description TEXT,
    original_language VARCHAR(10),
    last_volume VARCHAR(10),
    last_chapter VARCHAR(10),
    demographic VARCHAR(20),
    status VARCHAR(20),
    year INT,
    content_rating VARCHAR(20),
    state VARCHAR(20),
    is_locked BOOLEAN DEFAULT FALSE,
    chapter_reset BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    version INT DEFAULT 1
);

CREATE TABLE titles (
    id SERIAL PRIMARY KEY,
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    language_code VARCHAR(10),
    title TEXT
);

CREATE TABLE descriptions (
    id SERIAL PRIMARY KEY,
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    language_code VARCHAR(10),
    description TEXT
);

CREATE TABLE authors (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE manga_authors (
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (manga_id, author_id)
);

CREATE TABLE artists (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE manga_artists (
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    PRIMARY KEY (manga_id, artist_id)
);

CREATE TABLE cover_images (
    id UUID PRIMARY KEY,
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id UUID PRIMARY KEY,
    name text,
    description text,
    group_name VARCHAR(50),
    version INT DEFAULT 1
);

CREATE TABLE manga_tags (
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (manga_id, tag_id)
);

CREATE TABLE chapters (
  id UUID PRIMARY KEY,
  manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
  volume text,
  chapter text,
  title VARCHAR(255),
  translated_language VARCHAR(50),
  external_url VARCHAR(255),
  publish_at TIMESTAMP,
  readable_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  pages INT,
  version INT
);

-- +goose Down
DROP TABLE manga;
DROP TABLE titles;
DROP TABLE descriptions;
DROP TABLE authors;
DROP TABLE manga_authors;
DROP TABLE artists;
DROP TABLE manga_artists;
DROP TABLE cover_images;
DROP TABLE tags;
DROP TABLE manga_tags;
DROP TABLE chapters;