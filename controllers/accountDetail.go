package controllers

import (
	"cp33/models"
	"cp33/services/user"
	"fmt"

	"github.com/kataras/iris"
)

func AccountDetail(ctx iris.Context) {
	b := Base{ctx}
	if b.CheckIsLogin() == false {
		ctx.JSON(models.Result{Code: 888, Message: "未登陆！", Data: nil})
		return
	}

	var postAccountDetail models.PostAccountDetail
	var err error

	err = ctx.ReadForm(&postAccountDetail)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	var result models.Result
	result = services.AccountDetail(&postAccountDetail, ctx.GetCookie("platform"), ctx.GetCookie("username"))
	ctx.JSON(&result)
}
