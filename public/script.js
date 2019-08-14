const socket = io("http://localhost:3000");
// Get messageform
const messageForm = document.getElementById("send-container");
// get message input
const messageInput = document.getElementById("message-input");
// get message container
const messageContainer = document.getElementById("message-container");
// get room container
const roomContainer = document.getElementById("room-container");

// 2> get username
// const name = prompt("Vad heller du?");
// appendMessage("Welcome : " + name);
// socket.emit("new-user", name);

// 2.0 check messageform

if (messageForm != null) {
  const name = prompt("Vad heller du?");
  appendMessage("Welcome : " + name);
  socket.emit("new-user", roomName, name);
  messageForm.addEventListener("submit", e => {
    // Prevent automatic refresh page
    e.preventDefault();
    // get msg
    const message = messageInput.value;
    //3> show msg you sent
    //6> Add limitation for sending and showing
    if (message == "0") {
      appendMessage("You sent : 0");
    } else if (message == "332") {
      // block msg to sent
      return 0;
    } else {
      appendMessage("You bid : " + message);
    }

    // in order to send the msg to server
    socket.emit("send-chat-message", roomName, message);
    // reset the message input
    messageInput.value = "";
  });
}
// get room
socket.on("room-created", room => {
  const roomElement = document.createElement("div");
  roomElement.innerText = room;
  const roomLink = document.createElement("a");
  roomLink.href = "/" + room;
  roomLink.innerText = "Join";
  roomContainer.append(roomElement);
  roomContainer.append(roomLink);
});

// open socket for received data from server.js with the same id 'chat-message'
socket.on("chat-message", data => {
  //Debug: show data
  // console.log(data);
  appendMessage(data.name + ": " + data.message);
});
// open socket for received data from server.js with the same id 'user-connected'
socket.on("user-connected", name => {
  //Debug: show data
  // console.log(data);
  appendMessage(name + " connected");
});
// 4> disconenect user
// open socket for received data from server.js with the same id 'user-connected'
socket.on("user-disconnected", name => {
  //Debug: show data
  // console.log(data);
  appendMessage(name + " disconnected");
});
// add listener to messageForm

// messageForm.addEventListener("submit", e => {
//   // Prevent automatic refresh page
//   e.preventDefault();
//   // get msg
//   const message = messageInput.value;
//   //3> show msg you sent
//   //6> Add limitation for sending and showing
//   if (message == "0") {
//     appendMessage("You sent : 0");
//   } else if (message == "332") {
//     // block msg to sent
//     return 0;
//   } else {
//     appendMessage("You bid : " + message);
//   }

//   // in order to send the msg to server
//   socket.emit("send-chat-message", message);
//   // reset the message input
//   messageInput.value = "";
// });

// appended fuction in order to append to <div> in index.html
function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
