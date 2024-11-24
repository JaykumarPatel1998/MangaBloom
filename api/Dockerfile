FROM golang:1.23-alpine

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./ 
RUN go mod download

# Copy the source code and Dockerfile
COPY *.go ./ 
COPY Dockerfile ./ 
COPY .env ./ 
COPY ca.pem ./ 

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-gs-ping

# Create the covers directory in the container
RUN mkdir -p /app/covers

# Expose the port the app will run on
EXPOSE 8080

# Define the volume for covers directory
VOLUME /app/covers

# Run the Go application
CMD ["/docker-gs-ping"]
