package main

import (
	"database/sql"

	"github.com/google/uuid"
)

type Artist struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

type Author struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

type Chapter struct {
	ID                 uuid.UUID      `json:"id"`
	MangaID            uuid.NullUUID  `json:"manga_id"`
	Volume             sql.NullString `json:"volume"`
	Chapter            sql.NullString `json:"chapter"`
	Title              sql.NullString `json:"title"`
	TranslatedLanguage sql.NullString `json:"translated_language"`
	ExternalUrl        sql.NullString `json:"external_url"`
	PublishAt          sql.NullTime   `json:"publish_at"`
	ReadableAt         sql.NullTime   `json:"readable_at"`
	CreatedAt          sql.NullTime   `json:"created_at"`
	UpdatedAt          sql.NullTime   `json:"updated_at"`
	Pages              sql.NullInt32  `json:"pages"`
	Version            sql.NullInt32  `json:"version"`
}

type CoverImage struct {
	ID         uuid.UUID     `json:"id"`
	MangaID    uuid.NullUUID `json:"manga_id"`
	FilePath   string        `json:"file_path"`
	UploadedAt sql.NullTime  `json:"uploaded_at"`
}

type Description struct {
	ID           int32          `json:"id"`
	MangaID      uuid.NullUUID  `json:"manga_id"`
	LanguageCode sql.NullString `json:"language_code"`
	Description  sql.NullString `json:"description"`
}

type Manga struct {
	ID               uuid.UUID      `json:"id"`
	Title            sql.NullString `json:"title"`
	Description      sql.NullString `json:"description"`
	OriginalLanguage sql.NullString `json:"original_language"`
	LastVolume       sql.NullString `json:"last_volume"`
	LastChapter      sql.NullString `json:"last_chapter"`
	Demographic      sql.NullString `json:"demographic"`
	Status           sql.NullString `json:"status"`
	Year             sql.NullInt32  `json:"year"`
	ContentRating    sql.NullString `json:"content_rating"`
	State            sql.NullString `json:"state"`
	IsLocked         sql.NullBool   `json:"is_locked"`
	ChapterReset     sql.NullBool   `json:"chapter_reset"`
	CreatedAt        sql.NullTime   `json:"created_at"`
	UpdatedAt        sql.NullTime   `json:"updated_at"`
	Version          sql.NullInt32  `json:"version"`
}

type MangaArtist struct {
	MangaID  uuid.UUID `json:"manga_id"`
	ArtistID uuid.UUID `json:"artist_id"`
}

type MangaAuthor struct {
	MangaID  uuid.UUID `json:"manga_id"`
	AuthorID uuid.UUID `json:"author_id"`
}

type MangaTag struct {
	MangaID uuid.UUID `json:"manga_id"`
	TagID   uuid.UUID `json:"tag_id"`
}

type Tag struct {
	ID          uuid.UUID      `json:"id"`
	Name        sql.NullString `json:"name"`
	Description sql.NullString `json:"description"`
	GroupName   sql.NullString `json:"group_name"`
	Version     sql.NullInt32  `json:"version"`
}

type Title struct {
	ID           int32          `json:"id"`
	MangaID      uuid.NullUUID  `json:"manga_id"`
	LanguageCode sql.NullString `json:"language_code"`
	Title        sql.NullString `json:"title"`
}

type MigrationTable struct {
	ID             int32        `json:"id"`
	MigrationBegin sql.NullTime `json:"migration_begin"`
	MigrationEnd   sql.NullTime `json:"migration_end"`
}
