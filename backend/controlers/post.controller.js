import sharp from "sharp"
import cloudinary from "../utils/cloudanary.js"
import {Post} from '../models/post.model.js'
import User from "../models/user.model.js"
import { populate } from "dotenv"
export const addNewPost=async (req,res)=>{
    try{
const {caption}=req.body
const image=req.file
const authorId=req.id
if(!image){
    return res.status(400).json({message:"image required"})
}
// image upload
const optimizedImageBuffer=await sharp(image.buffer).resize({width:800,height:800,fit:'inside'})
.toFormat("jpeg",{quality:80})
.toBuffer()

const fileUri=`data:image/jpeg:base64,${optimizedImageBuffer.toString('base64')}`
const cloudResponse =await cloudinary.uploader.upload(fileUri)
const post= await Post.create({
    caption,
    image:cloudResponse.secure_url,
    author:authorId
})

const user=await User.findById(authorId)
if(user){
    user.posts.push(post._id)
    await user.save()

}

await post.populate({path:'author',select:'-password'})

return res.status(201).json({
    message:"New post added",
    post,
    success:true
})
    }catch(err){
        console.log(err);

    }
}


export const getAllPost=async (req,res)=>{
    try {
        const posts =await Post.find().sort({createdAt:-1}).populate({path:"author",select:'username,profilePicture'})
        .populate({path:"comments",
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username,profilePicture'
            }

    })
    return res.status(400).json({
        posts,
        success:true
    })
    } catch (error) {
        console.log(err);
    }
}




export const getUserPost=async(req,res)=>{
    try {
        const authorId=req.id
        const posts=await Post.find({author:authorId}).sort({createdAt:-1})
.populate({
    path:"author",
    select:"username, profilePicture"
}).populate({path:"comments",
    sort:{createdAt:-1},
    populate:{
        path:'author',
        select:'username,profilePicture'
    }

})  

return res.status(400).json({
    posts,
    success:true
})} catch (err) {
        console.log(err);
        
    }
}




export const likePost=async(req,res)=>{
    try {
      const likeKrneWaleUseKiId=req.id
      const postId=req.params.id
      const post =await Post.findById(postId)
      if(!post){
        return res.status(404).json({message:"Post Not Found",
            success:false
        })
      }

    //   like logic
    // await post.updateOne({$addToSet:{likes:likeKrneWaleUseKiId}})
      


    post.likes.updateOne({$addToSet:{likes:likeKrneWaleUseKiId}})
    await post.save()

    // implemented  socket io for real time notification


   return res.status(200).json({message:"Post Liked",success:true}) 
    } catch (error) {
       console.log(error); 
    }
}


export const disLikePost=async(req,res)=>{
    try {
      const likeKrneWaleUseKiId=req.id
      const postId=req.params.id
      const post =await Post.findById(postId)
      if(!post){
        return res.status(404).json({message:"Post Not Found",
            success:false
        })
      }

    //   like logic
    // await post.updateOne({$addToSet:{likes:likeKrneWaleUseKiId}})
      


    post.likes.updateOne({$pull:{likes:likeKrneWaleUseKiId}})
    await post.save()

    // implemented  socket io for real time notification


   return res.status(200).json({message:"Post DisLiked",success:true}) 
    } catch (error) {
       console.log(error); 
    }
}


export const addComment=async (req,res)=>{
    try {
       const postId=req.params.id 
       const commentkrneWaleUserKiId=req.id
       const {text}=req.body
       const post =await Post.findById(postId)
       if(!text) return res.status(400).json({message:"Text required",success:false})


        const comment=await  Comment.create({
            text,
            author:commentkrneWaleUserKiId,
            post:postId
        }).populate({
            path:"author",
            select:"username,profilePicture"
        })

        post.comments.push(comment._id)
        await post.save()

        return res.status(201).json({
            message:"Comment Added",
            comment,
            success:true
        })
    } catch (err) {
        console.log(err);
    }
}




export const getCommentsOfPost=async(req,res)=>{
    try {
        const postId=req.params.id
        const comments=await Comment.find({post:postId}).populate("author","username,profilePicture")

        if(!comments) return res.status(404).json({messga:"No comments found for this post",success:false})
            return res.status(200).json({success:true,comments})
    } catch (error) {
       console.log(error); 
    }
}


export const deletePost=async (req,res)=>{
    try {
        const postId=req.params.id
        const authorId=req.id

        const post =await Post.findById(postId)
        if(!post) return res.status(404).json({message:"Post not found",success:false})
// check if the logged in user is the ownwerr of the post

        if(post.author.toString() !== authorId ) return res.status(403).json({message:"Unauthorized"})


            // delete post

            await post.findByIdAndDelete(postId)

            // remove the post id form user

            let user=await User.findById(authorId)
            user.posts=user.posts.filter(id=>id.toString()!== postId)

            // delete associatedd comments

            await Comment.deleteMany({post:postId})


            return res.status(200).json({
                message:"post Deleted",
                success:true

            })
    } catch (error) {
        
    }
}

export const bookMarkPost=async(req,res)=>{
    try{
        const postId=req.params.id
        const authorId=req.id
const post =await Post.findById(postId)

if(!post){
    return res.status(404).json({
        message:"post not found",
        success:false
    })
}

const user=await User.findById(authorId)

if(user.bookmarks.includes(post._id)){
// /already marked ===> remove from gtghe bookmark
await user.updateOne({$pull:{bookmarks:post._id}})
await user.save()
return res.status(200).json({
    type:'saved',
    message:"Post removed from bookmark",
    success:true
})
}
else{
    //  book mark karna padega
}
    }catch(err){

    }
}