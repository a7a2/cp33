package controllers

import (
	"cp33/common"
	"cp33/models"
	"cp33/services/lotto"
	"cp33/services/user"
	"fmt"
	"regexp"

	"github.com/kataras/iris/websocket"
)

func checkIsLogin(l *models.LoginCookie) bool {
	passwdDb := common.DecryptClient(&(l.Enclientpasswd), &(l.Platform))

	//从redis验证
	if common.RedisClient.HExists(l.Platform+"_"+l.Username, "enclientpasswd").Val() == true {
		redisEnclientpasswd := common.RedisClient.HGet(l.Platform+"_"+l.Username, "enclientpasswd").Val()
		//fmt.Println(redisEnclientpasswd)
		if redisEnclientpasswd == l.Enclientpasswd {
			return true
		}
		//解密验证
		//fmt.Println(l.Enclientpasswd, "	", redisEnclientpasswd, "	", l.Enclientpasswd)
		if common.DecryptClient(&redisEnclientpasswd, &(l.Platform)) == common.DecryptClient(&(l.Enclientpasswd), &(l.Platform)) {
			common.RedisClient.HSet(l.Platform+"_"+l.Username, "enclientpasswd", l.Enclientpasswd)
			return true
		}
	}

	//从数据库验证
	lp := models.LoginPost{
		Platform: l.Platform,
		Username: l.Username,
		Password: passwdDb,
	}
	err, result := services.Login(&lp)
	if err == nil && result.Code == 200 { //成功
		common.RedisClient.HSet(l.Platform+"_"+l.Username, "enclientpasswd", l.Enclientpasswd)
		//	fmt.Println(l.Username, "ws.go文件 checkIsLogin 从数据库验证 成功！")
		return true
	}

	return false
}

func WsMain(c websocket.Connection) {
	c.On("validate", func(message string) {
		//Println(message)
		//权限检查开始。。。start
		if c.GetValue(c.ID()) == nil {
			arrayStr := regexp.MustCompile(`(platform=)([a-z0-9]{8})((\-[a-z0-9]{4}){3})(\-[a-z0-9]{12})(&username=)(.*)(&enclientpasswd=)(.*)`).FindStringSubmatch(message)
			var l models.LoginCookie
			//fmt.Println(len(arrayStr), "	  ", len(arrayStr[9]))
			if len(arrayStr) == 10 && len(arrayStr[9]) >= 100 {
				l.Platform = arrayStr[2] + arrayStr[3] + arrayStr[5]
				l.Username = arrayStr[7]
				l.Enclientpasswd = arrayStr[9]
				if checkIsLogin(&l) == true {
					//fmt.Println("ws 过验证")
					c.SetValue(c.ID(), l)    //通过
					c.Emit("validate", "ok") //通过
					return

				}
			}
			//fmt.Println("ws 未通过验证")
			c.Emit("validate", "no ok!")
			return
		}
		//权限检查结束。。。end
		//fmt.Println("ws 通过验证")

		c.Emit("validate", "ok")
		return
	})

	c.On("balance", func(message string) {
		if c.GetValue(c.ID()) != nil {
			enclientpasswd := c.GetValue(c.ID()).(models.LoginCookie).Enclientpasswd
			platform := c.GetValue(c.ID()).(models.LoginCookie).Platform
			lp := models.LoginPost{
				Platform: platform,
				Username: c.GetValue(c.ID()).(models.LoginCookie).Username,
				Password: common.DecryptClient(&enclientpasswd, &platform),
			}
			err, result := services.Login(&lp)
			if err == nil && result.Code == 200 { //成功
				c.Emit("balance", result.Data.(*models.Members).Coin)
			} else {
				fmt.Println(result)
			}
		}
	})

	c.On("1", func(message string) { //重庆时时彩
		if c.GetValue(c.ID()) == nil {
			return
		}
		c.Leave("1")
		c.Join("1")

		result := servicesLotto.OpenInfo(1)
		c.Emit("1", &result)
	})

	c.On("7", func(message string) { //新疆时时彩
		if c.GetValue(c.ID()) == nil {
			return
		}
		c.Leave("7")
		c.Join("7")

		result := servicesLotto.OpenInfo(7)
		c.Emit("7", &result)
	})

	c.On("logout", func(message string) {
		c.Context().RemoveCookie("username")
		c.Context().RemoveCookie("enClientPassWd")
		c.Context().RemoveCookie("platform")
		c.Disconnect()
	})

	c.OnDisconnect(func() {
		models.WsMutex.Lock()
		//c.SetValue(c.ID(), nil)
		delete(models.WsConn, c)
		models.WsMutex.Unlock()
	})
}

func BroadcastSame(Conn *map[websocket.Connection]bool, room, gate *int, m interface{}) {
	for c := range *Conn {
		c.To(string(*room)).Emit(string(*gate), m)
	}
}
