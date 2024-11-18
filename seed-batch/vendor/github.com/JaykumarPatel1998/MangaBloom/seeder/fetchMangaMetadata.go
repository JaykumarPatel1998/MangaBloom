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

// just bookmarking some code to start the docker container for dev - postgres
// docker run -d --name postgres-v1 -p 5432:5432 -e POSTGRES_PASSWORD=password -e PGDATA=/var/lib/postgresql/data/pgdata postgres
func uuidParser(str string) uuid.UUID {
	res, err := uuid.Parse(str)
	if err != nil {
		log.Fatal("invalid uuid", err)
	}

	return res
}

func keyExistsInMapThenReturnSQLNullString(entityMap *map[string]string, key string) sql.NullString {
	value, exists := (*entityMap)[key]
	if exists {
		return sql.NullString{String: value, Valid: true}
	} else {
		return sql.NullString{String: "", Valid: false}
	}
}

func FetchMangaListWithPagination(client *http.Client, mangalist *[]Manga, titleList *[]Title,
	tags *[]Tag, authors *[]Author, artists *[]Artist, manga_authors *[]MangaAuthor,
	manga_artists *[]MangaArtist, chapters *[]Chapter, cover_images *[]CoverImage,
	descriptions *[]Description, page int) error {
	url := fmt.Sprintf("%vmanga?limit=100&offset=%v&order[latestUploadedChapter]=desc", mangadex_api_url, page*100)
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

	var apiResponse dto.APIResponse
	if err := json.Unmarshal(body, &apiResponse); err != nil {
		log.Fatal(err)
		return err
	}

	for i := 0; i < len(apiResponse.Data); i++ {
		mangaRes := apiResponse.Data[i]
		manga := Manga{
			ID:               uuidParser(mangaRes.ID),
			Title:            keyExistsInMapThenReturnSQLNullString(&mangaRes.Attributes.Title, "en"),
			Description:      keyExistsInMapThenReturnSQLNullString(&mangaRes.Attributes.Description, "en"),
			OriginalLanguage: sql.NullString{String: mangaRes.Attributes.OriginalLanguage, Valid: true},
			LastVolume:       sql.NullString{String: mangaRes.Attributes.LastVolume, Valid: true},
			LastChapter:      sql.NullString{String: mangaRes.Attributes.LastChapter, Valid: true},
			Demographic:      sql.NullString{String: mangaRes.Attributes.PublicationDemographic, Valid: true},
			Status:           sql.NullString{String: mangaRes.Attributes.Status, Valid: true},
			Year:             sql.NullInt32{Int32: mangaRes.Attributes.Year, Valid: true},
			ContentRating:    sql.NullString{String: mangaRes.Attributes.ContentRating, Valid: true},
			State:            sql.NullString{String: mangaRes.Attributes.State, Valid: true},
			IsLocked:         sql.NullBool{Bool: mangaRes.Attributes.IsLocked, Valid: true},
			ChapterReset:     sql.NullBool{Bool: mangaRes.Attributes.ChapterNumbersResetOnNewVolume, Valid: true},
			CreatedAt:        sql.NullTime{Time: mangaRes.Attributes.CreatedAt, Valid: true},
			UpdatedAt:        sql.NullTime{Time: mangaRes.Attributes.UpdatedAt, Valid: true},
			Version:          sql.NullInt32{Int32: mangaRes.Attributes.Version, Valid: true},
		}
		populateTitles(mangaRes, titleList)
		populateDescriptions(mangaRes, descriptions)
		populateAuthors(mangaRes, authors)
		populateArtists(mangaRes, artists)
		populateMangaAuthors(mangaRes, manga_authors)
		populateMangaArtists(mangaRes, manga_artists)
		*mangalist = append(*mangalist, manga)
	}
	return nil
}

func populateTitles(mangaResponse dto.MangaResponse, titleList *[]Title) {
	for _, altTitle := range mangaResponse.Attributes.AltTitles {
		for language_code, title := range altTitle {
			title := Title{
				MangaID:      uuid.NullUUID{UUID: uuidParser(mangaResponse.ID), Valid: true},
				LanguageCode: sql.NullString{String: language_code, Valid: true},
				Title:        sql.NullString{String: title, Valid: true},
			}
			*titleList = append(*titleList, title)
		}
	}

	for language_code, title := range mangaResponse.Attributes.Title {
		title := Title{
			MangaID:      uuid.NullUUID{UUID: uuidParser(mangaResponse.ID), Valid: true},
			LanguageCode: sql.NullString{String: language_code, Valid: true},
			Title:        sql.NullString{String: title, Valid: true},
		}
		*titleList = append(*titleList, title)
	}
}

func populateDescriptions(mangaResponse dto.MangaResponse, descriptionList *[]Description) {
	for language_code, description := range mangaResponse.Attributes.Description {
		description := Description{
			MangaID:      uuid.NullUUID{UUID: uuidParser(mangaResponse.ID), Valid: true},
			LanguageCode: sql.NullString{String: language_code, Valid: true},
			Description:  sql.NullString{String: description, Valid: true},
		}
		*descriptionList = append(*descriptionList, description)
	}
}

func populateAuthors(mangaResponse dto.MangaResponse, authorList *[]Author) {
	for _, author := range mangaResponse.Relationships {
		if author.Type == "author" {
			author := Author{
				ID:   uuidParser(author.ID),
				Name: author.ID,
			}
			*authorList = append(*authorList, author)
		}
	}
}

func populateArtists(mangaResponse dto.MangaResponse, artistList *[]Artist) {
	for _, artist := range mangaResponse.Relationships {
		if artist.Type == "artist" {
			artist := Artist{
				ID:   uuidParser(artist.ID),
				Name: artist.ID,
			}
			*artistList = append(*artistList, artist)
		}
	}
}

func populateMangaAuthors(mangaResponse dto.MangaResponse, mangaAuthorList *[]MangaAuthor) {
	mangaID := uuidParser(mangaResponse.ID)
	for _, author := range mangaResponse.Relationships {
		if author.Type == "author" {
			authorID := uuidParser(author.ID)
			mangaAuthor := MangaAuthor{
				MangaID:  mangaID,
				AuthorID: authorID,
			}
			*mangaAuthorList = append(*mangaAuthorList, mangaAuthor)
		}
	}
}

func populateMangaArtists(mangaResponse dto.MangaResponse, mangaArtistList *[]MangaArtist) {
	mangaID := uuidParser(mangaResponse.ID)
	for _, artist := range mangaResponse.Relationships {
		if artist.Type == "artist" {
			artistID := uuidParser(artist.ID)
			mangaArtist := MangaArtist{
				MangaID:  mangaID,
				ArtistID: artistID,
			}
			*mangaArtistList = append(*mangaArtistList, mangaArtist)
		}
	}
}
