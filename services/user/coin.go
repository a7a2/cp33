package services

import (
	"cp33/models"
	"fmt"

	"github.com/go-pg/pg"
)

func CoinChangeByUid(uid int, coin float64, tx *pg.Tx) float64 {
	var member models.Members
	_, err := tx.Model(&member).Set("coin=coin+?", coin).Where("uid=?", uid).Returning("coin").Update()
	if err != nil {
		fmt.Println(err.Error())
		tx.Rollback()
		return 0.000
	}
	return member.Coin
}
