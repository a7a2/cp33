package common

import (
	"cp33/models"
	//	"strings"
	//	"crypto/cipher"
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"io"

	//"github.com/jameskeane/bcrypt"
	"github.com/pzduniak/argon2"
	//	"golang.org/x/crypto/blowfish"
)

func EncryptDb(platform, password *string) (strHash string) { //浏览器、客户端完成sha3->ripemd160的加密,入库前通过这里argon2加密一次
	salt := []byte(models.PwdKey + (*platform))
	hashByte, err := argon2.Key([]byte(*password), salt, 3, 4, 16384, 32, argon2.Argon2i)
	if err != nil {
		fmt.Println(err)
		return
	}
	strHash = hex.EncodeToString(hashByte)
	return
}

//func EncryptClient(password []byte, platform string) (hash string) { //argon2加密到浏览器、客户端cookie  同时缓存在redis
//	salt := []byte(models.PwdKey + platform)
//	hashByte, err := argon2.Key(password, salt, 3, 4, 4096, 32, argon2.Argon2i)
//	if err != nil {
//		fmt.Println(err)
//		return
//	}
//	hash = hex.EncodeToString(hashByte)
//	fmt.Println("EncryptClient", ":", hash)
//	return

//}

func EncryptClient(plaintext []byte, platform string) string { //aes加密到浏览器、客户端cookie  同时缓存在redis
	strKey := md5Sum(models.PwdKey + platform)
	key := []byte(strKey)

	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err.Error())
	}

	// Never use more than 2^32 random nonces with a given key because of the risk of a repeat.
	nonce := make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		panic(err.Error())
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}

	ciphertext := aesgcm.Seal(nil, nonce, plaintext, nil)
	textStr := base64.StdEncoding.EncodeToString(ciphertext)
	//textStr = strings.Replace(textStr, "+", "%2B", -1)
	ivStr := base64.StdEncoding.EncodeToString(nonce)
	//rintln("EncryptClient:", textStr, " len(textStr):", len(textStr), "\nivStr:", ivStr)
	return textStr + ivStr
}

func DecryptClient(s, platform *string) string {
	//s = strings.Replace(s, " ", "+", -1)
	//s = strings.Replace(s, "%2B", "+", -1)
	//fmt.Println("DecryptClient:", len(s))
	strKey := md5Sum(models.PwdKey + (*platform))
	key := []byte(strKey)
	ciphertext, _ := base64.StdEncoding.DecodeString((*s)[:len(*s)-16])
	nonce, _ := base64.StdEncoding.DecodeString((*s)[len(*s)-16:])
	//fmt.Println("len(nonce):", len(nonce))
	//fmt.Println("DecryptClient string:", s)
	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err.Error())
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}

	plaintext, err := aesgcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		panic(err.Error())
	}
	//fmt.Println("DecryptClient:", string(plaintext))
	return string(plaintext)
}

func md5Sum(s string) (str string) {
	h := md5.New()
	h.Write([]byte(s))
	str = hex.EncodeToString(h.Sum(nil))
	return
}
