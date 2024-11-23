package main

import (
	"context"
	"net/http"
	"strconv"
	"strings"

	"github.com/JaykumarPatel1998/MangaBloom/seeder/database"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// Handler for fetching paginated mangas
func handleGetPaginatedMangas(c echo.Context, queries *database.Queries) error {
	// Parse query parameters
	title := c.QueryParam("title") // Filter by title (ILIKE)
	mangaIDParam := c.QueryParam("manga_id")
	tagsParam := c.QueryParams()["tags"] // Filter by tags (e.g., ?tags=tag1&tags=tag2)

	limitParam := c.QueryParam("limit")
	offsetParam := c.QueryParam("offset")

	// Convert limit and offset to integers with default values
	limit, err := strconv.Atoi(limitParam)
	if err != nil || limit <= 0 {
		limit = 10 // Default limit
	}

	offset, err := strconv.Atoi(offsetParam)
	if err != nil || offset < 0 {
		offset = 0 // Default offset
	}

	// Prepare the request parameters (with optional values)
	params := database.GetPaginatedMangasParams{
		Column1: "",       // Empty string for title filter (if not provided)
		Column2: uuid.Nil, // uuid.Nil for manga_id filter (if not provided)
		Column3: nil,      // nil for tags filter (if not provided)
		Limit:   int32(limit),
		Offset:  int32(offset),
	}

	// Set the filters if provided in the request
	if title != "" {
		params.Column1 = title // Title filter
	}

	if mangaIDParam != "" && mangaIDParam != "00000000-0000-0000-0000-000000000000" {
		id, err := uuid.Parse(mangaIDParam)
		if err == nil {
			params.Column2 = id // Manga ID filter
		}
	}

	if len(tagsParam) > 0 {
		params.Column3 = tagsParam // Tags filter
	}

	// Execute the query
	mangas, err := queries.GetPaginatedMangas(context.Background(), params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to fetch mangas", "details": err.Error()})
	}

	// Format the response
	response := []map[string]interface{}{}
	for _, manga := range mangas {

		// If Tags is a single string and you want to treat it as an array, split it (if needed)
		var tags []string
		switch v := manga.Tags.(type) {
		case string:
			// Assuming tags are stored as a single string with a delimiter (e.g., comma separated)
			tags = strings.Split(v, ",") // Modify the delimiter if necessary
		case []string:
			tags = v // If it's already an array, use it directly
		default:
			tags = []string{} // Default to empty array if the type doesn't match
		}

		response = append(response, map[string]interface{}{
			"id":             manga.MangaID,
			"title":          manga.Title.String,
			"cover_image":    manga.CoverImage.String,
			"latest_chapter": manga.LatestChapter.String, // Adjust the type if needed
			"tags":           tags,                       // Adjust the type if needed
		})
	}

	// Return the response
	return c.JSON(http.StatusOK, echo.Map{
		"mangas": response,
	})
}
