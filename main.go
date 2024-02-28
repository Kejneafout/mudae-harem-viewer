package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"

	"mudae-harem-viewer/src"
)

const PORT = ":3000"
const uploadDir = "./uploads"

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/", serveHTMLForm).Methods("GET")
	r.HandleFunc("/upload", src.HandleFileUpload).Methods("POST")
	r.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir(uploadDir))))
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("public"))))

	http.Handle("/", r)

	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		fmt.Println("Error creating uploads directory:", err)
		return
	}

	fmt.Println("Server is running on port", PORT)
	http.ListenAndServe(PORT, nil)
}

func serveHTMLForm(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./public/index.html")
}
