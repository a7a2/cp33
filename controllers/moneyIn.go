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

func PostMoneyIn(ctx iris.Context) { //POST提交的充值请求
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
	fmt.Println(result)
	if result.Code != 200 {
		ctx.JSON(&result)
		return
	}
	uri := fmt.Sprintf("%s/%d/%s/%.3f", models.GateWayMoneyUrl, result.Data.(*models.MoneyIns).Channel, result.Data.(*models.MoneyIns).PayAccount, result.Data.(*models.MoneyIns).Money)
	fmt.Println(uri)
	common.HttpClient4Pay(&uri)
	ctx.JSON(&result)
}
