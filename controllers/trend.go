package controllers

import (
	"cp33/models"
	"cp33/services/lotto"
	"fmt"

	"github.com/kataras/iris"
)

func PostTrend(ctx iris.Context) {
	//	b := Base{ctx}
	//	if b.CheckIsLogin() == false {
	//		ctx.JSON(models.Result{Code: 503, Message: "未登陆！", Data: nil})
	//		return
	//	}

	var t models.Trend
	var err error

	err = ctx.ReadForm(&t)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	var result models.Result
	result = servicesLotto.Trend(&t)
	ctx.JSON(&result)
}
