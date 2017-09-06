package controllers

import (
	"cp33/models"
	"cp33/services/lotto"
	"fmt"

	"github.com/kataras/iris"
)

func BetList(ctx iris.Context) {
	b := Base{ctx}
	if b.CheckIsLogin() == false {
		ctx.JSON(models.Result{Code: 503, Message: "未登陆！", Data: nil})
		return
	}

	var bl models.AjaxBetList
	var err error

	err = ctx.ReadForm(&bl)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	var result models.Result
	result = servicesLotto.BetList(&bl, ctx.GetCookie("platform"), ctx.GetCookie("username"))
	ctx.JSON(&result)
}
