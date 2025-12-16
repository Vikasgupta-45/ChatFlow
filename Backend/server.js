import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageroutes.js";

const app = express();
//connect to database

await connectDB();

//middleware 
app.use(cors());
app.use(express.json());


//Routes
app.get("/", (req, res) => {
    res.send("Server is live");
});
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


