import { Model,DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
class User extends Model{
    id:number;
    name:string;
    email:string;
    password:string;
    rank: 'admin'|'user'
}

User.init({
    id:{
        type:DataTypes.STRING,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    rank:{
        type:DataTypes.ENUM("admin","user"),
        allowNull:false,
        defaultValue: "user"
    }

},{
    sequelize,
    timestamps:true,
    tableName:"users",
    modelName:"users"
})

export default User