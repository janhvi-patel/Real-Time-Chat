const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

let users = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/script", (req, res) => {
  res.sendFile(__dirname + "/script.js");
});

io.on("connect", (socket) => {
  socket.on("new-user", (user) => {
    users[socket.id] = user;
    socket.broadcast.emit("user-connected", user);
  });
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing_status", data);
  });
  socket.on("chat-message", (msg) => {
    socket.broadcast.emit("chat-message", {
      username: users[socket.id],
      message: msg,
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(port, () => {
  console.log(`Listeing to http://localhost:${port}`);
});