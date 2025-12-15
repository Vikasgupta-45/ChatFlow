import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";



//JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
//API to register a user
export const registerUser = async (req, res) => {
    
        const { username, email, password } = req.body;
        try{
            const userExist = await User.findOne({email});
            if(userExist){
                 return res.status(400).json({message:"User already exists"});
            }
           const  user = await User.create({
                username,
                email,
                password,
           });
           //generate token
           const token = generateToken(user._id);
           res.json({success:true,token});
        }
        catch(error){
            return res.status(400).json({message:error.message});
        }
      
}

//API to login a user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        //generate token
        const token = generateToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//API to get user profile
export const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.json({success:true,user});   
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// API to get published images
// API to get published images
export const getPublishedImages =async (req, res) => {
    try {
            const publishedImageMessages = await Chat.aggregate([ {$unwind: "$messages"},
             {
              $match: {
                "messages.isImage": true,
                "messages.isPublished": true
            }
        },{
            $project:{
                _id:0,
                imageUrl:"$messages.content",
                 username:"$username",
            }
        }
    ]);
    res.status(200).json(publishedImageMessages.reverse());
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
