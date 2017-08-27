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
