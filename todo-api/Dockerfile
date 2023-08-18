FROM golang:latest

WORKDIR /app
COPY . /app

RUN go mod init github.com/fcmdias/plan
RUN go mod tidy
RUN go build -o main .

CMD ["./main"]
