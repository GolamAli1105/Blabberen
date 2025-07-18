import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.findById(loggedInUserId).populate({
            path: "contacts",
            select: "-password",
        });

        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log("Error in getUsersForSidebar controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const searchUsers = async (req, res) => {
    try{
        const { query } = req.query;
        const users = await User.find({
            fullName: { $regex: query, $options: "i" },
            _id: { $ne: req.user._id }, 
        }).limit(10);
        res.status(200).json(users);
    }
    catch(error){
        console.log("Error in searchUsers controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const getMessages = async (req, res) => {
    try{
        const {id:userToChatId} = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId:userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ],
        });

        res.status(200).json(messages);
    }
    catch(error){
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const sendMessages = async (req, res) => {
    try{
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
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

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    }
    catch(error){
        console.log("Error in sendMessages controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};