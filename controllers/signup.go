package controllers

import (
	"cp33/models"
	"cp33/services/user"
	"fmt"
	"strconv"

	"cp33/common"
)

func (self *Base) Signup() { //post 注册
	var s models.SignupPost
	var err error
	err = self.Context.ReadForm(&s)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	if common.CheckCaptcha(self.Context, s.Captcha) == false { //验证码
		return
	}

	if self.BaseCheck() == false {
		return
	}

	passwordDb := common.EncryptDb(&(s.Platform), &(s.Password))
	s.Password = passwordDb
	var result models.Result
	_, result = services.Signup(&s, fmt.Sprintf("%s/%s", self.Context.RemoteAddr(), "32"))
	if result.Code == 200 {
		enClientPassWd := common.EncryptClient([]byte(passwordDb), s.Platform)
		field := make(map[string]interface{}, 2)
		field["uid"] = strconv.Itoa(result.Data.(*models.Members).Uid)
		field["platformid"] = result.Data.(*models.Members).PlatformId
		if _, err = common.RedisClient.HMSet(s.Platform+"_"+s.Username, field).Result(); err != nil {
			fmt.Println(err.Error())
		}
		loginCookie := models.LoginCookie{Platform: s.Platform, Username: s.Username, Enclientpasswd: enClientPassWd}
		self.loginSucceed(&loginCookie)
		return
	}
	self.Context.JSON(result)

}
