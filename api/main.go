package main

import (
	"database/sql"

	"github.com/JaykumarPatel1998/MangaBloom/seeder/database" // Replace with the actual path to your sqlc-generated package

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"
)

// Database setup (replace with your own connection details)
func setupDB() (*sql.DB, error) {
	connStr := "postgres://postgres:password@localhost:5432/postgres?sslmode=disable"
	return sql.Open("postgres", connStr)
}

func main() {
	// Initialize the database
	db, err := setupDB()
	if err != nil {
		panic("Failed to connect to the database: " + err.Error())
	}
	defer db.Close()

	queries := database.New(db)

	// Initialize Echo
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// cors middleware
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{
			"http://localhost:5173", // Adjust to match the URL of your React frontend
			// You can add more origins if needed, e.g., "https://your-frontend.com"
		},
		AllowMethods: []string{
			echo.GET,
			echo.POST,
			echo.PUT,
			echo.DELETE,
			echo.OPTIONS,
		},
		AllowHeaders: []string{
			echo.HeaderContentType,
			echo.HeaderAccept,
		},
	}))

	// Define routes
	e.GET("/mangas", func(c echo.Context) error {
		return handleGetPaginatedMangas(c, queries)
	})

	// Start the server
	e.Logger.Fatal(e.Start(":3000"))
}
