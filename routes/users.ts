import express ,{ Router,Request,Response } from "express";
import { Error,UniqueConstraintError,ValidationError } from "sequelize";
import jwt from 'jsonwebtoken'

const router:Router = express.Router()
import z from 'zod'
import { createUser } from "../controller/user";

const userDetails = z.object({
    name:z.string().min(3,`username must be up to 3 characters`),
    email:z.string().email('invalid email format'),
    password:z.string().min(5, "password must be up to 5 characters")
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
        let token = jwt.sign({id:user.message.id,rank:user.message.rank},'secret',{expiresIn:'1d'})
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

export default router