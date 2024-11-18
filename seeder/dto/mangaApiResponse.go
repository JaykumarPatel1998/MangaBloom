package dto

import "time"

type APIResponse struct {
	Data   []MangaResponse `json:"data"`
	Total  int             `json:"total"`
	Limit  int             `json:"limit"`
	Offset int             `json:"offset"`
}

// Root represents the top-level structure of the response
type MangaResponse struct {
	ID            string     `json:"id"`
	Type          string     `json:"type"`
	Attributes    Attributes `json:"attributes"`
	Relationships []Relation `json:"relationships"`
}

// Attributes holds the main properties of the manga
type Attributes struct {
	Title                          map[string]string   `json:"title"`
	AltTitles                      []map[string]string `json:"altTitles"`
	Description                    map[string]string   `json:"description"`
	IsLocked                       bool                `json:"isLocked"`
	Links                          map[string]string   `json:"links"` // Changed to map[string]string
	OriginalLanguage               string              `json:"originalLanguage"`
	LastVolume                     string              `json:"lastVolume"`
	LastChapter                    string              `json:"lastChapter"`
	PublicationDemographic         string              `json:"publicationDemographic"`
	Status                         string              `json:"status"`
	Year                           int32               `json:"year"`
	ContentRating                  string              `json:"contentRating"`
	Tags                           []Tag               `json:"tags"`
	State                          string              `json:"state"`
	ChapterNumbersResetOnNewVolume bool                `json:"chapterNumbersResetOnNewVolume"`
	CreatedAt                      time.Time           `json:"createdAt"`
	UpdatedAt                      time.Time           `json:"updatedAt"`
	Version                        int32               `json:"version"`
	AvailableTranslatedLanguages   []string            `json:"availableTranslatedLanguages"`
	LatestUploadedChapter          string              `json:"latestUploadedChapter"`
}

// Tag represents a tag with its attributes
type Tag struct {
	ID            string        `json:"id"`
	Type          string        `json:"type"`
	Attributes    TagAttributes `json:"attributes"`
	Relationships []interface{} `json:"relationships"`
}

// TagAttributes contains the name and other details of a tag
type TagAttributes struct {
	Name        map[string]string `json:"name"`
	Description map[string]string `json:"description"`
	Group       string            `json:"group"`
	Version     int32             `json:"version"`
}

// Relation represents a relationship (e.g., author, artist, cover art, related manga)
type Relation struct {
	ID      string `json:"id"`
	Type    string `json:"type"`
	Related string `json:"related,omitempty"`
}
