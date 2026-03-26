/*
Copyright (c) 2025 Blank Editor. All rights reserved.

	This program is free software: you can redistribute it and/or modify
	it under Version 3 of the GNU General Public License (the "GPL"):

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
*/
package main

import (
	"os"

	"github.com/puni9869/blank-editor/cmd/command"
	"github.com/puni9869/blank-editor/pkg/logger"
	"github.com/urfave/cli"
)

const version = "development"

const appName = "Blank Editor"
const appAbout = "Blank Editor®"
const appEdition = "ce"
const appDescription = "Blank Editor is a minimal, distraction-free text editor."
const appCopyright = "(c) 2025 Blank Editor. All rights reserved."

// Metadata contains build specific information.
var Metadata = map[string]interface{}{
	"Name":        appName,
	"About":       appAbout,
	"Edition":     appEdition,
	"Description": appDescription,
	"Version":     version,
}

func main() {
	log := logger.NewLogger()
	defer func() {
		if r := recover(); r != nil {
			log.Errorf("panic recovered: %v", r)
			os.Exit(1)
		}
	}()

	app := cli.NewApp()
	app.Usage = appAbout
	app.Description = appDescription
	app.Version = version
	app.Copyright = appCopyright
	app.Commands = command.BlankEditorCommands
	app.EnableBashCompletion = true
	if err := app.Run(os.Args); err != nil {
		log.Error(err)
	}
}
