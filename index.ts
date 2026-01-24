import express ,{Express}from 'express'
import sequelize from './config/sequelize'
import dotenv from 'dotenv'
import userrouter from './routes/users';
import rateLimit from 'express-rate-limit';
dotenv.config();
const app:Express = express()
app.use(express.json())
let port = process.env.PORT!

const limiter = rateLimit({
    windowMs:1*60*1000,
    max:5,
    message:'too many api requests, try again later'
})

app.use(limiter)
app.use('/auth',userrouter)


app.listen(port,async ()=>{
    await sequelize.authenticate()
    console.log(`listening at ${port}`);
})

