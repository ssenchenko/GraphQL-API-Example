package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
)

type gqlRequest struct {
	Query string `json:"query"`
}

func main() {
	lambda.Start(handler)
}

func handler(event any) (gqlResponse string, err error) {
	const kGetNote string = `query {
		getNote(NoteId: "2") {
			title
			content
		}
	}`
	url := os.Getenv("GRAPHQL_URL")
	apiKey := os.Getenv("API_KEY")
	var response *http.Response
	response, err = makeRequest(kGetNote, url, apiKey)
	if err != nil {
		return
	}
	defer response.Body.Close()
	data, _ := io.ReadAll(response.Body)
	gqlResponse = string(data)
	log.Println(gqlResponse)
	return
}

func makeRequest(graphQl string, url string, apiKey string) (response *http.Response, err error) {
	json, err := json.Marshal(gqlRequest{graphQl})
	if err != nil {
		return
	}
	request, err := http.NewRequest("POST", url, bytes.NewBuffer(json))
	if err != nil {
		return
	}
	request.Header.Add("x-api-key", apiKey)
	client := &http.Client{Timeout: 10 * time.Second}
	response, err = client.Do(request)
	return
}
