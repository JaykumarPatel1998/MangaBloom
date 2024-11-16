-- name: InsertManga :exec
INSERT INTO manga(
    id, title, description, original_language, last_volume, last_chapter, demographic, status, year, content_rating, state, is_locked, chapter_reset, created_at, updated_at, version
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
);

-- name: InsertTitle :exec
INSERT INTO titles(
    manga_id, language_code, title
)
VALUES ($1, $2, $3);

-- name: InsertDescription :exec
INSERT INTO descriptions(
    manga_id, language_code, description
)
VALUES ($1, $2, $3);

-- name: InsertAuthor :exec
INSERT INTO authors(
    id, name
)
VALUES ($1, $2);

-- name: InsertMangaAuthor :exec
INSERT INTO manga_authors(
    manga_id, author_id
)
VALUES ($1, $2);

-- name: InsertArtist :exec
INSERT INTO artists(
    id, name
)
VALUES ($1, $2);

-- name: InsertMangaArtist :exec
INSERT INTO manga_artists(
    manga_id, artist_id
)
VALUES ($1, $2);

-- name: InsertCoverImage :exec
INSERT INTO cover_images(
    id, manga_id, file_path, uploaded_at
)
VALUES ($1, $2, $3, $4);

-- name: InsertTag :exec
INSERT INTO tags(
    id, name, description, group_name, version
)
VALUES ($1, $2, $3, $4, $5);

-- name: InsertMangaTag :exec
INSERT INTO manga_tags(
    manga_id, tag_id
)
VALUES ($1, $2);

-- name: InsertChapter :exec
INSERT INTO chapters(
    id, manga_id, volume, chapter, title, translated_language, external_url, publish_at, readable_at, created_at, updated_at, pages, version
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
);
