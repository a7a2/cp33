package models

import (
	"fmt"
	"time"

	"github.com/go-pg/pg"
)

var (
	Db *pg.DB
)

func Database() *pg.DB {
	return Db
}

func createSchema(db *pg.DB) error {
	return nil
}

func dodb() {
	Db = pg.Connect(&pg.Options{
		Network:            "tcp",
		Addr:               fmt.Sprintf("%s:%s", "127.0.0.1", "5432"),
		User:               "postgres",
		Password:           "postgres",
		Database:           "cp33",
		DialTimeout:        3 * time.Second,
		ReadTimeout:        3 * time.Second,
		WriteTimeout:       3 * time.Second,
		PoolSize:           99,
		PoolTimeout:        time.Second * 3, //繁忙时候适用
		IdleTimeout:        time.Second,
		IdleCheckFrequency: time.Second,
	})

	err := createSchema(Db)
	if err != nil {
		fmt.Println(err.Error())
		t, _ := time.ParseDuration("5s")
		time.Sleep(t)
		dodb()
	}
}

func init() {
	Ss = make(map[string]interface{}) //session
	dodb()
}
