import express ,{Express}from 'express'
import sequelize from './config/sequelize'
import dotenv from 'dotenv'
import userrouter from './routes/users';
dotenv.config();
const app:Express = express()
app.use(express.json())
let port = process.env.PORT!


app.use('/auth',userrouter)


app.listen(port,async ()=>{
    await sequelize.authenticate()
    console.log(`listening at ${port}`);
})

