import User from "../models/schema";
import bcrypt from'bcrypt';
import { error } from "console";
import { WhereOptions,Op } from "sequelize";

export async function createUser( name:string,email:string,password:string){
    const hashedp = await bcrypt.hash(password,10)
    
        const user = await User.create({name,email,password:hashedp})

        console.log(`user created`);
        let uu  ={
            id:user.id,
            name:user.name,
            email:user.email,
            rank:user.rank
        }
        return {
            error:false,
            message:uu
        }
        
 
}

export async function users(){
    let users = await User.findAll();
    console.log(users);
    return {
        error:false,
        message:users
    }
    
}
 async function findOne(email:string){
    const user =await User.findOne({where:{email}})
  
    return {
        error:false,
        message:user
    }
}

export async function login(email:string,password:string){
    let user = await findOne(email)
    if(!user){
        return {
            error:true,
            message:`who is this `
        }
    }
    let comp= await bcrypt.compare(password,user.message!.password);
    if(!comp){
        return {
            error:true,
            message:`invalid password`
        }
    }
    return {
        error:false,
        action:`success`
    }

}