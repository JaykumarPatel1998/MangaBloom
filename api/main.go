package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/JaykumarPatel1998/MangaBloom/rss-aggregator/internal/database"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

type apiConfig struct {
	DB *database.Queries
}

func main() {
	fmt.Println("Hello form RSS aggregator v2")

	godotenv.Load(".env")

	port := os.Getenv("PORT")
	db_url := os.Getenv("DB_URL")

	if db_url == "" {
		log.Fatal("DB_URL is not found in the environment")
	}

	if port == "" {
		log.Fatal("PORT is not found in the environment")
	}

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	v1Router := chi.NewRouter()
	v1Router.Get("/ready", handlerReadiness)
	v1Router.Get("/err", handlerError)

	router.Mount("/v1", v1Router)

	server := &http.Server{
		Handler: router,
		Addr:    ":" + port,
	}

	log.Printf("server starting on port %v", port)
	err := server.ListenAndServe()
	if err != nil {
		log.Fatal("Error detected while starting server ", err)
	}

}
