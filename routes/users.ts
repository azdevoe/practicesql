import express ,{ Router,Request,Response } from "express";
import { Error,UniqueConstraintError,ValidationError } from "sequelize";
import jwt from 'jsonwebtoken'

const router:Router = express.Router()
import z, { email } from 'zod'
import { createUser, login, users } from "../controller/user";

const userDetails = z.object({
    name:z.string().min(3,`username must be up to 3 characters`),
    email:z.string().email('invalid email format'),
    password:z.string().min(5, "password must be up to 5 characters")
})

const loginDetails = z.object({
    email:z.string().email(),
    password:z.string()
})
router.post('/createUser',async function(req:Request,res:Response){
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
        let token = jwt.sign({id:user.message.id,rank:user.message.rank},'secret',{expiresIn:'1w'})
        return res.status(201).json({user:user.message,token})
    } catch (error) {
            if(error instanceof UniqueConstraintError){
            console.log(error.message);
            
            return res.status(400).json({
                message: 'email already in use in db'
            })
        }
        if(error instanceof ValidationError){
            return res.status(400).json({
                message: error.errors[0].message
            })
        }
        if(error instanceof Error){
            console.log(`error occurred at server while creating user`);
            console.log(error.message);
            return res.status(500).json({
                message:error.message
            })
        }
        console.log(`error occurred at server while creating user`);
        console.log(error);
        


        return res.status(500).json({
            message:`error occurred at server while creating user`
        })
    }
})

router.get('/users',async function(req:Request,res:Response){
    try {
        let Users = await users();
        if(Users.error){
            return res.status(400).json(`error occurred getting all users`)
        }
        return res.status(200).json(Users.message)
    } catch (error) {
        res.status(500).json(`error finding the users`)
    }
})

router.post('/login',async function(req:Request,res:Response){
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
            return res.status(200).json(auth.action)
    } catch (error) {
        
     if(error instanceof UniqueConstraintError){
            console.log(error.message);
            
            return res.status(400).json({
                message: 'email already in use in db'
            })
        }
        if(error instanceof ValidationError){
            return res.status(400).json({
                message: error.errors[0].message
            })
        }
        if(error instanceof Error){
            console.log(`error occurred at server while creating user`);
            console.log(error.message);
            return res.status(500).json({
                message:error.message
            })
        }
        console.log(`error occurred at server while creating user`);
        console.log(error);
        


        return res.status(500).json({
            message:`error occurred at server while creating user`
        })
    }
})

export default router