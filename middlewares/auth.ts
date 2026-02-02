import { NextFunction,Request,Response } from "express";
import jwt from 'jsonwebtoken';
import redisCli  from "./redisconnection";
import { UniqueConstraintError,ValidationError,Error } from "sequelize";
import z from "zod";

declare global{
    namespace Express{
        interface Request{
            user?:any,
            redisParam?:any
        }
    }
}
export function auth(req:Request,res:Response,next:NextFunction){
    try {
        let token =  req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(403).json(`forbidden`)
        }
        console.log(token);
        
        const compare = jwt.verify(token,'secret');
        req.user= compare
        console.log(compare);
        next()
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export async function redisMiddleware(req:Request,res:Response,next:NextFunction){
        try {
                if(!req.redisParam){
                    return next()
                }
                let cache = await redisCli.get(req.redisParam)
                if(!cache){
                    return next()
                }else{
                    return res.json(JSON.parse(String(cache)))

                }
        } catch (error) {
            console.log(`redis middleware error, `+ error);
            
            next()
        }
}

export function validationMiddleware(error:any,req:Request,res:Response,next:NextFunction){
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
            if(error instanceof z.ZodError){
                console.log(`there is a zod validation errro`);
                return res.status(400).json({
                    message:`validation failed`,
                    details:error.flatten().fieldErrors
                })
                
            }
            console.log(`error occurred at server while creating user`);
            console.log(error);
            
    
    
            return res.status(500).json({
                message:`error occurred at server while creating user`
            })
}