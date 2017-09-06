package controllers

import (
	"cp33/models"
	"cp33/services/lotto"
	//"github.com/go-pg/pg"
	"github.com/kataras/iris"
)

func DataInNotice(ctx iris.Context) {
	issue, _ := ctx.Params().GetInt("issue")
	gameId, _ := ctx.Params().GetInt("gameID")
	_, result := servicesLotto.OpenInfo(gameId)
	BroadcastSame(models.WsConn, string(gameId), "1", &result)
	//fmt.Println("DataInNotice  gameId:", gameId, "	issue:", issue)
	servicesLotto.EndLottery(gameId, issue, ctx.RemoteAddr())
}
