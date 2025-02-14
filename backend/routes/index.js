import express from "express"
import userRouter from "./user.js"
import messageRouter from "./message.js"
const router=express.Router();

router.use("/user",userRouter)
router.use("/message",messageRouter)
export default router