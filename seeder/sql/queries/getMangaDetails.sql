-- name: GetMangaDetailsById :one
SELECT 
    m.id AS manga_id,
    JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('language_code', t.language_code, 'title', t.title)) AS manga_titles,
    JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('language_code', d.language_code, 'description', d.description)) AS manga_descriptions,
    m.original_language,
    m.status,
    ARRAY_AGG(DISTINCT ma.author_id) AS authors,
    ARRAY_AGG(DISTINCT mar.artist_id) AS artists,
    JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'chapter_id', c.id, 
        'volume', c.volume, 
        'chapter', c.chapter, 
        'title', c.title, 
        'translated_language', c.translated_language
    )) AS chapters,
    JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ci.id, 'file_path', ci.file_path)) AS cover_images
FROM
    manga m
LEFT JOIN titles t ON m.id = t.manga_id
LEFT JOIN descriptions d ON m.id = d.manga_id
LEFT JOIN manga_authors ma ON m.id = ma.manga_id
LEFT JOIN manga_artists mar ON m.id = mar.manga_id
LEFT JOIN chapters c ON m.id = c.manga_id
LEFT JOIN cover_images ci ON m.id = ci.manga_id
WHERE m.id = $1
GROUP BY m.id;
