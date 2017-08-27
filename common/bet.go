package common

import (
	//	"cp33/models"
	"math"
	"strconv"
	"time"
)

func Round(f float64) float64 {
	pow10_n := math.Pow10(3)
	return math.Trunc((f+0.5/pow10_n)*pow10_n) / pow10_n
}

func BetMore(gameId, staticGamePeriod, more int) (tmpGamePeriod int) { //追期
	switch gameId {
	case 1: //重庆时时彩
		tmpGamePeriod = staticGamePeriod + more
		tmpGamePeriod3 := FindNum(tmpGamePeriod, 1) + FindNum(tmpGamePeriod, 2)*10 + FindNum(tmpGamePeriod, 3)*100
		if tmpGamePeriod3 > 120 {
			tmpTimeGamePeriod, _ := strconv.Atoi(time.Now().Add(time.Hour * 24).Format("060102"))
			tmpTimeGamePeriod = tmpTimeGamePeriod * 1000 //如:170909*1000
			tmpGamePeriod = tmpTimeGamePeriod + tmpGamePeriod3 - 120
		}
	}
	return
}
