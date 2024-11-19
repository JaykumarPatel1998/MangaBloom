module github.com/JaykumarPatel1998/MangaBloom/api

go 1.23.3

replace github.com/JaykumarPatel1998/MangaBloom/seeder v1.0.0 => ../seeder

require (
	github.com/JaykumarPatel1998/MangaBloom/seeder v1.0.0
	github.com/google/uuid v1.6.0
	github.com/gorilla/mux v1.8.1
	github.com/joho/godotenv v1.5.1
	github.com/lib/pq v1.10.9
)
