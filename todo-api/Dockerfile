FROM golang:latest

WORKDIR /app
COPY . /app

RUN go mod tidy
RUN go build -o main .

CMD ["./main"]
