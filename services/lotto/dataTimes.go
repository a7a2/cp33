package servicesLotto

import (
	"cp33/common"
	"cp33/models"
	"strconv"
	"time"

	"github.com/go-redis/cache"
)

func GetCountDataTimes(t *int) *int {
	m := models.DataTime{}
	var c int
	err := common.Codec.Get("Count_"+strconv.Itoa(*t), &c)
	if err == nil {
		return &c
	}
	var n int
	n, err = models.Db.Model(&m).Where("type=?", *t).Count()
	if err == nil && n > 0 {
		common.Codec.Set(&cache.Item{
			Key:        "Count_" + strconv.Itoa(*t),
			Object:     n,
			Expiration: time.Minute,
		})
	}
	return &n
}
