import mongoose from "mongoose";

const conversationSchema=new mongoose.Schema({
    participents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    message:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message" 
        }
    ]
})


export default Conversation = mongoose.model("Conversation",conversationSchema)