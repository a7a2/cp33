package common

import (
	"fmt"
	"math"
	"strconv"
	"time"
)

func Round(f float64) float64 {
	pow10_n := math.Pow10(3)
	return math.Trunc((f+0.5/pow10_n)*pow10_n) / pow10_n
}

func Combination(c, b int) int {
	var f64 float64
	if b == 0 || c == 0 {
		return 1
	}
	if b > c {
		return 0
	}
	if b > c/2 {
		b = c - b
	}
	var a float64 = 0
	for i := c; i >= (c - b + 1); i-- {
		f64, _ = strconv.ParseFloat(strconv.Itoa(i), 64)
		a += math.Log(f64)
	}
	for i := b; i >= 1; i-- {
		f64, _ = strconv.ParseFloat(strconv.Itoa(i), 64)
		a -= math.Log(f64)
	}
	a = math.Exp(a)

	s := fmt.Sprintf("%.0f", a)
	ii, _ := strconv.Atoi(s)
	return ii
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
