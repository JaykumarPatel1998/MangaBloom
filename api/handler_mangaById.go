package main

import (
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func (apiConfig *apiConfig) GetMangaByIdHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id_string := vars["id"]
	id, err := uuid.Parse(id_string)

	if err != nil {
		log.Fatal(err)
	}
}
