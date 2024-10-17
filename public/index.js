const ws = new WebSocket("wss://2929-felixsalt-gmspacechat-c375sh9okr5.ws-eu116.gitpod.io/")
if(localStorage.id == undefined){
    localStorage.id = "User"+Math.round(Math.random() * (100 - 1) + 1);
}

document.getElementById("send").onclick = async function(){
    const msg = document.getElementById("msg").value
    console.log(ws.OPEN)
    ws.send(String(localStorage.id+" | "+msg))
}
ws.onmessage = function(msg){
    msg = new Date().toLocaleTimeString("en-GB",{hour: "numeric",minute: "2-digit"})+" | "+msg.data+"\n"
    document.getElementById("res").innerHTML+=msg
    window.scrollTo(0, document.body.scrollHeight);
}

