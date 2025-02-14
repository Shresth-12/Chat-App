import express from "express"
import zod from "zod"
import {User} from "../db.js";
import { JWT_SECRET } from "../config.js"
import pkg from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../middleware.js";
import cloudinary from "../lib/cloudinary.js";
const { sign } = pkg;
const router=express.Router();

const signupbody=zod.object({
email:zod.string().email(),
fullName:zod.string(),
password:zod.string(),
})

router.post("/signup",async (req,res)=>{
    const validationResult = signupbody.safeParse(req.body);
    if(!req.body.email || !req.body.password || !req.body.fullName)
        {
            return res.status(400).json({
                message:"All fields are required"
            })
        }
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.format()
            });
        }
if(req.body.password.length<6)
{
    return res.status(400).json({
        message:"Password should be of atleast 6 characters"
    })
}
const existinguser=await User.findOne({
    email:req.body.email,
})
if(existinguser)
{
    return res.status(411).json(
        {
            message:"User Already Exists"
        }
    )
}
const salt=await bcrypt.genSalt(11)
const hashedpassword=await bcrypt.hash(req.body.password,salt)
const user=await User.create({
    email:req.body.email,
    password:hashedpassword,
    fullName:req.body.fullName
})
const userId=user._id
    const token=sign({
        userId
    },JWT_SECRET)
    res.json({
        message:"User Created Successfully",
        token:token,
        userId:userId
    })
})

const signinbody=zod.object({
    email:zod.string().email(),
    password:zod.string()
})

router.post("/signin",async (req,res)=>{
    const validationResult = signinbody.safeParse(req.body);
if(!req.body.email || !req.body.password)
{
    return res.status(400).json({
        message:"All fields are required"
    })
}
if (!validationResult.success) {
    return res.status(400).json({
        message: "Invalid input",
        errors: validationResult.error.format()
    });
}
const user=await User.findOne({
    email:req.body.email
})
if(user)
{
    const isCorrect=await bcrypt.compare(req.body.password,user.password)
    if(!isCorrect)
    {
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }
    const token=sign({
        userId:user._id
    },JWT_SECRET)
    res.json({
        token:token,
        userId:user._id
    })
    return
}
return res.status(411).json({
    message:"Error While Signing"
})
})

router.put("/update-profile",authMiddleware,async (req,res)=>{
    try
    {
        const profilePic=req.body.profilepic
        const userId=req.userId
        if(!profilePic)
        {
            return res.status(400).json({
                message:"Profile Pic is required"
            })
        }
        const uploadedresponse=await cloudinary.uploader.upload(profilePic)
        const updateduser=await User.findByIdAndUpdate(userId,{profilePic:uploadedresponse.secure_url},{new:true})

        res.status(200).json(updateduser)
    }
    catch(err)
    {
        console.log("Error in Update profile",err.message);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
})

router.post("/getuserinfo", async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findOne({
            _id:userId
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            id:user._id,
            email: user.email,
            name: user.fullName,
            time:user.createdAt,
            image:user.profilePic
        });
    } catch (error) {
        console.error("Error while getting user details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
export default router