-- name: GetMangaDetails :many
SELECT 
    m.id AS manga_id,
    m.title AS manga_title,
    m.original_language,
    m.status,
    m.year,
    STRING_AGG(t.title || ' (' || t.language_code || ')', ', ') AS alternate_titles,
    STRING_AGG(a.name, ', ') AS author_names,
    STRING_AGG(ar.name, ', ') AS artist_names
FROM 
    manga m
LEFT JOIN titles t ON m.id = t.manga_id
LEFT JOIN manga_authors ma ON m.id = ma.manga_id
LEFT JOIN authors a ON ma.author_id = a.id
LEFT JOIN manga_artists mar ON m.id = mar.manga_id
LEFT JOIN artists ar ON mar.artist_id = ar.id
GROUP BY 
    m.id, m.title, m.original_language, m.status, m.year
ORDER BY 
    m.title;
