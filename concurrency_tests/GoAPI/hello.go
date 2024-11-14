package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
)

var db *sql.DB

type Manga struct {
	ID               uuid.UUID      `json:"id"`
	Title            sql.NullString `json:"title"`
	Description      sql.NullString `json:"description"`
	OriginalLanguage sql.NullString `json:"original_language"`
	LastVolume       sql.NullString `json:"last_volume"`
	LastChapter      sql.NullString `json:"last_chapter"`
	Demographic      sql.NullString `json:"demographic"`
	Status           sql.NullString `json:"status"`
	Year             sql.NullInt64  `json:"year"`
	ContentRating    sql.NullString `json:"content_rating"`
	State            sql.NullString `json:"state"`
	IsLocked         sql.NullBool   `json:"is_locked"`
	ChapterReset     sql.NullBool   `json:"chapter_reset"`
	CreatedAt        sql.NullTime   `json:"created_at"`
	UpdatedAt        sql.NullTime   `json:"updated_at"`
	Version          sql.NullInt64  `json:"version"`
}

func init() {
	connection_string := "postgres://postgres:password@localhost:5432/postgres?sslmode=disable"

	var err error
	db, err = sql.Open("postgres", connection_string)

	if err != nil {
		log.Fatal("database connection error : ", err)
	}

	db.SetMaxOpenConns(10)
	db.SetConnMaxLifetime(0)
	db.SetMaxIdleConns(5)

	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database at the moment : ", err)
	}
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("select * from manga")

		if err != nil {
			log.Fatal("Failed to query database", err)
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			return
		}

		defer rows.Close()

		var mangas []Manga

		for rows.Next() {
			var manga Manga

			err := rows.Scan(
				&manga.ID,
				&manga.Title,
				&manga.Description,
				&manga.OriginalLanguage,
				&manga.LastVolume,
				&manga.LastChapter,
				&manga.Demographic,
				&manga.Status,
				&manga.Year,
				&manga.ContentRating,
				&manga.State,
				&manga.IsLocked,
				&manga.ChapterReset,
				&manga.CreatedAt,
				&manga.UpdatedAt,
				&manga.Version,
			)

			if err != nil {
				log.Fatal("Failed to scan rows", err)
				http.Error(w, "Failed to scan rows", http.StatusInternalServerError)
				return
			}

			mangas = append(mangas, manga)
		}

		if err := rows.Err(); err != nil {
			log.Fatal("Error iterating over rows", err)
			http.Error(w, "Error iterating over rows", http.StatusInternalServerError)
			return
		}

		w.Header().Add("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(mangas)

		if err != nil {
			log.Fatal("Error while encoding to json : ", err)
			http.Error(w, "Error while encoding to json : ", http.StatusInternalServerError)
			return
		}

	})

	log.Println("started listening on :5000")
	err := http.ListenAndServe(":5000", nil)
	if err != nil {
		log.Fatal("Failed to start http server", err)
	}
}
