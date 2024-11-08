
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { getMessage, sendMessage } from "../controlers/message.controller.js";
import { addComment, addNewPost, bookMarkPost, deletePost, disLikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from "../controlers/post.controller.js";
const router=express.Router()

router.route('/addpost').post(isAuthenticated,upload.single('image'),addNewPost)
router.route('/all').post(isAuthenticated,getAllPost)
router.route('/userpost/all').post(isAuthenticated,getUserPost)
router.route('/:id/like').post(isAuthenticated,likePost)
router.route('/:id/dislike').post(isAuthenticated,disLikePost)
router.route('/:id/comment').post(isAuthenticated,addComment)
router.route('/:id/comment/all').post(isAuthenticated,getCommentsOfPost)
router.route('/delete/:id').post(isAuthenticated,deletePost)
router.route('/:id/bookmark').post(isAuthenticated,bookMarkPost)





export default router