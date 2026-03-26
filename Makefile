APP_NAME := blank-editor
CMD_DIR := cmd
PKG := github.com/puni9869/blank-editor
BUILD_DIR := build
VERSION ?= development

.PHONY: all build run test clean fmt vet lint build-frontend watch-frontend production

all: fmt vet test build

build: build-frontend
	@echo "Building $(APP_NAME)..."
	@mkdir -p $(BUILD_DIR)
	go build -ldflags "-s -w -X main.version=$(VERSION)" -o $(BUILD_DIR)/$(APP_NAME) ./$(CMD_DIR)

run: build
	@./$(BUILD_DIR)/$(APP_NAME) start

build-frontend:
	pnpm run build

test:
	@echo "Running tests..."
	go test ./... -v

clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR) dist

fmt:
	@echo "Formatting..."
	go fmt ./...

vet:
	@echo "Vetting..."
	go vet ./...

lint:
	@echo "Linting..."
	golangci-lint run ./...

watch-frontend:
	@echo "Starting frontend dev server..."
	pnpm dev

production: VERSION := $(shell git describe --tags --always --dirty 2>/dev/null || echo "unknown")
production: build-frontend
	@echo "Building production $(APP_NAME) $(VERSION)..."
	@mkdir -p $(BUILD_DIR)
	CGO_ENABLED=0 go build -trimpath -ldflags "-s -w -X main.version=$(VERSION)" -o $(BUILD_DIR)/$(APP_NAME) ./$(CMD_DIR)
	@echo "Binary: $(BUILD_DIR)/$(APP_NAME) ($(VERSION))"
