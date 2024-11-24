package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

func fetchAndSaveImage(imageURL, filePath string) {
	// Check if the file already exists
	if _, err := os.Stat(filePath); err == nil {
		// File exists, no need to download
		return
	} else if !os.IsNotExist(err) {
		// If the error is not "file does not exist", log it
		log.Printf("Error checking file: %v", err)
		return
	}

	time.Sleep(time.Millisecond * 200)

	// Create the directory if it doesn't exist
	err := os.MkdirAll(filepath.Dir(filePath), 0755)
	if err != nil {
		log.Printf("Error creating directory: %v", err)
		return
	}

	// Fetch the image
	resp, err := http.Get(imageURL)
	if err != nil {
		log.Printf("Error fetching image: %v", err)
		return
	}
	defer resp.Body.Close()

	// Create the file to save the image
	file, err := os.Create(filePath)
	if err != nil {
		log.Printf("Error creating file: %v", err)
		return
	}
	defer file.Close()

	// Copy the image data to the file
	_, err = io.Copy(file, resp.Body)
	if err != nil {
		log.Printf("Error saving image: %v", err)
	}
}
