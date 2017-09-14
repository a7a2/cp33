package common

import (
	"fmt"
	"math"
	"strconv"
	//	"time"
)

func Round(f float64) float64 {
	pow10_n := math.Pow10(3)
	return math.Trunc((f+0.5/pow10_n)*pow10_n) / pow10_n
}

func InArrayInt(j *int, betPos *[]int) bool { //检查某数字是否存在于[]int数组中
	for h := 0; h < len(*betPos); h++ {
		if *j == (*betPos)[h] {
			return true
		}
	}
	return false
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
