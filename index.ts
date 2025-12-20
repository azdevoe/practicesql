import express ,{Express}from 'express'
import sequelize from './config/sequelize'
const app:Express = express()
let port = 1000



app.listen(port,async ()=>{
    await sequelize.authenticate()
    console.log(`listening at ${port}`);
    
})

