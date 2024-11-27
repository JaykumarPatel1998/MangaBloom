// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: insertQueries.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const insertArtist = `-- name: InsertArtist :exec
INSERT INTO artists(
    id, name
)
VALUES ($1, $2) ON CONFLICT(id) DO NOTHING
`

type InsertArtistParams struct {
	ID   uuid.UUID
	Name string
}

func (q *Queries) InsertArtist(ctx context.Context, arg InsertArtistParams) error {
	_, err := q.db.ExecContext(ctx, insertArtist, arg.ID, arg.Name)
	return err
}

const insertAuthor = `-- name: InsertAuthor :exec
INSERT INTO authors(
    id, name
)
VALUES ($1, $2) ON CONFLICT(id) DO NOTHING
`

type InsertAuthorParams struct {
	ID   uuid.UUID
	Name string
}

func (q *Queries) InsertAuthor(ctx context.Context, arg InsertAuthorParams) error {
	_, err := q.db.ExecContext(ctx, insertAuthor, arg.ID, arg.Name)
	return err
}

const insertChapter = `-- name: InsertChapter :exec
INSERT INTO chapters(
    id, manga_id, volume, chapter, title, translated_language, external_url, publish_at, readable_at, created_at, updated_at, pages, version
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
) ON CONFLICT(id) DO NOTHING
`

type InsertChapterParams struct {
	ID                 uuid.UUID
	MangaID            uuid.NullUUID
	Volume             sql.NullString
	Chapter            sql.NullString
	Title              sql.NullString
	TranslatedLanguage sql.NullString
	ExternalUrl        sql.NullString
	PublishAt          sql.NullTime
	ReadableAt         sql.NullTime
	CreatedAt          sql.NullTime
	UpdatedAt          sql.NullTime
	Pages              sql.NullInt32
	Version            sql.NullInt32
}

func (q *Queries) InsertChapter(ctx context.Context, arg InsertChapterParams) error {
	_, err := q.db.ExecContext(ctx, insertChapter,
		arg.ID,
		arg.MangaID,
		arg.Volume,
		arg.Chapter,
		arg.Title,
		arg.TranslatedLanguage,
		arg.ExternalUrl,
		arg.PublishAt,
		arg.ReadableAt,
		arg.CreatedAt,
		arg.UpdatedAt,
		arg.Pages,
		arg.Version,
	)
	return err
}

const insertCoverImage = `-- name: InsertCoverImage :exec
INSERT INTO cover_images(
    id, manga_id, file_path, uploaded_at
)
VALUES ($1, $2, $3, $4)
ON CONFLICT (id) DO NOTHING
`

type InsertCoverImageParams struct {
	ID         uuid.UUID
	MangaID    uuid.NullUUID
	FilePath   string
	UploadedAt sql.NullTime
}

func (q *Queries) InsertCoverImage(ctx context.Context, arg InsertCoverImageParams) error {
	_, err := q.db.ExecContext(ctx, insertCoverImage,
		arg.ID,
		arg.MangaID,
		arg.FilePath,
		arg.UploadedAt,
	)
	return err
}

const insertDescription = `-- name: InsertDescription :exec
INSERT INTO descriptions(
    manga_id, language_code, description
)
VALUES ($1, $2, $3) ON CONFLICT(id) DO NOTHING
`

type InsertDescriptionParams struct {
	MangaID      uuid.NullUUID
	LanguageCode sql.NullString
	Description  sql.NullString
}

func (q *Queries) InsertDescription(ctx context.Context, arg InsertDescriptionParams) error {
	_, err := q.db.ExecContext(ctx, insertDescription, arg.MangaID, arg.LanguageCode, arg.Description)
	return err
}

const insertManga = `-- name: InsertManga :exec
INSERT INTO manga(
    id, title, description, original_language, last_volume, last_chapter, demographic, status, year, content_rating, state, is_locked, chapter_reset, created_at, updated_at, version
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
) ON CONFLICT(id) DO NOTHING
`

type InsertMangaParams struct {
	ID               uuid.UUID
	Title            sql.NullString
	Description      sql.NullString
	OriginalLanguage sql.NullString
	LastVolume       sql.NullString
	LastChapter      sql.NullString
	Demographic      sql.NullString
	Status           sql.NullString
	Year             sql.NullInt32
	ContentRating    sql.NullString
	State            sql.NullString
	IsLocked         sql.NullBool
	ChapterReset     sql.NullBool
	CreatedAt        sql.NullTime
	UpdatedAt        sql.NullTime
	Version          sql.NullInt32
}

func (q *Queries) InsertManga(ctx context.Context, arg InsertMangaParams) error {
	_, err := q.db.ExecContext(ctx, insertManga,
		arg.ID,
		arg.Title,
		arg.Description,
		arg.OriginalLanguage,
		arg.LastVolume,
		arg.LastChapter,
		arg.Demographic,
		arg.Status,
		arg.Year,
		arg.ContentRating,
		arg.State,
		arg.IsLocked,
		arg.ChapterReset,
		arg.CreatedAt,
		arg.UpdatedAt,
		arg.Version,
	)
	return err
}

const insertMangaArtist = `-- name: InsertMangaArtist :exec
INSERT INTO manga_artists (
    manga_id, artist_id
)
VALUES ($1, $2) 
ON CONFLICT (manga_id, artist_id) DO NOTHING
`

type InsertMangaArtistParams struct {
	MangaID  uuid.UUID
	ArtistID uuid.UUID
}

func (q *Queries) InsertMangaArtist(ctx context.Context, arg InsertMangaArtistParams) error {
	_, err := q.db.ExecContext(ctx, insertMangaArtist, arg.MangaID, arg.ArtistID)
	return err
}

const insertMangaAuthor = `-- name: InsertMangaAuthor :exec
INSERT INTO manga_authors(
    manga_id, author_id
)
VALUES ($1, $2) ON CONFLICT(manga_id, author_id) DO NOTHING
`

type InsertMangaAuthorParams struct {
	MangaID  uuid.UUID
	AuthorID uuid.UUID
}

func (q *Queries) InsertMangaAuthor(ctx context.Context, arg InsertMangaAuthorParams) error {
	_, err := q.db.ExecContext(ctx, insertMangaAuthor, arg.MangaID, arg.AuthorID)
	return err
}

const insertMangaTag = `-- name: InsertMangaTag :exec
INSERT INTO manga_tags(
    manga_id, tag_id
)
VALUES ($1, $2)
ON CONFLICT (manga_id, tag_id) DO NOTHING
`

type InsertMangaTagParams struct {
	MangaID uuid.UUID
	TagID   uuid.UUID
}

func (q *Queries) InsertMangaTag(ctx context.Context, arg InsertMangaTagParams) error {
	_, err := q.db.ExecContext(ctx, insertMangaTag, arg.MangaID, arg.TagID)
	return err
}

const insertTag = `-- name: InsertTag :exec
INSERT INTO tags(
    id, name, description, group_name, version
)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (id) DO NOTHING
`

type InsertTagParams struct {
	ID          uuid.UUID
	Name        sql.NullString
	Description sql.NullString
	GroupName   sql.NullString
	Version     sql.NullInt32
}

func (q *Queries) InsertTag(ctx context.Context, arg InsertTagParams) error {
	_, err := q.db.ExecContext(ctx, insertTag,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.GroupName,
		arg.Version,
	)
	return err
}

const insertTitle = `-- name: InsertTitle :exec
INSERT INTO titles(
    manga_id, language_code, title
)
VALUES ($1, $2, $3) ON CONFLICT(id) DO NOTHING
`

type InsertTitleParams struct {
	MangaID      uuid.NullUUID
	LanguageCode sql.NullString
	Title        sql.NullString
}

func (q *Queries) InsertTitle(ctx context.Context, arg InsertTitleParams) error {
	_, err := q.db.ExecContext(ctx, insertTitle, arg.MangaID, arg.LanguageCode, arg.Title)
	return err
}
