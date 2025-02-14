import express from 'express'
import rootRouter from "./routes/index.js"
import dotenv from "dotenv"
import cors from "cors"
import { server,app } from './lib/socket.js'
dotenv.config();
app.use(cors())
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Increase URL-encoded data limit
app.use(express.json());
app.use("/api/v1",rootRouter)
server.listen(process.env.PORT,()=>{
    console.log(`App is running on port ${process.env.PORT}`)
})