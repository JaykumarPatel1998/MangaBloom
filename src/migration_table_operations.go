package main

import (
	"database/sql"
	"log"
	"time"
)

func MigrationStart(migration_table *MigrationTable) {
	rows, err := db.Query("INSERT INTO migration_table(migration_begin) VALUES($1) RETURNING *;", time.Now().UTC())
	if err != nil {
		log.Fatal("could not start the migration", err)
	}
	defer rows.Close()
	handleRowScanning(rows, migration_table)
}

func MigrationEnd(migration_table *MigrationTable) {
	rows, err := db.Query("UPDATE migration_table SET migration_end = $1 WHERE id = $2 RETURNING *;", time.Now().UTC(), migration_table.ID)
	if err != nil {
		log.Fatal("could not end the migration", err)
	}
	defer rows.Close()
	handleRowScanning(rows, migration_table)
}

func handleRowScanning(rows *sql.Rows, migration_table *MigrationTable) {
	for rows.Next() {
		err := rows.Scan(&migration_table.ID, &migration_table.MigrationBegin, &migration_table.MigrationEnd)
		if err != nil {
			log.Fatal(err)
		}
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
}
