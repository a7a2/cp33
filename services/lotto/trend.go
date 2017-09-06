package servicesLotto

import (
	"cp33/models"
	//	"errors"
	//	"fmt"
	//	"strconv"
	//	"time"
)

func Trend(t *models.Trend) (result models.Result) { //未完成
	us := []models.Data{}
	err := models.Db.Model(&us).Where("type=", t.Gid).Order("issue DESC").Offset(t.Count).Limit(t.Count).Select()
	if err != nil {
		result = models.Result{Code: 500, Message: err.Error(), Data: nil}
		return
	}

	for i := 0; i < len(us); i++ {

		result = models.Result{Code: 200, Message: "ok", Data: &us}
		return
	}

	//	err = models.Db.Model(&us).Where(strSql).Limit(20).Offset((bl.PageIndex - 1) * 20).Order("id DESC").Select()
	//	if err != nil {
	//		result = models.Result{Code: 500, Message: err.Error(), Data: nil}
	//		return
	//	}
	//	out := map[string]interface{}{"PageCount": total / 20, "Records": &us}
	//	result = models.Result{Code: 200, Message: "ok", Data: &out}
	return
}
