-- name: GetPaginatedMangas :many
-- Retrieve a paginated list of mangas with filters for title, ID, and tags.
-- @param title Text filter for manga title (ILIKE)
-- @param manga_id UUID filter for exact manga ID
-- @param tags Array of text for tag names filter
-- @param limit Number of rows to fetch
-- @param offset Number of rows to skip (pagination)
WITH filtered_manga AS (
    SELECT
        m.id AS manga_id,
        m.title,
        c.file_path AS cover_image,
        m.last_chapter,
        ARRAY_AGG(t.name) AS tags
    FROM
        manga m
    LEFT JOIN
        cover_images c ON m.id = c.manga_id
    LEFT JOIN
        manga_tags mt ON m.id = mt.manga_id
    LEFT JOIN
        tags t ON mt.tag_id = t.id
    WHERE
        -- Title filter
        ($1::TEXT IS NULL OR m.title ILIKE '%' || $1 || '%')
        -- Manga ID filter: Only apply if it's not the '00000000-0000-0000-0000-000000000000' UUID
        AND ($2::UUID IS NULL OR $2::UUID = '00000000-0000-0000-0000-000000000000' OR m.id = $2::UUID)
        -- Tags filter
        AND ($3::TEXT[] IS NULL OR t.name = ANY($3))
    GROUP BY
        m.id, c.file_path, m.last_chapter
)
SELECT
    manga_id,
    title,
    cover_image,
    last_chapter as latest_chapter,
    tags
FROM
    filtered_manga
ORDER BY
    title ASC
LIMIT $4 OFFSET $5;
