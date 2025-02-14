import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
mongoose.connect(process.env.DB_URL)

const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      profilePic: {
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  );

  const messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        req:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        req:true
    },
    text:{
        type:String
    },
    image:{
        type:String
    }
  },{timestamps:true})

  export const User=mongoose.model("User",userSchema)
  export const Message=mongoose.model("Message",messageSchema)