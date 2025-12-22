import User from "../models/schema";
import bcrypt from'bcrypt';

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

