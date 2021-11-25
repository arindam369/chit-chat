const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer(app);

app.use(express.static("public"));


const PORT = process.env.PORT || 3000;
http.listen(PORT,function(){
    console.log(`Server is running on port:${PORT}`);
})



app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})


// socket connection

const io = require("socket.io")(http);

io.on("connection", (socket) => {
    console.log("Socket connection  established successfully...");
    socket.on("message",function(msg){
        socket.broadcast.emit('message',msg)
    });
    socket.on("user-joined",function(username){
        socket.username = username;
        socket.broadcast.emit('user-joined',username);
    })
    socket.on("disconnect",function(username){
        if(socket.username){
            socket.broadcast.emit("user-left",socket.username);
        }
    })
})
