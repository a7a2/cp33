package controllers

import (
	"cp33/common"
	"cp33/models"
	"cp33/services/user"
	"fmt"

	"github.com/kataras/iris"
)

func MoneyInNotice(ctx iris.Context) {

}

func PostMoneyIn(ctx iris.Context) {
	b := Base{ctx}
	if b.CheckIsLogin() == false {
		ctx.JSON(models.Result{Code: 503, Message: "未登陆！", Data: nil})
		return
	}

	var pmi models.PostMoneyIn
	var err error

	err = ctx.ReadForm(&pmi)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	strPlatform := ctx.GetCookie("platform")
	username := ctx.GetCookie("username")
	uid := services.GetUidViaPlatformAndUsername(&strPlatform, &username)
	var result models.Result
	result = services.PostMoneyIn(uid, &pmi)
	if result.Code != 200 {
		ctx.JSON(&result)
		return
	}
	uri := fmt.Sprintf("%d/%s/%.3f", result.Data.(models.MoneyIn).Channel, result.Data.(models.MoneyIn).PayAccount, result.Data.(models.MoneyIn).Money)
	common.HttpClient4Pay(&uri)
	ctx.JSON(&result)
}
