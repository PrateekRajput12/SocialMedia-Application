import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from '../utils/datauri.js'
import cloudinary from '../utils/cloudanary.js'
export const register = async(req,res)=>{
    try{
        const {username,email,password}=req.body
        if(!username || !email || !password){
            res.status(401).json({message:"Something is missing please check",success:false})
        }

        const user=await User.findOne({email})
        if(user){
            return res.status(401).json({
                message:"Try different email",
                success:false
            })
        }

        const hashedPassword=await bcrypt.hash(password,10)
        await User.create({
            username,
            email,
            password:hashedPassword
        })
        res.status(201).json({message:"Account Created Successfully",success:false})

    }catch(err){
        console.log(err);
        res.status(400).json({
            message:"There is Some problem in Signing UP"
        })
        
    }
}


export const login= async (req,res)=>{
try{

    const {email,password}=req.body
    if(!email || !password){
        return res.status(401).json({
            message:"Something is missing , please Check",
            success:false
        })
    }
    let user= await User.findOne({email})
    if(!user){
        return res.status(401).json({
            message:"incorrect email or password",
            success:false
        })
    }

    const isPasswordMatch=await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        return res.status(401).json({
            message:"incorrect email or password",
            success:false
        }) 
    }

user={
    _id:user._id,
    username:user.username,
    email:user.email,
    profilePicture:user.profilePicture,
    bio:user.bio,
    followers:user.followers,
    following:user.following,
    posts:user.posts,
}

    const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})

    return res.cookie('token',token,{httpOnly:true,sameSite:"strict",maxAge:1*24*60*60*1000}).json({
        message:`Welcome Back ${user.username}`,
        success:true,user
    })
}catch(E){
console.log(E);
res.status(400).json({message:"Error in signing up"})
}
}


export const logout=async (req,res)=>{
    try {
        return res.cookie("token","",{maxAge:0}.json({
            message:"Logged out successfully",
            success:true
        }))
    } catch (error) {
        console.log(error);
    }
}

export const getProfile=async (req,res)=>{
    try {
     const userId=req.params._id
     let user=await User.findById(userId)  
     return res.status 
    } catch (error) {
        console.log(error);
    }
}


export const editProfile= async(req,res)=>{
    try {
//    const 

const userId=req.id
const {bio,gender}=req.body
const profilePicture=req.file
let cloudResponse
if(profilePicture){
    const fileUri=getDataUri(profilePicture)
 cloudResponse=   await cloudinary.uploader.upload(fileUri)
}


const user =await User.findById(userId)
if(!user){
    return res.status(400).json({
        message:"User not found",
        success:false
    })
}     
if(bio){
    user.bio=bio
}   
if(gender){
    user.gender=gender
}   if(profilePicture){
    user.profilePicture=cloudResponse.secure_url
}   
await user.save()

return res.status(200).json({
    message:"Profile Updated",
    success:true,
    user
})
    } catch (error) {
       console.log(error); 
    }
}


export const getSuggestedUser=async(req,res)=>{
    try {
        const suggestedUser=await User.find({_id:{$ne:req.id}}).select("-password")

        if(!suggestedUser){
            return res.status(400).json({
                message:"Currently do not have any User"
            })
        }


        return res.status(200).json({
            success:true,
            users:suggestedUser
        })

    } catch (err) {
        console.log(err);
    }
}


export const followOrUnfollow=async (req,res)=>{
    try {
        const followKarneWala=req.id
        const jiskoFollowKarunga=req.params.id
        if(followKarneWala=== jiskoFollowKarunga){
           return res.status(400).json({
            message:"You cannot follow/unfollow yourself",
            success:false
           }) 
        }
        const user=await User.findById(followKarneWala)
        const targetUser=await User.findById(jiskoFollowKarunga)
        if(!user || !targetUser){
            return res.status(400).json({
                message:"User not found",
                success:false
            })
        }
        // mai check karunga ki follow hai ya unfollow

        const isFollowing=user.following.includes(jiskoFollowKarunga)
        if(isFollowing){
            // unfollow logic
            await Promise.all([
                User.updateOne({_id:followKarneWala},{$pull:{following:jiskoFollowKarunga}}),
                User.updateOne({_id:jiskoFollowKarunga},{$pull:{followers:followKarneWala}}),
            
            ])
            return res.status(200).json({
                message:"Unfollowed Succesfully ",
                success:true
            })
        }
        else {
            // follow logic
await Promise.all([
    User.updateOne({_id:followKarneWala},{$push:{following:jiskoFollowKarunga}}),
    User.updateOne({_id:jiskoFollowKarunga},{$push:{followers:followKarneWala}}),

])
return res.status(200).json({
    message:"Followed Succesfully ",
    success:true
})
        }
    } catch (error) {
        console.log(error);
    }
}