package seeder

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/JaykumarPatel1998/MangaBloom/seeder/database"
	"github.com/JaykumarPatel1998/MangaBloom/seeder/dto"
	"github.com/google/uuid"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

type DBConfig struct {
	DB *database.Queries
}

var mangadex_api_url string

func sleep(duration time.Duration) {
	time.Sleep(duration)
}

func initialize() {
	godotenv.Load(".env")
	db_url_string := os.Getenv("DB_URL")

	if db_url_string == "" {
		log.Fatal("msising db_url")
	}

	db_url, _ := url.Parse(db_url_string)
	db_url.RawQuery = "sslmode=verify-ca;sslrootcert=ca.pem"

	mangadex_api_url = os.Getenv("MANGADEX_API_BASE_URL")
	if mangadex_api_url == "" {
		log.Fatal("missing mangadex api base url")
	}

	var err error
	db, err = sql.Open("postgres", db_url.String())
	if err != nil {
		log.Fatalf("failed to connect to database : %v", err)
	}

	db.SetMaxOpenConns(20)
	db.SetConnMaxLifetime(0)
	db.SetMaxIdleConns(5)
}

func SeedDatabase() {
	initialize()

	var migration_table MigrationTable
	fmt.Println("migration starts: ", time.Now())
	MigrationStart(&migration_table)

	//lets just try to query the data and add it to the database
	client := &http.Client{}
	db_cfg := DBConfig{
		DB: database.New(db),
	}

	url := fmt.Sprintf("%vmanga?limit=1&order[latestUploadedChapter]=desc", mangadex_api_url)
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

	var apiResponse dto.APIResponse
	if err := json.Unmarshal(body, &apiResponse); err != nil {
		log.Fatal(err)
	}

	//we have count of total mangas
	total_mangas := apiResponse.Total

	fmt.Printf("	Total mangas to fetch : %v\n", total_mangas)

	//considering 100 chapters in each iteration
	iterations := (total_mangas + 99) / 100
	fmt.Printf("	Total iterations : %v\n", iterations)

	for page := 0; page < iterations; page++ {
		var mangaList []Manga
		var titleList []Title
		var tags []Tag
		var authors []Author
		var artists []Artist
		var manga_authors []MangaAuthor
		var manga_artists []MangaArtist
		var cover_images []string
		var descriptions []Description
		var manga_tags []MangaTag

		fmt.Println("fetching manga page number: ", page)
		err := FetchMangaListWithPagination(client, &mangaList, &titleList, &tags, &authors, &artists, &manga_authors, &manga_artists, &cover_images, &descriptions, &manga_tags, page)
		if err != nil {
			fmt.Println("Error fetching manga list:", err)
			return
		}

		//insert mangas
		for _, manga := range mangaList {
			err := db_cfg.DB.InsertManga(context.Background(), database.InsertMangaParams(manga))
			if err != nil {
				log.Fatal(err)
				return
			}

			var chapter_list []Chapter

			PopulateChapters(client, manga.ID.String(), &chapter_list)
			for _, chapter := range chapter_list {
				err := db_cfg.DB.InsertChapter(context.Background(), database.InsertChapterParams(chapter))
				if err != nil {
					log.Fatal(err)
					return
				}
			}
		}

		//insert titles
		for _, title := range titleList {
			err := db_cfg.DB.InsertTitle(context.Background(), database.InsertTitleParams(title))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		// insert descriptions
		for _, description := range descriptions {
			err := db_cfg.DB.InsertDescription(context.Background(), database.InsertDescriptionParams(description))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		// isnert authors
		for _, author := range authors {
			err := db_cfg.DB.InsertAuthor(context.Background(), database.InsertAuthorParams(author))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		// insert artists
		for _, artist := range artists {
			err := db_cfg.DB.InsertArtist(context.Background(), database.InsertArtistParams(artist))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		// insert manga_authors
		for _, manga_author := range manga_authors {
			err := db_cfg.DB.InsertMangaAuthor(context.Background(), database.InsertMangaAuthorParams(manga_author))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		// insert manga_artists
		for _, manga_artist := range manga_artists {
			err := db_cfg.DB.InsertMangaArtist(context.Background(), database.InsertMangaArtistParams(manga_artist))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		for _, cover_image := range cover_images {
			resp, err := client.Get(cover_image)
			if err != nil {
				return
			}

			body, err := io.ReadAll(resp.Body)
			if err != nil {
				return
			}
			sleep(200 * time.Millisecond)

			var apiResponse dto.CoverAPIResponse
			if err := json.Unmarshal(body, &apiResponse); err != nil {
				log.Fatal(err)
				return
			}

			coverRes := apiResponse.Data
			for _, rel := range coverRes.Relationships {
				if rel.Type == "manga" {
					cover := CoverImage{
						ID: uuidParser(coverRes.ID),
						MangaID: uuid.NullUUID{
							UUID:  uuidParser(rel.ID),
							Valid: true,
						},
						FilePath: fmt.Sprintf("https://uploads.mangadex.org/covers/%v/%v.256.jpg", rel.ID, coverRes.Attributes.FileName),
						UploadedAt: sql.NullTime{
							Time:  coverRes.Attributes.CreatedAt,
							Valid: true,
						},
					}

					err := db_cfg.DB.InsertCoverImage(context.Background(), database.InsertCoverImageParams(cover))
					if err != nil {
						log.Fatal(err)
						return
					}
				}
			}
		}

		for _, tag := range tags {
			err := db_cfg.DB.InsertTag(context.Background(), database.InsertTagParams(tag))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		for _, manga_tag := range manga_tags {
			err := db_cfg.DB.InsertMangaTag(context.Background(), database.InsertMangaTagParams(manga_tag))
			if err != nil {
				log.Fatal(err)
				return
			}
		}

		//cleanup
		sleep(200 * time.Millisecond) // Delay after each page fetch
	}

	MigrationEnd(&migration_table)
	fmt.Println("migration ends: ", time.Now())
	fmt.Printf("migration took %v milliseconds", migration_table.MigrationEnd.Time.UnixMilli()-migration_table.MigrationBegin.Time.UnixMilli())
}
