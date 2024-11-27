package seeder

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/JaykumarPatel1998/MangaBloom/seeder/dto"
	"github.com/google/uuid"
)

func ToNullString(ptr *string) sql.NullString {
	if ptr != nil {
		return sql.NullString{String: *ptr, Valid: true}
	}
	return sql.NullString{Valid: false}
}

func FetchChapters(client *http.Client, mangaId string, chapters *[]Chapter, page int) error {
	url := fmt.Sprintf("%vmanga/%v/feed?limit=100&offset=%v&includeFuturePublishAt=0&includeExternalUrl=0", mangadex_api_url, mangaId, page*100)
	// fmt.Println("Fetching URL:", url)
	resp, err := client.Get(url)

	if err != nil {
		log.Fatal(err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("non-OK HTTP status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var apiResponse dto.ChapterPaginatedResponse

	if err := json.Unmarshal(body, &apiResponse); err != nil {
		log.Fatal(err)
		return err
	}

	for i := 0; i < len(apiResponse.Data); i++ {
		chapterRes := apiResponse.Data[i]

		var mangaID uuid.NullUUID
		for _, rel := range chapterRes.Relationships {
			if rel.Type == "manga" {
				mangaID.UUID = uuidParser(rel.ID)
				mangaID.Valid = true
			}
		}

		chapter := Chapter{
			ID:                 uuidParser(chapterRes.ID),
			MangaID:            mangaID,
			Volume:             ToNullString(chapterRes.Attributes.Volume),
			Chapter:            sql.NullString{String: chapterRes.Attributes.Chapter, Valid: chapterRes.Attributes.Chapter != ""},
			Title:              ToNullString(chapterRes.Attributes.Title),
			TranslatedLanguage: sql.NullString{String: chapterRes.Attributes.TranslatedLanguage, Valid: true},
			ExternalUrl:        ToNullString(chapterRes.Attributes.ExternalURL),
			PublishAt:          sql.NullTime{Time: chapterRes.Attributes.PublishAt, Valid: true},
			ReadableAt:         sql.NullTime{Time: chapterRes.Attributes.ReadableAt, Valid: true},
			CreatedAt:          sql.NullTime{Time: chapterRes.Attributes.CreatedAt, Valid: true},
			UpdatedAt:          sql.NullTime{Time: chapterRes.Attributes.UpdatedAt, Valid: true},
			Pages:              sql.NullInt32{Int32: int32(chapterRes.Attributes.Pages), Valid: chapterRes.Attributes.Pages > 0},
			Version:            sql.NullInt32{Int32: int32(chapterRes.Attributes.Version), Valid: true},
		}

		*chapters = append(*chapters, chapter)
	}

	return nil
}

func PopulateChapters(client *http.Client, mangaID string, chapters *[]Chapter) {
	//just tryna check what the total responses are in the chapters
	url := fmt.Sprintf("%vmanga/%v/feed?limit=1&includeFuturePublishAt=0&includeExternalUrl=0", mangadex_api_url, mangaID)
	resp, err := client.Get(url)

	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Fatalf("non-OK HTTP status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	var apiResponse dto.ChapterPaginatedResponse

	if err := json.Unmarshal(body, &apiResponse); err != nil {
		log.Fatal(err)
	}

	//we have count of total mangas
	total_chapters := apiResponse.Total

	fmt.Printf("	Total chapters to fetch : %v\n", total_chapters)

	//considering 100 chapters in each iteration
	iterations := (total_chapters + 99) / 100
	fmt.Printf("	Total iterations : %v\n", iterations)

	for i := 0; i < iterations; i++ {

		// Fetch chapters and get the total count
		err := FetchChapters(client, mangaID, chapters, i)
		if err != nil {
			fmt.Println("Error fetching manga list:", err)
			return
		}

		sleep(200 * time.Millisecond)
	}
}
