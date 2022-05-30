console.log("Chit Chat Console -- created by Arindam");
const headLogo = document.getElementById("head-logo");
const messageTextarea = document.getElementById("message-textarea"); 
const messageContainer = document.getElementById("message-container");
const typingContainer = document.getElementById("typing-text");
const form = document.getElementById("form");
const onlineUsersDiv = document.getElementById("onlineUsers");
const socket = io();

let name;

var onlineUsers = [];

while(!name){
    name = prompt("Enter Your Name : ");
    socket.emit("user-joined",name);
}

socket.on("online-users", (onlines)=>{
    onlineUsers = onlines;
})
let flag=0;
headLogo.addEventListener("click", function(){
    if(flag==0){
        flag=1;
        onlineUsersDiv.style.display = "flex";
        onlineUsers.forEach((onlineUser)=>{
            var onlineUserDiv = document.createElement("div");
            onlineUserDiv.id = "online-user";
            onlineUserDiv.classList.add("onlineUser");
    
            const iDiv = document.createElement("i");
            iDiv.classList.add("fa", "fa-circle");
            const pDiv = document.createElement("p");
            pDiv.innerHTML = onlineUser;
            
            onlineUserDiv.appendChild(iDiv);
            onlineUserDiv.appendChild(pDiv);
            onlineUsersDiv.appendChild(onlineUserDiv);
        })
    }
    else{
        flag=0;
        onlineUsers.forEach((onlineUser)=>{
            document.getElementById("online-user").remove();
        })
    }
})

messageTextarea.addEventListener("keyup",function(e){
    if(e.key=='Enter' && e.target.value.trim() != ""){
        sendMessage(e.target.value)
        e.target.value="";
    }
})


// typing :
// messageTextarea.addEventListener("keypress", ()=>{
//     socket.emit("typing", name);
// })
messageTextarea.addEventListener("keyup", ()=>{
    socket.emit("typing", name);
})

form.addEventListener("submit",function(e){
    e.preventDefault();
    if(e.target[0].value != ""){
        sendMessage(e.target[0].value);
    }
    form.reset();
})

socket.on("disconnect",function(name){
    socket.emit("user-left",name);
})

function sendMessage(msg){

    let msgObj = {
        username :  name,
        message : msg.trim()
    }

    let mymessageDiv = document.createElement("div");
    mymessageDiv.classList.add("mymessage");

    let nameDiv = document.createElement("div");
    nameDiv.classList.add("username");
    nameDiv.innerHTML = `<p> ${msgObj.username}</p>`;


    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = `${msgObj.message}`;

    let timeP = document.createElement("p");
    timeP.classList.add("time");
    let today = new Date();
    let hour = today.getHours();
    let min = today.getMinutes();
    let sendingTime = "";
    if(min<10){
        min = "0"+min;
    }
    if(hour>12){
        sendingTime = (hour-12) + ":" + min + " PM";
    }
    else{
        sendingTime = hour + ":" + min + " AM";
    }
    timeP.innerHTML = sendingTime;

    mymessageDiv.appendChild(nameDiv);
    mymessageDiv.appendChild(messageDiv);
    mymessageDiv.appendChild(timeP);
    messageContainer.appendChild(mymessageDiv);

    // send message to the server
    socket.emit('message',msgObj);

    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function receiveMessage(msgObj){
    let mymessageDiv = document.createElement("div");
    mymessageDiv.classList.add("friend-message");

    let nameDiv = document.createElement("div");
    nameDiv.classList.add("username");
    nameDiv.innerHTML = `<p> ${msgObj.username}</p>`;

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = `${msgObj.message}`;

    let timeP = document.createElement("p");
    timeP.classList.add("time");
    let today = new Date();
    let hour = today.getHours();
    let min = today.getMinutes();
    let sendingTime = "";
    if(min<10){
        min = "0"+min;
    }
    if(hour>12){
        sendingTime = (hour-12) + ":" + min + " PM";
    }
    else{
        sendingTime = hour + ":" + min + " AM";
    }
    timeP.innerHTML = sendingTime;

    mymessageDiv.appendChild(nameDiv);
    mymessageDiv.appendChild(messageDiv);
    mymessageDiv.appendChild(timeP);
    messageContainer.appendChild(mymessageDiv);

    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function joinMessage(username){
    let mymessageDiv = document.createElement("div");
    mymessageDiv.classList.add("join-message");

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = `${username} joined the chat`;

    mymessageDiv.appendChild(messageDiv);
    messageContainer.appendChild(mymessageDiv);
}

function leaveMessage(username){
    let mymessageDiv = document.createElement("div");
    mymessageDiv.classList.add("join-message");

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = `${username} left the chat`;

    mymessageDiv.appendChild(messageDiv);
    messageContainer.appendChild(mymessageDiv);
}


function typingMessage(username){
    typingContainer.textContent = `${username} is typing...`;
    setTimeout(() => {
        typingContainer.textContent="";
    }, 2000);
}


// Receive Message from the server
socket.on("message",function(msg){
    receiveMessage(msg);
})

socket.on("user-joined",function(username){
    joinMessage(username);
})

socket.on("user-left",function(username){
    leaveMessage(username);
})

socket.on("user-typing", function(username){
    typingMessage(username);
})