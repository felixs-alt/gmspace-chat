const ws = new WebSocket("wss://gmspace-chat.fly.dev:2929")
const username = document.getElementById("username")
if(localStorage.id){
    username.value = localStorage.id
}

document.getElementById("send").onclick = sendMessge
document.getElementById("msg").onkeydown = async function(e){
    if(e.key == "Enter"){
        sendMessge()
    }
}
async function sendMessge(){
    const msg = document.getElementById("msg").value
    if (msg == "") {
        return
    }
    var id = ""
    if(username.value == "") {
        id = "Anon"
    } else {
        localStorage.id = username.value
        id = username.value
    }
    ws.send(String("("+id+") "+msg))
    document.getElementById("msg").value = ""
}
ws.onmessage = function(msg){
    msg = new Date().toLocaleTimeString("en-GB",{hour: "numeric",minute: "2-digit"})+" | "+msg.data+"\n"
    document.getElementById("res").innerHTML+=msg
    window.scrollTo(0, document.body.scrollHeight);
}

