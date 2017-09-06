package services

import (
	"cp33/models"

	"fmt"

	"github.com/go-pg/pg"
)

func CoinLog(coinLog *models.CoinLog, tx *pg.Tx) {
	err := tx.Insert(coinLog)
	if err != nil {
		fmt.Println(err.Error())
		tx.Rollback()
		return
	}
}

func AccountDetail(pAD *models.PostAccountDetail, platform, username string) (result models.Result) {
	strSql := fmt.Sprintf("uid=%v ", GetUid(platform, username))
	switch pAD.DataType {
	case 0: //0 全部
		break
	default:
		strSql = fmt.Sprintf(" %s%s%v", strSql, " and liq_type=", pAD.DataType)
	}

	us := []models.CoinLog{}
	total, err := models.Db.Model(&us).Where(strSql).Limit(20).Offset((pAD.PageIndex - 1) * 20).Order("id DESC").SelectAndCount()
	if err != nil {
		result = models.Result{Code: 500, Message: err.Error(), Data: nil}
		return
	}

	out := map[string]interface{}{"RecordCount": len(us), "PageCount": total / 20, "Records": &us}
	result = models.Result{Code: 200, Message: "ok", Data: &out}
	return
}
