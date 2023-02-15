package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"
)

type gqlRequest struct {
	Query string `json:"query"`
}

func main() {
	const kUrl string = "https://fa6oyqp3mbc4jbzyc3k6yaciqq.appsync-api.us-west-2.amazonaws.com/graphql"
	const kApiKey string = "da2-se5ropd4gncc3jxchyzk5oqt74"
	response, err := getNote(kUrl, kApiKey)
	if err != nil {
		log.Fatal(err)
	}
	defer response.Body.Close()
	data, _ := io.ReadAll(response.Body)
	log.Println(string(data))
}

func saveNote(url string, apiKey string) (*http.Response, error) {
	const saveNote string = `mutation {
		saveNote(content: "some note", NoteId: "2", title: "1st note") {
			title,
			content
		}
	}`
	return makeRequest(saveNote, url, apiKey)
}

func getNote(url string, apiKey string) (*http.Response, error) {
	const getNote string = `query {
		getNote(NoteId: "2") {
			title
			content
		}
	}`
	return makeRequest(getNote, url, apiKey)
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
