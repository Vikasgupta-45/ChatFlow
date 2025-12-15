import Chat from "../models/chat.js";

export const createChat = async (req, res) => {
    try {
        const userId=req.user.id;
        const chatData = {
            userId,
            username:req.user.username,
            name:"new chat",
        };
        const chat = await Chat.create(chatData);
        res.status(201).json(chat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//api to get all chats of a user
export const getChats = async (req, res) => {
    try {
        const userId=req.user.id;
        const chats = await Chat.find({userId}).sort({updatedAt:-1});
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//api to delete a chat
export const deleteChat = async (req, res) => {
    try {
        const userId=req.user.id;
        const chatId=req.params.id;
        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(404).json({message:"Chat not found"});
        }
        if(chat.userId.toString()!==userId){
            return res.status(401).json({message:"Not authorized"});
        }
        await chat.deleteOne();
        res.status(200).json({message:"Chat deleted"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
