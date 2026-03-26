// Package command provides CLI commands for Blank Editor.
package command

import (
	"github.com/urfave/cli"
)

// BlankEditorCommands contains all registered CLI commands.
var BlankEditorCommands = []cli.Command{startCommand}
