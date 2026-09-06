import express from "express";
import { env } from "./config/env.js";
import { connectRedis } from "./config/redis.config.js";
import { connectDB } from "./config/db.config.js";
import rateLimit from "express-rate-limit";
import router from "./routes/products.routes.js";

const app = express();
app.use(express.json());


const ratelimiter = rateLimit({
        windowMs : 30 * 1000 , // 30 seconds
        max : 120 , 
        standardHeaders : 'draft-8' , 
        legacyHeaders : false ,
        ipv6Subnet: 56 ,
        message : {
            success : false ,
            message : "Too many requests from this IP, please try again after a minute"
        }
});
    
app.use(ratelimiter);

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.get("/health", (req, res) => {
    res.status(200).json({
        success : true ,
        message : "Server is healthy"
    })
})

app.use("/" , router);



const startServer = async () => {
    try {
        await connectRedis();
        await connectDB();  
        app.listen(env.port, () => {
            console.log(`Server is running on port ${env.port}`);
        })
    } catch (error) {
        console.error("Error starting server", error);
    }
}

startServer();  