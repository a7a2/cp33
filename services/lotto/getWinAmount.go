package servicesLotto

import (
	"cp33/common"

	"fmt"
	"regexp"
	"strconv"
	"strings"
)

func (endBets *endBets) getWinAmount(i *int) (betRewardMoney float64) { //获取中奖注数
	var tmpBetCodeSplit, tmpBetCodeOne []string
	var intBetCount int //中奖注数

	dbBetPrize, err := strconv.ParseFloat((*endBets.bets)[*i].BetPrize, 64)
	if err != nil {
		fmt.Println("services EndLottery 146:" + err.Error())
		endBets.tx.Rollback()
		return 0
	}

	betRewardMoney = common.Round((*endBets.bets)[*i].BetMoney * (*endBets.bets)[*i].BetReward)
	switch (*endBets.bets)[*i].PlayId {
	case 1, 7:
		switch (*endBets.bets)[*i].SubId {
		case 37:
			tmpBetCodeSplit = strings.Split((*endBets.bets)[*i].BetCode, "|")
			for j := 0; len(tmpBetCodeSplit) == len(endBets.dataSplit) && j < len(tmpBetCodeSplit); j++ {
				tmpBetCodeOne = regexp.MustCompile(`([0-9]+)`).FindAllString(tmpBetCodeSplit[j], '&')
				for ii := 0; ii < len(tmpBetCodeOne); ii++ {
					if tmpBetCodeOne[ii] == endBets.dataSplit[j] {
						intBetCount = intBetCount + 1
						break
					}
				}
			}
			break
		case 107:
			tempBetCodeSplit := strings.Split((*endBets.bets)[*i].BetCode, "|")
			arrayCount := make([][]string, 5)
			for k := 0; k < 5; k++ {
				arrayCount[k] = regexp.MustCompile(`[0-9]{1}`).FindAllString(tempBetCodeSplit[k], -1)
				for j := 0; j < len(arrayCount[k]); j++ {
					if endBets.dataSplit[k] == arrayCount[k][j] {
						if k == 4 { //中了
							(*endBets.bets)[*i].WinAmount = common.Round(dbBetPrize * (*endBets.bets)[*i].BetEachMoney)
							return
						}
						break
					}
				}

			}
			break

		}

	}

	(*endBets.bets)[*i].WinAmount = common.Round(float64(intBetCount) * dbBetPrize * (*endBets.bets)[*i].BetEachMoney)
	return
}
