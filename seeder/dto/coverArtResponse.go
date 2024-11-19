package dto

import "time"

type CoverAPIResponse struct {
	Result   string     `json:"result"`
	Response string     `json:"response"`
	Data     EntityData `json:"data"`
}

// EntityData represents the "data" field in the response.
type EntityData struct {
	ID            string              `json:"id"`
	Type          string              `json:"type"`
	Attributes    CoverAttributes     `json:"attributes"`
	Relationships []CoverRelationship `json:"relationships"`
}

// Attributes represents the "attributes" field in the "data" section.
type CoverAttributes struct {
	Description string    `json:"description"`
	Volume      *string   `json:"volume"` // Nullable field
	FileName    string    `json:"fileName"`
	Locale      string    `json:"locale"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Version     int       `json:"version"`
}

// Relationship represents each object in the "relationships" array.
type CoverRelationship struct {
	ID   string `json:"id"`
	Type string `json:"type"`
}
