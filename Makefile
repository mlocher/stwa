SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

.PHONY: clean serve functions build preview

clean:
	rm -rf dist/*

serve: clean
	hugo server --watch --verbose --buildDrafts --buildFuture

functions:
	cd functions; mkdir -p dist; go get ./...; go build -o dist/stwa ./...

build: clean functions
	hugo --destination ./dist/ --gc --minify --verbose

preview: clean functions
	hugo --destination ./dist/ --gc --minify --buildFuture --verbose --baseURL "${DEPLOY_PRIME_URL}"