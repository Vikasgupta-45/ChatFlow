import User from "../models/User.js";
import jwt from "jsonwebtoken";


export const protect =async (req,res,next)=>{
    let token = req.headers.authorization;
    try{
        if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // 2️⃣ Extract token
    const token = req.headers.authorization.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Find user
    const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message:"User not found"});
        }
        req.user = user;
        next();
    }
    catch(error){
        return res.status(401).json({message:"Token is not valid"});
    }
}
export default protect;