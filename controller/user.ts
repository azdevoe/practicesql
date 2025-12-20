import User from "../models/schema";
import { Error } from "sequelize";
import bcrypt from'bcrypt';

async function createUser( name:string,email:string,password:string){
    const hashedp = await bcrypt.hash(password,10)
    try {
        const user = await User.create({name,email,password:hashedp})
        if(!user){
            console.log(`error occurred creating user `);
            return{
                error:true,
                message: `error occurred while creating user`
            }
            
        }

        console.log(`user created`);
        let uu  ={
            id:user.id,
            name:user.name,
            email:user.email
        }
        return {
            error:true,
            message:uu
        }
        
    } catch (error) {
        if(error instanceof Error){
            console.log(`error occurred at server while creating user`);
            console.log(error.message);
            return{
                error:true,
                message:error.message
            }
        }
        console.log(`error occurred at server while creating user`);

        return{
            error:true,
            message:`error occurred at server while creating user`
        }
        
    }
}

export default {createUser}