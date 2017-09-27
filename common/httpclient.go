package common

import (
	"net/http"
)

func HttpClient4Pay(uri *string) *error { //充值信息提交到第三方支付系统
	client := &http.Client{}
	url := "http://127.0.0.1:8081/" //支付系统网址
	request, err := http.NewRequest("GET", url+(*uri), nil)
	request.Header.Set("Connection", "close")
	if err != nil {
		return &err
	}
	_, err = client.Do(request)
	return &err
}
