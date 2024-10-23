const socket = io('https://gmspace-chat.fly.dev');
socket.on('user-count-change', function (userCount) {
  console.log(userCount);
  document.getElementById("billedMsg").innerHTML = String(userCount+" Users Online")
});