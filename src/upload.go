package src

import (
	"net/http"
)

func HandleFileUpload(w http.ResponseWriter, r *http.Request) {
	// Parse the multipart form data
	err := r.ParseMultipartForm(0) // 0 means no file size limit
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	// Get the uploaded file
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Unable to get file from form", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Call the function to unzip the archive
	jsonData, err := UnzipArchive(file)
	if err != nil {
		http.Error(w, "Unable to unzip archive: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the content of data.json
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}