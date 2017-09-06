package servicesLotto

import (
	"cp33/common"
	"cp33/models"
	//	"fmt"
	"strconv"
	"time"

	"github.com/go-redis/cache"
)

func GetLotteryViaGameId(gameId int) (err error, lotto models.Lottery) {
	strGameId := strconv.Itoa(gameId)
	err = common.Codec.Get("Db_lottery_id="+strGameId, &lotto)
	if err == nil {
		return
	}
	err = models.Db.Model(&lotto).Where("id=?", gameId).Limit(1).Select()
	if err == nil && lotto.Id > 0 {
		common.Codec.Set(&cache.Item{
			Key:        "Db_lottery_id=" + strGameId,
			Object:     lotto,
			Expiration: time.Hour,
		})
	}
	return
}
