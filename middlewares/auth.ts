import { NextFunction,Request,Response } from "express";
import jwt from 'jsonwebtoken';

declare global{
    namespace Express{
        interface Request{
            user?:any
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