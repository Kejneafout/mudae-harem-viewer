package src

import (
    "archive/zip"
    "bytes"
    "errors"
    "io"
    "io/ioutil"
    "os"
    "path/filepath"
    "strings"
)

func UnzipArchive(file io.Reader) ([]byte, error) {
	// Read the entire file into memory
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	// Convert file bytes to a Reader
	fileReader := bytes.NewReader(fileBytes)

	// Extract the zip file
	zipReader, err := zip.NewReader(fileReader, int64(len(fileBytes)))
	if err != nil {
		return nil, err
	}

	uploadsDir := "./uploads"
	var jsonData []byte
	for _, zipFile := range zipReader.File {
		// Replace backslashes with slashes in file path
		filePath := filepath.Join(uploadsDir, strings.ReplaceAll(zipFile.Name, "\\", "/"))
		if !strings.HasPrefix(filePath, filepath.Clean(uploadsDir)+string(os.PathSeparator)) {
			return nil, errors.New("zip file contains invalid file path")
		}

		if zipFile.FileInfo().IsDir() {
			os.MkdirAll(filePath, 0755)
			continue
		}

		fileWriter, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
		if err != nil {
			return nil, err
		}
		defer fileWriter.Close()

		reader, err := zipFile.Open()
		if err != nil {
			return nil, err
		}
		defer reader.Close()

		_, err = io.Copy(fileWriter, reader)
		if err != nil {
			return nil, err
		}

		if filepath.Base(filePath) == "data.json" {
			// Read the content of data.json
			jsonData, err = os.ReadFile(filePath)
			if err != nil {
				return nil, err
			}
		}
	}

	if jsonData == nil {
		return nil, errors.New("data.json not found in zip archive")
	}

	return jsonData, nil
}