package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

type gqlRequest struct{ 
	Query string `json:"query"`
}

func main() {
	saveNote :=
		`mutation {
			saveNote(content: "some note", NoteId: "1", title: "1st note") {
				title,
				content
			}
		}
        `
	saveNoteJson, err := json.Marshal(gqlRequest{saveNote})
	if err != nil {
		log.Fatal(err)
	}
	request, err := http.NewRequest(
		"POST",
		"https://fa6oyqp3mbc4jbzyc3k6yaciqq.appsync-api.us-west-2.amazonaws.com/graphql",
		bytes.NewBuffer(saveNoteJson))
	request.Header.Add("x-api-key", "da2-se5ropd4gncc3jxchyzk5oqt74")
	client := &http.Client{Timeout: 10 * time.Second}
	response, err := client.Do(request)
	defer response.Body.Close()
	if err != nil {
		fmt.Printf("The HTTP request failed with error %s\n", err)
	}
	data, _ := io.ReadAll(response.Body)
	fmt.Println(string(data))
}
