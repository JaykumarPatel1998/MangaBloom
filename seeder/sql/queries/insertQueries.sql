-- name: InsertManga :exec
INSERT INTO manga(
    id, title, description, original_language, last_volume, last_chapter, demographic, status, year, content_rating, state, is_locked, chapter_reset, created_at, updated_at, version
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
) ON CONFLICT(id) DO NOTHING;

-- name: InsertTitle :exec
INSERT INTO titles(
    manga_id, language_code, title
)
VALUES ($1, $2, $3) ON CONFLICT(id) DO NOTHING;

-- name: InsertDescription :exec
INSERT INTO descriptions(
    manga_id, language_code, description
)
VALUES ($1, $2, $3) ON CONFLICT(id) DO NOTHING;

-- name: InsertAuthor :exec
INSERT INTO authors(
    id, name
)
VALUES ($1, $2) ON CONFLICT(id) DO NOTHING;

-- name: InsertMangaAuthor :exec
INSERT INTO manga_authors(
    manga_id, author_id
)
VALUES ($1, $2) ON CONFLICT(manga_id, author_id) DO NOTHING;

-- name: InsertArtist :exec
INSERT INTO artists(
    id, name
)
VALUES ($1, $2) ON CONFLICT(id) DO NOTHING;

-- name: InsertMangaArtist :exec
INSERT INTO manga_artists (
    manga_id, artist_id
)
VALUES ($1, $2) 
ON CONFLICT (manga_id, artist_id) DO NOTHING;

-- name: InsertCoverImage :exec
INSERT INTO cover_images(
    id, manga_id, file_path, uploaded_at
)
VALUES ($1, $2, $3, $4)
ON CONFLICT (id) DO NOTHING;

-- name: InsertTag :exec
INSERT INTO tags(
    id, name, description, group_name, version
)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (id) DO NOTHING;

-- name: InsertMangaTag :exec
INSERT INTO manga_tags(
    manga_id, tag_id
)
VALUES ($1, $2)
ON CONFLICT (manga_id, tag_id) DO NOTHING;

-- name: InsertChapter :exec
INSERT INTO chapters(
    id, manga_id, volume, chapter, title, translated_language, external_url, publish_at, readable_at, created_at, updated_at, pages, version
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
) ON CONFLICT(id) DO NOTHING;
