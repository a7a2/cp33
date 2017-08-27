package controllers

import (
	"cp33/common"
	"cp33/models"
	"cp33/services/user"
	"fmt"
	"strconv"
)

func (self *Base) Login() {
	self.Context.RemoveCookie("username")
	self.Context.RemoveCookie("platform")
	self.Context.RemoveCookie("enclientpasswd")
	if self.BaseCheck() == false {
		return
	}

	var s models.LoginPost
	var err error

	err = self.Context.ReadForm(&s)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	//以后完善 每个ip登陆密码错误次数高于50次后要求验证码
	//	if common.CheckCaptcha(self.Context, s.Captcha) == false { //验证码
	//		return
	//	}
	//fmt.Println("s.Password:", s.Password)
	//start...先从redis校验
	passwordDb := common.EncryptDb(s.Platform, s.Password, s.Username)
	if passwordDb == "" {
		fmt.Println("passwordDb nil")
		return
	}

	//	fmt.Println(common.RedisClient.HExists(s.Platform+"_"+s.Username, "enclientpasswd").Val())

	var enClientPassWd string //存放在cookie 及 redis上
	if common.RedisClient.HExists(s.Platform+"_"+s.Username, "enclientpasswd").Val() == true {
		enClientPassWd = common.RedisClient.HGet(s.Platform+"_"+s.Username, "enclientpasswd").Val() //取存在redis的cookie密码
		//然后解密的 校验 加密的，原则上不需要用到数据库
		//fmt.Println(len(enClientPassWd), "	", enClientPassWd)
		deClientPassWd := common.DecryptClient(enClientPassWd, s.Platform)
		if deClientPassWd == passwordDb {
			outData := models.LoginCookie{Platform: s.Platform, Username: s.Username, Enclientpasswd: enClientPassWd}
			self.loginSucceed(&outData)
			fmt.Println(s.Username, " login via redis")
			return
		}
	}
	//end...先从redis校验

	//start...从数据库校验
	var result models.Result
	err, result = services.Login(s.Platform, s.Username, passwordDb)
	if err == nil && result.Code == 200 { //登陆成功
		enClientPassWd = common.EncryptClient([]byte(passwordDb), s.Platform)
		field := make(map[string]interface{}, 2)
		field["uid"] = strconv.Itoa(result.Data.(*models.Members).Uid)
		field["platformid"] = result.Data.(*models.Members).PlatformId
		if _, err = common.RedisClient.HMSet(s.Platform+"_"+s.Username, field).Result(); err != nil {
			fmt.Println(err.Error())
		}
		loginCookie := models.LoginCookie{Platform: s.Platform, Username: s.Username, Enclientpasswd: enClientPassWd}
		self.loginSucceed(&loginCookie)
		fmt.Println(s.Username, " login db")
		return
	}
	self.Context.JSON(&result)
	//end...从数据库校验
}
