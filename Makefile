build:
	mkdir -p functions
	cd src
	go get ./...
	go build -o ../functions/stwa ./...
