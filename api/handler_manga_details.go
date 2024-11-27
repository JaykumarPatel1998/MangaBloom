package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/JaykumarPatel1998/MangaBloom/seeder/database"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func handleGetMangaByID(c echo.Context, queries *database.Queries) error {
	// Extract the manga ID from the request parameters
	mangaIDStr := c.Param("id")

	// Parse the manga ID into a UUID
	mangaID, err := uuid.Parse(mangaIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"error": "invalid manga ID format",
		})
	}

	// Retrieve the manga details using the SQLC-generated function
	mangaDetails, err := queries.GetMangaDetailsById(context.Background(), mangaID)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusNotFound, echo.Map{
				"error": "manga not found",
			})
		}
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"error": "failed to retrieve manga details",
		})
	}

	// Construct a response map to return a structured JSON response
	response := map[string]interface{}{
		"manga_id":           mangaDetails.MangaID,
		"manga_titles":       json.RawMessage(mangaDetails.MangaTitles),
		"manga_descriptions": json.RawMessage(mangaDetails.MangaDescriptions),
		"original_language":  mangaDetails.OriginalLanguage.String,
		"status":             mangaDetails.Status.String,
		"authors":            mangaDetails.Authors,
		"artists":            mangaDetails.Artists,
		"chapters":           json.RawMessage(mangaDetails.Chapters),
		"cover_images":       json.RawMessage(mangaDetails.CoverImages),
	}

	// Return the response
	return c.JSON(http.StatusOK, response)
}
