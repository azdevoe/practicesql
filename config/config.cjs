let dotenv = require('dotenv')
dotenv.config()

module.exports={
  "development": {
    "username": process.env.USER,
    "password": process.env.PASS,
    "database": process.env.DB,
    "host": process.env.HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
