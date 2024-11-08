import {Conversation} from '../models/conversation.model.js'
import { Message } from '../models/message.model.js'
export const sendMessage=async (req,res)=>{
    try {
        const senderId=req.id
        const recieverId=req.params.id
        const {message}=req.body


        const conversation= await Conversation.findOne({
            participants:{$all:{senderId,recieverId}}
        })

        // estblish the conversation if not started yet

        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,recieverId]
            })
        }
const newMessage=await Message.create({
    senderId,
    receiverId,
    message
})
if(newMessage) conversation.messages.push(newMessage._id)

await Promise.all([conversation.save(),newMessage.save()])

// implement socket io for real time data transfer

return res.status(201).json({
    success:true,
    newMessage
})
  
    } catch (error) {
        console.log(error);
    }
}


export const getMessage=async (req,res)=>{
    try {
        const senderId=req.id
        const recieverId=req.params.id

        const conversation=await Conversation.find({
            participents:{$all:[senderId,recieverId]}
        })

        if(!conversation) return res.status(200).json({success:true,message:[]})

            return res.status(200).json({
                success:true,message:conversation?.message
            })

    } catch (error) {
        console.log(error);
    }
}