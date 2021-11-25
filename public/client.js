console.log("Chit Chat Console -- created by Arindam");
const messageTextarea = document.getElementById("message-textarea"); 
const messageContainer = document.getElementById("message-container");
const form = document.getElementById("form");
const socket = io();

let name;
while(!name){
    name = prompt("Enter Your Name : ");
    socket.emit("user-joined",name);
}

messageTextarea.addEventListener("keyup",function(e){
    if(e.key=='Enter'){
        sendMessage(e.target.value)
        e.target.value="";
    }
})
form.addEventListener("submit",function(e){
    e.preventDefault();
    console.log(e.target[0].value);
    sendMessage(e.target[0].value);
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

    mymessageDiv.appendChild(nameDiv);
    mymessageDiv.appendChild(messageDiv);
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

    mymessageDiv.appendChild(nameDiv);
    mymessageDiv.appendChild(messageDiv);
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

