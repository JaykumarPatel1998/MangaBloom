package main

import (
	"database/sql"
	"fmt"
	"html/template"
	"log"
	"net/http"

	_ "github.com/lib/pq" // PostgreSQL driver

	"github.com/JaykumarPatel1998/MangaBloom/seeder/database"
)

var db *sql.DB

// Template for the home page
const homePageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manga List</title>
</head>
<body>
    <h1>Manga List</h1>
    <ul>
        {{range .}}
        <li>
            <h2>{{.Title}} ({{.Year}})</h2>
            <p>Original Language: {{.OriginalLanguage}}</p>
            <p>Status: {{.Status}}</p>
            <p>Alternate Titles: {{.AlternateTitles}}</p>
            <p>Authors: {{.Authors}}</p>
            <p>Artists: {{.Artists}}</p>
        </li>
        {{end}}
    </ul>
</body>
</html>
`

// MangaData holds the data for rendering the template
type MangaData struct {
	Title            sql.NullString
	OriginalLanguage sql.NullString
	Status           sql.NullString
	Year             sql.NullInt32
	AlternateTitles  string
	Authors          string
	Artists          string
}

func StringFromBytes(data []byte) string {
	if data == nil {
		return "N/A" // Default for NULL
	}
	return string(data)
}

func main() {
	// Connect to the database
	connStr := "postgres://postgres:password@localhost:5432/postgres?sslmode=disable"
	dbConn, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Unable to connect to the database: %v", err)
	}
	defer dbConn.Close()

	queries := database.New(dbConn)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Fetch manga details
		mangaList, err := queries.GetMangaDetails(r.Context())
		if err != nil {
			http.Error(w, "Failed to fetch manga data", http.StatusInternalServerError)
			log.Printf("Query error: %v", err)
			return
		}

		// Map the database results into MangaData
		var mangaData []MangaData
		for _, manga := range mangaList {
			mangaData = append(mangaData, MangaData{
				Title:            manga.MangaTitle,
				OriginalLanguage: manga.OriginalLanguage,
				Status:           manga.Status,
				Year:             manga.Year,
				AlternateTitles:  StringFromBytes(manga.AlternateTitles),
				Authors:          StringFromBytes(manga.AuthorNames),
				Artists:          StringFromBytes(manga.ArtistNames),
			})
		}

		// Render the template
		tmpl, err := template.New("home").Parse(homePageHTML)
		if err != nil {
			http.Error(w, "Failed to render template", http.StatusInternalServerError)
			log.Printf("Template parsing error: %v", err)
			return
		}

		w.Header().Set("Content-Type", "text/html")
		if err := tmpl.Execute(w, mangaData); err != nil {
			http.Error(w, "Failed to render template", http.StatusInternalServerError)
			log.Printf("Template execution error: %v", err)
			return
		}
	})

	// Start the server
	fmt.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
