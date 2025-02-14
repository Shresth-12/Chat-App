import express from "express";
import { authMiddleware } from "../middleware.js";
import { Message, User } from "../db.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const router = express.Router();

// Fetch all users except the authenticated user
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (err) {
    console.log("Error in fetching Users", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch messages between sender and receiver
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const senderId = req.userId;
    const { id: receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { receiverId: senderId, senderId: receiverId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getting messages", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Send a new message
router.post("/send/:id", authMiddleware, async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Emit only to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error while sending message:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
