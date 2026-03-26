package server

import (
	"io/fs"
	"net/http"

	blankeditor "github.com/puni9869/blank-editor"
)

// NewMux builds and returns the application router with all routes registered.
func NewMux() *http.ServeMux {
	mux := http.NewServeMux()

	distContent, err := fs.Sub(blankeditor.DistFS, "dist")
	if err != nil {
		panic("failed to load embedded dist: " + err.Error())
	}

	assetsContent, err := fs.Sub(blankeditor.AssetsFS, "assets")
	if err != nil {
		panic("failed to load embedded assets: " + err.Error())
	}

	// Favicons with long cache
	mux.Handle("/favicon/", CacheControl(http.FileServer(http.FS(assetsContent)), "public, max-age=604800, immutable"))

	// SEO files
	mux.HandleFunc("/robots.txt", serveFile(assetsContent, "robots.txt"))
	mux.HandleFunc("/sitemap.xml", serveFile(assetsContent, "sitemap.xml"))

	// Vite hashed assets — aggressive caching
	distServer := http.FileServer(http.FS(distContent))
	mux.Handle("/assets/", CacheControl(distServer, "public, max-age=31536000, immutable"))

	// HTML shell — no cache
	mux.Handle("/", NoCacheHTML(distServer))

	return mux
}

func serveFile(fsys fs.FS, name string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFileFS(w, r, fsys, name)
	}
}
