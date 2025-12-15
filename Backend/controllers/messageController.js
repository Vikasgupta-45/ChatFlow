import Chat from "../models/chat.js"
import User from "../models/User.js"
import imagekit from "../config/imagekit.js"
import axios from "axios"
import openai from "../config/openai.js"

// Text-based AI Chat Message Controller
import { geminiModel } from "../config/gemini.js";

export const textMessageController = async (req, res) => {
  try {
    // if (!req.User || req.User.credits < 1) {
    //   return res.status(400).json({ error: "Insufficient credits" });
    // }

    const { chatId, prompt } = req.body;
    const userId = req.user._id; 

    console.log(userId);

    if (!chatId || !prompt) {
      return res.status(400).json({
        error: "chatId and prompt are required",
      });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });
console.log(prompt)
    // Call Gemini
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    const reply = {
      role: "assistant",
      content: text,
      timestamp: Date.now(),
      isImage: false,
    };

    // Save reply
    chat.messages.push(reply);
    await chat.save();

    // Deduct credits
    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    return res.status(200).json(reply);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gemini API failed" });
  }
};

// Image-based AI Chat Message Controller
 export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        if(req.user.credits < 2){
            return res.status(400).json({error: "Insufficient credits"})
        }
        const {chatId, prompt,isPublished} = req.body
        const chat = await Chat.findOne({userId, _id: chatId})
        chat.messages.push({role: "user",
             content: prompt, 
             timestamp: Date.now(),
              isImage: false})
              //encode the prompt
              const encodedPrompt = encodeURIComponent(prompt)
              const imageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/chatflow/${Date.now()}.png?tr=w-800
              h-800`
               
              const generatedImage = await axios.get(imageUrl, {responseType: "arraybuffer"})
              //convert the image to base64
              const base64Image = `data:image/png;base64,${Buffer.from(generatedImage.data, "binary").toString("base64")}`
           //upload to imagekit
           const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "chatflow",
           })
           const reply ={
                role: "assistant",
                content: uploadResponse.url,
                timestamp: Date.now(),
                isImage: true,
                isPublished,
           }
              //add the image to the messages
              chat.messages.push(reply)
                  await chat.save()
                  await User.updateOne({_id: userId}, {$inc: {credits: -2}})
                  return res.status(200).json(reply)

     
    } catch (error) {
        const detail = error?.response?.data?.error || error?.message || "Internal server error"
        res.status(500).json({error: detail})
    }
}
