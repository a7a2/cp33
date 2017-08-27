package dataIn

import (
	"fmt"
	"lotto/models"

	"gopkg.in/kataras/iris.v6"
	"gopkg.in/pg.v5"
)

func Bjpk10(ctx *iris.Context) {
	var s models.Bjpk10
	var err error
	err = ctx.ReadForm(&s)
	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(iris.StatusOK, models.Result{200, "格式错误！", nil})
		return
	}

	var result models.Result
	err, result = Bjpk10_ToDB(&s)
	if err != nil {
		fmt.Println(err.Error())
	}
	ctx.JSON(iris.StatusOK, result)
}

func Bjpk10_ToDB(u *models.Bjpk10) (err error, result models.Result) {
	var tx *pg.Tx
	tx, err = models.Db.Begin()
	if err != nil {
		result = models.Result{Code: 500, Message: err.Error(), Data: nil}
		return
	}

	//var stmt *pg.Stmt
	err = tx.Insert(&u)
	if err != nil {
		fmt.Println(err.Error())
		result = models.Result{Code: 600, Message: "数据库错误!", Data: &u}
		return
	}
	defer tx.Rollback()
	err = tx.Commit()
	if err != nil {
		fmt.Println(err.Error())
		result = models.Result{Code: 600, Message: "数据库错误!", Data: &u}
		return
	}
	result = models.Result{Code: 200, Message: "ok", Data: nil}
	return
}
