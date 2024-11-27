package dto

import "time"

type ChapterPaginatedResponse struct {
	Data   []ChapterResponse `json:"data"`
	Total  int               `json:"total"`
	Limit  int               `json:"limit"`
	Offset int               `json:"offset"`
}

// Response represents the top-level structure of the API response.
type ChapterResponse struct {
	ID            string                `json:"id"`
	Type          string                `json:"type"`
	Attributes    ChapterAttributes     `json:"attributes"`
	Relationships []ChapterRelationship `json:"relationships"`
}

// Attributes represents the attributes of the chapter.
type ChapterAttributes struct {
	Volume             *string   `json:"volume"` // Pointer to handle null values
	Chapter            string    `json:"chapter"`
	Title              *string   `json:"title"` // Pointer to handle null values
	TranslatedLanguage string    `json:"translatedLanguage"`
	ExternalURL        *string   `json:"externalUrl"` // Pointer to handle null values
	PublishAt          time.Time `json:"publishAt"`
	ReadableAt         time.Time `json:"readableAt"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
	Pages              int       `json:"pages"`
	Version            int       `json:"version"`
}

// Relationship represents the relationship object in the response.
type ChapterRelationship struct {
	ID   string `json:"id"`
	Type string `json:"type"`
}
