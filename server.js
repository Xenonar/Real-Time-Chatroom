// 4.0 TODO: Add authentication with passportjs
// 2.0 make server
const express = require("express");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// 2.0 route
const rooms = {};
app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
});
app.get("/:room", (req, res) => {
  // check the room doesn't exist
  if (rooms[req.params.room] == null) {
    return res.redirect("/");
  }
  res.render("room", { roomName: req.params.room });
});
// get post server
app.post("/room", (req, res) => {
  //check room is not exist
  if (rooms[req.body.room] != null) {
    return res.redirect("/");
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(req.body.room);
  // send message that new room was created by broadcast to everyone
  io.emit("room-created", req.body.room);
});

// listen port
server.listen(3000);

// 2>users array
const users = {};

io.on("connection", socket => {
  // DEBUG:
  let userAdd = socket.handshake.address;
  console.log("new user IP:" + userAdd);
  // 2> get new username
  socket.on("new-user", (room, name) => {
    // 2.0 make user to the right room
    socket.join(room);
    //2.0 put the user to right roo,
    rooms[room].users[socket.id] = name;
    socket.broadcast.emit("user-connected", room, name);
  });
  // send to client
  // psocket.emit("chat-message", "Hello" + users[socket.id]);
  //handle for send-chat-message
  socket.on("send-chat-message", (room, message) => {
    if (message == "0") {
      // 2.0 send msg to specific room
      socket.to(room).broadcast.emit("chat-message", {
        message: "This is 0",
        name: rooms[room].users[socket.id]
      });
    } else {
      // DEBUG: show in console
      console.log(message);
      // send to other user expect sender => broadcast
      socket.broadcast.emit("chat-message", {
        message: message,
        name: rooms[room].users[socket.id]
      });
    }
  });
  socket.on("disconnect", () => {
    getUserRoom(socket).forEach(room => {
      socket.broadcast.emit("user-disconnected", rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
  // 3.0 Force login
});
function getUserRoom(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) name.push(name);
    return names;
  }, []);
}
