package blankeditor

import "embed"

//go:embed all:dist
var DistFS embed.FS

//go:embed all:assets
var AssetsFS embed.FS
