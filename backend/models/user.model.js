import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    gender:{
type:String,
enum:['male','female']
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    posts:[
       {   type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
       }

    ],
    bookmarks:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Post'
        }
    ]
},{timestamps:true})
const User= mongoose.model("User",userSchema)
// export default User = mongoose.model("User",userSchema)

export default User