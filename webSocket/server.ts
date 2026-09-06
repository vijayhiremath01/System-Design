import express from "express"
import http from "http"
import { json } from "stream/consumers";
import {WebSocket , WebSocketServer} from "ws"

const app = express();
app.use(express.json());

app.get("/" , (req , res) => {
    res.json({ message: "HTTP server is running" })
})

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection" , (socket : WebSocket)=> {
    console.log("Client connected")

    socket.send(JSON.stringify({type:"Welcome" , message : "WebSocket connected !"}))

    socket.on("message" , (data) => {
        const text = data.toString();
        console.log("Received:", text);

        socket.send(JSON.stringify({type:"reply" , mesaage : `server recieved ${text}`}));
    });

    socket.on("close" , () => {
        console.log("Client disconnected")
    })
});

server.listen(3000 , () => {
    console.log("Server is running in PORT 3000")
})