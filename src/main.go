package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func seedDatabase() {

	godotenv.Load(".env")
	db_url := os.Getenv("DB_URL")
	if db_url == "" {
		log.Fatal("msising db_url")
	}

	var err error
	db, err = sql.Open("postgres", db_url)
	if err != nil {
		log.Fatalf("failed to connect to database : %v", err)
	}

	db.SetMaxOpenConns(20)
	db.SetConnMaxLifetime(0)
	db.SetMaxIdleConns(5)

	var migration_table MigrationTable
	fmt.Println("migration starts: ", migration_table)
	MigrationStart(&migration_table)
	MigrationEnd(&migration_table)
	fmt.Println("migration ends: ", migration_table)
	fmt.Printf("migration took %v milliseconds", migration_table.MigrationEnd.Time.UnixMilli()-migration_table.MigrationBegin.Time.UnixMilli())
}

func main() {
	seedDatabase()
}
