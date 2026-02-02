import express ,{ Router,Request,Response, NextFunction } from "express";
import { Error,UniqueConstraintError,ValidationError } from "sequelize";
import jwt from 'jsonwebtoken'
import { changeRank, ranki, softDelete } from "../controller/user";

const router:Router = express.Router()
import z from 'zod'
import { createUser, login, users } from "../controller/user";
import { auth } from "../middlewares/auth";
import { redisMiddleware } from "../middlewares/auth";
import redisCli  from "../middlewares/redisconnection";

const userDetails = z.object({
    name:z.string().min(3,`username must be up to 3 characters`),
    email:z.string().email('invalid email format'),
    password:z.string().min(5, "password must be up to 5 characters")
})

const loginDetails = z.object({
    email:z.string().email(),
    password:z.string()
})
router.post('/createUser',async function(req:Request,res:Response,next:NextFunction){
        try {
            console.log(req.body);
        
        let zodified = userDetails.parse(req.body)
        if(!zodified){
            return res.status(400).json({
                message:`validation failed`
            })
        }
        let {name,email,password} = zodified
        console.log(name,email,password);
        
        const user = await createUser(name,email,password)
        if(user.error){
            return res.status(400).json(user.message)
        }
        return res.status(201).json(user.message)
        } catch (error) {
            //i created a middleware that handles error in the middleware route
            //this next function leads to it
            next(error)
        }
    
})
function cachename(req:Request,res:Response,next:NextFunction){
    //this cachename function creates something unique so we use as key for the cache
    req.redisParam = `user${req.originalUrl}`
    console.log(req.originalUrl);
    
    next()
}

router.get('/users',cachename,redisMiddleware,async function(req:Request,res:Response){
    try {
        let {name,rank,id,sign,page,limit} = req.query;
      console.log(name,rank,id,sign,page,limit);

      let pageNumber=Number(page)||1
      let pageLimit=Number(limit)||10
      let offset = (pageNumber-1)*pageLimit

      let yy = ['admin','user']
      let signArr = ['gt','lt']
      let uu = yy.includes(String(rank));
      let checker = signArr.includes(String(sign))
      type signTy = 'gt'|'lt';
        let Users = await users(offset,pageLimit,name as string,uu?rank as ranki:undefined,id? Number(id):undefined,checker?sign as signTy :undefined);
        if(Users.error){
            return res.status(400).json(`error occurred getting all users`)
        }
        
        if (req.redisParam) {
            await redisCli.setEx(req.redisParam, 60, JSON.stringify(Users.message)); // 60s = 1min, adjust as needed
        }        
        return res.status(200).json(Users.message)
    } catch (error) {
        res.status(500).json(`error finding the users at router`)
    }
})

router.post('/login',async function(req:Request,res:Response,next:NextFunction){
    try {
            let zodified = loginDetails.parse(req.body);
            if(!zodified){
                return res.status(400).json(`authentication failed`)
            }
            let {email,password}= zodified;
            let auth  =await login(email,password);
            if(auth.error){
                return res.status(400).json(auth.message)
            }
            let token = jwt.sign({id:auth.message},'secret',{expiresIn:'1w'})

            return res.status(200).json({message:`login successful`,token})
    } catch (error) {
        next(error)
    }
})

router.patch('/users/:email',async function (req:Request,res:Response,next:NextFunction) {
    try {
        const {email} = req.params;
        const user = await changeRank(email);
        if(user.error){
            return res.status(400).json(user.message)
        }
        return res.status(200).json(user.message)
    } catch (error) {
        next(error)
    }
})

router.patch('/usersd/:email',auth,async function(req:Request,res:Response,next:NextFunction){
    try {
        const {email} = req.params;
        const user = await softDelete(email)
        if(user.error){
            return res.status(400).json(user.message);
        }
        return res.status(200).json(user.message)
    } catch (error) {
        next(error)
    }
})
export default router