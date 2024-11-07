import mongoose from "mongoose";
// dotenv.config({})
const connectDB=async()=>
{
    try{
     await mongoose.connect(process.env.MONGODB_URL)
     console.log("Mongo Connected SuccessFully");
    }
    catch(e){
        console.log(e);
    }
}


export default connectDB