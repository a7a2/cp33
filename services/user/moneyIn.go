package services

import (
	"cp33/models"
	"fmt"
	//	"fmt"

	"time"

	//"github.com/go-pg/pg"
)

func PostMoneyIn(uid *int, pmi *models.PostMoneyIn) (result models.Result) {
	//之前提交的同1通道同金额的充值还未完成的10分钟内不可重复提交
	tD, _ := time.ParseInLocation("2006-01-02 15:04:05", time.Now().Add(-time.Minute*10).Format("2006-01-02 15:04:05"), time.Local)
	//tt, _ := time.Parse("2006-01-02 15:04:05", time.Now().Add(-time.Minute*10).Format("2006-01-02 15:04:05"))
	//	fmt.Println(tt)
	var mi models.MoneyIns
	err := models.Db.Model(&mi).Where("is_delete=false and uid=? and channel=? and money=? and pay_account=? and success=false and ctime<?", *uid, (*pmi).Channel, (*pmi).Money, (*pmi).PayAccount, tD).Limit(1).Select()
	//	if err != nil {
	//		result = models.Result{Code: 500, Message: err.Error(), Data: nil}
	//		return
	//	}

	fmt.Println(mi.Ctime)
	if mi.Id > 0 {
		result = models.Result{Code: 501, Message: "你之前10分钟内提交的充值还未支付请勿再次提交！", Data: nil}
		return
	}

	ctime, _ := time.ParseInLocation("2006-01-02 15:04:05", time.Now().Format("2006-01-02 15:04:05"), time.Local)
	mi = models.MoneyIns{
		Uid:        *uid,
		Channel:    (*pmi).Channel,
		Money:      (*pmi).Money,
		PayAccount: (*pmi).PayAccount,
		IsDelete:   false,
		Success:    false,
		Ctime:      ctime,
	}
	err = models.Db.Insert(&mi)
	if err != nil {
		result = models.Result{Code: 500, Message: err.Error(), Data: nil}
		return
	}
	//models.Db.Delete(&mi)
	result = models.Result{Code: 200, Message: "登陆你的支付宝进行支付", Data: &mi}
	return
}
