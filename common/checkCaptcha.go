package common

import (
	"cp33/models"
	"fmt"

	"github.com/kataras/iris"
)

func CheckCaptcha(ctx iris.Context, s string) bool { //等待实现分布式验证码 有时间
	defer delete(models.MapCaptcha, ctx.RemoteAddr())
	if !(models.MapCaptcha[ctx.RemoteAddr()] == s && s != "") {
		_, err := ctx.JSON(models.Result{Code: 403, Message: "验证码错误!", Data: nil})
		if err != nil {
			fmt.Println(err.Error())
		}
		return false
	}
	return true
}
