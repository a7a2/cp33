package controllers

import (
	"github.com/kataras/iris/websocket"
)

var WsConn map[websocket.Connection]bool
var ChanDbChange = make(chan int, 10)

func init() {
	WsConn = make(map[websocket.Connection]bool)
	ChanDbChange <- 1
	getCacheViaDb()
}

func getCacheViaDb() {
	select {
	case <-ChanDbChange:

	}
}
