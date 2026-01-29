import express ,{Express}from 'express'
import sequelize from './config/sequelize'
import dotenv from 'dotenv'
import userrouter from './routes/users';
import rateLimit from 'express-rate-limit';
import redisCli  from './middlewares/redisconnection';
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



     app.listen( port,async()=>{
        try {
            if(!redisCli.isOpen){
            await redisCli.connect()
            console.log(`connected to redis`);
            }
        } catch (error) {
            console.log('failed to connect to redis'+ error);
            process.exit(1)
        }
        try {
            await sequelize.authenticate()
            console.log(`database connected`);
        } catch (error) {
            console.log(`error connecting to database`);
            process.exit(1)
        }
    console.log(`listening at ${port}`);
})


