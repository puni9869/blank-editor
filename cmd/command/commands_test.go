package command

import (
	"testing"
)

func TestBlankEditorCommandsRegistered(t *testing.T) {
	if BlankEditorCommands == nil {
		t.Fatal("expected BlankEditorCommands to not be nil")
	}
}
