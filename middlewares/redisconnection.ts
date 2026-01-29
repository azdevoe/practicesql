import { createClient } from "redis";
let redisCli=createClient()

redisCli.on('error',err=>{
    console.error("redis client errro "+ err)
})
redisCli.on('connect',()=>{
    console.log('redis connected');
    
})

redisCli.on('ready',()=>{
    console.log('redis cli ready to use');
    
})
export default redisCli