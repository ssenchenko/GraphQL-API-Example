package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

type MyEvent struct {
	Source `json:"context"`
}

type Source struct {
	Name string `json:"name"`
}

func handler(event MyEvent) (string, error) {
	return fmt.Sprintf("Hello %s!", event.Source.Name), nil
}

func main() {
	lambda.Start(handler)
}
