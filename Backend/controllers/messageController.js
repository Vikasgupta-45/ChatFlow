import Chat from "../models/chat.js"
import User from "../models/User.js"
import imagekit from "../config/imagekit.js"
import axios from "axios"
import openai from "../config/openai.js"

// Text-based AI Chat Message Controller
import { geminiModel } from "../config/gemini.js";

export const textMessageController = async (req, res) => {
  try {
    if (!req.user || req.user.credits < 1) {
      return res.status(400).json({ error: "Insufficient credits" });
    }

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

    res.json({ success: true, reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gemini API failed" });
  }
};

// Image-based AI Chat Message Controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(req.user.credits)
    if (req.user.credits < 2) {
      return res.status(400).json({ error: "Insufficient credits" });
    }

    const { chatId, prompt, isPublished } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    });

    const encodedPrompt = encodeURIComponent(prompt);

    const imageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/chatflow/${Date.now()}.png?tr=w-800,h-800`;

    const generatedImage = await axios.get(imageUrl, {
      responseType: "arraybuffer"
    });

    const base64Image = `data:image/png;base64,${Buffer
      .from(generatedImage.data, "binary")
      .toString("base64")}`;

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "chatflow",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -2 } }
    );

    return res.status(200).json({ success: true, reply });

  } catch (error) {
    console.error("Image generation failed:", error.message);
    if (error.response?.data) {
      // If responseType was arraybuffer, data is Buffer. Convert to string to see error message.
      try {
        const errorText = Buffer.isBuffer(error.response.data)
          ? error.response.data.toString('utf8')
          : JSON.stringify(error.response.data);
        console.error("Error details:", errorText);
      } catch (e) {
        console.error("Could not parse error response data");
      }
    }

    return res.status(500).json({
      error: error?.response?.data?.error || error.message || "Internal server error"
    });
  }
};


