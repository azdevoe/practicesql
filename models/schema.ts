import { Model,DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
class User extends Model{
    id:number;
    name:string;
    email:string;
    password:string;
    rank: 'admin'|'user'
    createdAt:Date
    updatedAt:Date
    isDeleted:boolean
}

User.init({
    id:{
        type:DataTypes.INTEGER,
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
        unique:true,
        validate:{
            isEmail:true
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            len:[5,100]
        }
    },
    rank:{
        type:DataTypes.ENUM("admin","user"),
        allowNull:false,
        defaultValue: "user"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }

},{
    sequelize,
    timestamps:true,
    tableName:"users",
    modelName:"users"
})

export default User