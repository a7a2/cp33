package common

import (
	"math"
)

//n 所求数字位置(个位 1,十位 2 依此类推)</param>
func FindNum(num, n int) int {
	power := int(math.Pow10(n))
	return (num - num/power*power) * 10 / power
}
