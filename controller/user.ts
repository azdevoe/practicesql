import User from "../models/schema";
import bcrypt from'bcrypt';
import { WhereOptions,Op } from "sequelize";
import { email } from "zod";

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
//:{id:{[Op.gt]:2}}}
export type ranki = 'admin'|'user';
export async function users(offset,pageLimit,name:string,rank:ranki|undefined,id?:number,sign?:'gt'|'lt'){
    let where:WhereOptions ={};
    if(name) where.name = name
    if(rank) where.rank = rank
    if(id && sign){
        if(sign ==='gt'){
            where.id = {[Op.gt]:id}
        }else{
            where.id={
                [Op.lt]:id
            }
        }
    }
    where.isDeleted=false
    console.log(where);
    
    
    let users = await User.findAndCountAll({where,offset,limit:pageLimit});
    console.log(users);
    return {
        error:false,
        message:users
    }
    
}
 async function findOne(email:string){
    const user =await User.findOne({where:{email}})
  
    return user
    
}

export async function login(email:string,password:string){
    let user = await findOne(email)
    if(!user){
        return {
            error:true,
            message:`who is this `
        }
    }
    let comp= await bcrypt.compare(password,user.password);
    if(!comp){
        return {
            error:true,
            message:`invalid password`
        }
    }
    let y={
        rank:user.rank,
        id:user.id
    }
    return {
        error:false,
        message:y
    }
}

export async function changeRank(email:string){
    let user  = await User.findOne({where:{email}});
    if(!user){
        return{
            error:true,
            message:`this user doesnt exist`
        }
    }
    user.rank = 'admin';
    await user.save()
    return{
        error:false,
        message: `rank updated`
    }
}

export async function softDelete(email:string){
    const user  = await User.findOne({where:{email}});
    if(!user){
        return {
            error:true,
            message:`user doesnt exist`
        }
    }
    user.isDeleted = !user.isDeleted;
    await user.save()
    return{
        error:false,
        message: `user deleted`
    }
}