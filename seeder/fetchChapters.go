package seeder

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/JaykumarPatel1998/MangaBloom/seeder/dto"
	"github.com/google/uuid"
)

func FetchChapters(client *http.Client, mangaId string, chapters *[]Chapter, page int) error {
	url := fmt.Sprintf("%vmanga/%v/feed?limit=100&offset=%v&includeFuturePublishAt=0&includeExternalUrl=0", mangadex_api_url, mangaId, page*100)
	fmt.Println("fetching url : ", url)
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
			Volume:             sql.NullString{String: *chapterRes.Attributes.Volume, Valid: chapterRes.Attributes.Volume != nil},
			Chapter:            sql.NullString{String: chapterRes.Attributes.Chapter, Valid: chapterRes.Attributes.Chapter != ""},
			Title:              sql.NullString{String: *chapterRes.Attributes.Title, Valid: chapterRes.Attributes.Title != nil},
			TranslatedLanguage: sql.NullString{String: chapterRes.Attributes.TranslatedLanguage, Valid: true},
			ExternalUrl:        sql.NullString{String: *chapterRes.Attributes.ExternalURL, Valid: chapterRes.Attributes.ExternalURL != nil},
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
