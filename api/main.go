package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	handler "github.com/JaykumarPatel1998/MangaBloom/api/handlers"
	"github.com/JaykumarPatel1998/MangaBloom/seeder/database"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // PostgreSQL driver
)

type apiConfig struct {
	DB *database.Queries
}

func main() {

	godotenv.Load(".env")

	// getting the env variables
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("port is not found in the environment")
	}
	db_url := os.Getenv("DB_URL")
	if db_url == "" {
		log.Fatal("db url is not found in the environment")
	}

	conn, err := sql.Open("postgres", db_url)
	if err != nil {
		log.Fatal("cannot establish a conenction to postgres", err)
	}

	api_config := ApiConfig{
		DB: database.New(conn),
	}

	r := mux.NewRouter()

	r.Use(mux.CORSMethodMiddleware(r))
	r.HandleFunc("/manga/{id}", handler.GetMangaByIdHandler)
	http.Handle("/", r)
}
