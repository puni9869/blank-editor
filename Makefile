APP_NAME := blank-editor
CMD_DIR := cmd
PKG := github.com/puni9869/blank-editor
BUILD_DIR := build
VERSION ?= development

.PHONY: all build run test clean fmt vet lint

all: fmt vet test build

build:
	@echo "Building $(APP_NAME)..."
	@mkdir -p $(BUILD_DIR)
	go build -ldflags "-s -w -X main.version=$(VERSION)" -o $(BUILD_DIR)/$(APP_NAME) ./$(CMD_DIR)

run: build
	@./$(BUILD_DIR)/$(APP_NAME) start

test:
	@echo "Running tests..."
	go test ./... -v

clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)

fmt:
	@echo "Formatting..."
	go fmt ./...

vet:
	@echo "Vetting..."
	go vet ./...

lint:
	@echo "Linting..."
	golangci-lint run ./...
