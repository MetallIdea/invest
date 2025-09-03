package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type RequestParams struct {
	Method  string
	Url     string
	Body    string
	Headers map[string]string
}

func Request[T interface{}](params RequestParams) T {
	bodyBytes := []byte(params.Body)

	req, err := http.NewRequest(params.Method, params.Url, bytes.NewBuffer(bodyBytes))
	if err != nil {
		fmt.Println("Error in request:", err)
	}

	for key := range params.Headers {
		req.Header.Add(key, params.Headers[key])
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("No response from request", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var result T
	if err := json.Unmarshal(body, &result); err != nil { // Parse []byte to go struct pointer
		fmt.Println("Can not unmarshal JSON", err)
	}

	return result
}