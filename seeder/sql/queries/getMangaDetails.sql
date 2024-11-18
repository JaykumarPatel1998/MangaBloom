-- name: GetMangaDetails :many
SELECT 
    m.id AS manga_id,
    m.title AS manga_title,
    m.original_language,
    m.status,
    t.title AS alternate_title,
    a.name AS author_name,
    ar.name AS artist_name
FROM 
    manga m
LEFT JOIN titles t ON m.id = t.manga_id
LEFT JOIN manga_authors ma ON m.id = ma.manga_id
LEFT JOIN authors a ON ma.author_id = a.id
LEFT JOIN manga_artists mar ON m.id = mar.manga_id
LEFT JOIN artists ar ON mar.artist_id = ar.id
ORDER BY 
    m.title, t.language_code, a.name, ar.name;
