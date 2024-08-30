import dotenv from "dotenv";
dotenv.config();  // Load environment variables at the very start

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import listingRouter from "./routes/listing.routes.js";

const app = express();
const port = process.env.PORT || 3000;

async function connectDB() {
    try {
        console.log('MONGO_URI:', process.env.MONGO_URI);  // Use MONGO_URI to match your .env file
        const client = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected");
    } catch (err) {
        console.log("Database connection error", err);
        process.exit(1);  // Exit the process with failure if DB connection fails
    }
}

connectDB();

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
