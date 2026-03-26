package command

import (
	"testing"

	"github.com/urfave/cli"
)

func TestStartCommandName(t *testing.T) {
	if startCommand.Name != "start" {
		t.Errorf("expected command name 'start', got '%s'", startCommand.Name)
	}
}

func TestStartCommandUsage(t *testing.T) {
	expected := "Start the Blank Editor server"
	if startCommand.Usage != expected {
		t.Errorf("expected usage '%s', got '%s'", expected, startCommand.Usage)
	}
}

func TestStartCommandHasHostFlag(t *testing.T) {
	if len(startCommand.Flags) == 0 {
		t.Fatal("expected start command to have flags")
	}

	flag, ok := startCommand.Flags[0].(cli.StringFlag)
	if !ok {
		t.Fatal("expected first flag to be a StringFlag")
	}

	if flag.Name != "host" {
		t.Errorf("expected flag name 'host', got '%s'", flag.Name)
	}

	if flag.Value != "0.0.0.0" {
		t.Errorf("expected default host '0.0.0.0', got '%s'", flag.Value)
	}
}

func TestStartCommandHasPortFlag(t *testing.T) {
	if len(startCommand.Flags) < 2 {
		t.Fatal("expected start command to have at least 2 flags")
	}

	flag, ok := startCommand.Flags[1].(cli.StringFlag)
	if !ok {
		t.Fatal("expected second flag to be a StringFlag")
	}

	if flag.Name != "port, p" {
		t.Errorf("expected flag name 'port, p', got '%s'", flag.Name)
	}

	if flag.Value != "8080" {
		t.Errorf("expected default port '8080', got '%s'", flag.Value)
	}
}

func TestStartCommandActionNotNil(t *testing.T) {
	if startCommand.Action == nil {
		t.Fatal("expected start command action to not be nil")
	}
}
