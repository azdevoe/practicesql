import express ,{ Router,Request,Response } from "express";
import { Error,UniqueConstraintError,ValidationError } from "sequelize";
import jwt from 'jsonwebtoken'
import { changeRank, ranki, softDelete } from "../controller/user";

const router:Router = express.Router()
import z from 'zod'
import { createUser, login, users } from "../controller/user";
import { auth } from "../middlewares/auth";

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
        return res.status(201).json(user.message)
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
        let {name,rank,id,sign} = req.query;
      console.log(name,rank,id,sign);

      let yy = ['admin','user']
      let signArr = ['gt','lt']
      let uu = yy.includes(String(rank));
      let checker = signArr.includes(String(sign))
      type signTy = 'gt'|'lt';
        let Users = await users(name as string,uu?rank as ranki:undefined,id? Number(id):undefined,checker?sign as signTy :undefined);
        if(Users.error){
            return res.status(400).json(`error occurred getting all users`)
        }
        
        return res.status(200).json(Users.message)
    } catch (error) {
        res.status(500).json(`error finding the users at router`)
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
            let token = jwt.sign({id:auth.message},'secret',{expiresIn:'1w'})

            return res.status(200).json({message:`login successful`,token})
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

router.patch('/users/:email',async function (req:Request,res:Response) {
    try {
        const {email} = req.params;
        const user = await changeRank(email);
        if(user.error){
            return res.status(400).json(user.message)
        }
        return res.status(200).json(user.message)
    } catch (error) {
        if(error instanceof ValidationError){
            return res.status(500).json(error.errors[0].message)
        }
        if(error instanceof UniqueConstraintError){
            return res.status(500).json(error.errors[0].message)
        }
        return res.status(500).json(`error occurred at the server`)
    }
})

router.patch('/usersd/:email',auth,async function(req:Request,res:Response){
    try {
        const {email} = req.params;
        const user = await softDelete(email)
        if(user.error){
            return res.status(400).json(user.message);
        }
        return res.status(200).json(user.message)
    } catch (error) {
     if(error instanceof ValidationError){
            return res.status(500).json(error.errors[0].message)
        }
        if(error instanceof UniqueConstraintError){
            return res.status(500).json(error.errors[0].message)
        }
        return res.status(500).json(`error occurred at the server`)
    }
})
export default router