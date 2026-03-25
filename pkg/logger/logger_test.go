package logger

import (
	"testing"

	"github.com/sirupsen/logrus"
)

func TestNewLogger(t *testing.T) {
	log := NewLogger()

	if log == nil {
		t.Fatal("expected logger to not be nil")
	}

	if log != logrus.StandardLogger() {
		t.Error("expected logger to be the standard logrus instance")
	}
}
