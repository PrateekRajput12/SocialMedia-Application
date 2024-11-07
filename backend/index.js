import express,{ urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connect } from 'mongoose'
import connectDB from './utils/db.js'
import userRoute from './routes/user.routes.js'
dotenv.config({})

const app=express()

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"I'm coming from backend",
        success:true

    })
})

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))
const corsOption={
    origin:"http://localhost:5173",
    credentials:true
}

app.use(cors(corsOption))

const PORT=process.env.PORT || 8000
app.use("/api/v1/user",userRoute)

app.listen(PORT,()=>{
   if(connectDB())
    console.log(`Server is listening on PORT :${PORT}`);
else{
    console.log("Not connected");
}
})