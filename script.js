let socket = io();
let username;
let typing = false;
let timeout;

let statusElm = document.getElementById("status");

while (!username) {
  username = window.prompt("What is your name?");
}

appendMsg(`<strong>You joined</strong>`, "left");

socket.emit("new-user", username);

document.getElementById("m").addEventListener("keypress", (e) => {
  const KEY_CODE = e.keyCode || e.which;
  if (KEY_CODE != 13) {
    typing = true;
    socket.emit("typing", { user: username, typing });
    clearTimeout(timeout);
    timeout = setTimeout(typingTimeout, 1000);
  } else {
    clearTimeout(timeout);
    typingTimeout();
  }
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  let m = document.getElementById("m");
  appendMsg(`<strong>You</strong>: ${m.value}`, "left msg");
  socket.emit("chat-message", m.value);
  m.value = "";
  m.focus();
  return false;
});

socket.on("typing_status", (data) => {
  if (data.typing) {
    statusElm.innerText = `${data.user} is typing...`;
  } else {
    statusElm.innerText = ``;
  }
});

socket.on("chat-message", (data) => {
  appendMsg(`<strong>${data.username}</strong>: ${data.message}`, "right msg");
});

socket.on("user-connected", (user) => {
  appendMsg(`<strong>${user} connected</strong>`, "right");
});

socket.on("user-disconnected", (user) => {
  appendMsg(`<strong>${user} disconnected</strong>`, "right");
});

function appendMsg(data, className) {
  let li = document.createElement("li");
  li.className = className;
  li.innerHTML = data;
  document.getElementById("messages").appendChild(li);
}

function typingTimeout() {
  socket.emit("typing", { user: username, typing: false });
}