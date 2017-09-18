package controllers

import (
	"fmt"
	//	"cp33/models"
	//"cp33/services/lotto"
	//"github.com/go-pg/pg"
	"github.com/kataras/iris"
)

func MoneyInNotice(ctx iris.Context) {
	//	issue, _ := ctx.Params().GetInt("issue")
	//	gameId, _ := ctx.Params().GetInt("gameID")
	//	result := servicesLotto.OpenInfo(gameId)
	//	BroadcastSame(&models.WsConn, &gameId, &gameId, &result)
	fmt.Println("moneyInNotice:", ctx.RequestPath(true))
	//	servicesLotto.EndLottery(gameId, issue, ctx.RemoteAddr())

}
