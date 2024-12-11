const btn = document.getElementById("btn")
const sock = new WebSocket("wss://2939-felixsalt-gmspacechat-pp1ubiogkhx.ws-eu117.gitpod.io/")
var clicks = 0
var id = []
const uname = document.getElementById("username")


async function Signup() {
    id = [crypto.randomUUID(),"Anon"]
    localStorage.user = JSON.stringify(id)
}   

if (!localStorage.user) {
    Signup()
} else {
    id = JSON.parse(localStorage.user)
    if (id[1] != "Anon") {
        uname.value = id[1]
    }
    if (localStorage.clicks) {
        decompress(localStorage.clicks).then(result => {
            clicks=result
            document.getElementById("btntext").innerHTML = clicks
        })
    }
}

function OnClick() {
    clicks ++
    document.getElementById("btntext").innerHTML = clicks
}

async function compress(string) {
    var dec = new TextDecoder("utf-8");
    const byteArray = new TextEncoder().encode(string);
    const cs = new CompressionStream("gzip");
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    const buffer = await new Response(cs.readable).arrayBuffer()
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function decompress(string) {
    const cs = new DecompressionStream("gzip");
    const writer = cs.writable.getWriter();
    const buffer = new Uint8Array([...atob(string)].map(char=>char.charCodeAt(0))).buffer
    writer.write(buffer);
    writer.close();
    return new Response(cs.readable).arrayBuffer().then(function(arrayBuffer) {
        return new TextDecoder().decode(arrayBuffer);
    });
}


async function updateClicks() {
    localStorage.clicks=await compress(clicks)
    if (uname.value != "") {
        id[1] = uname.value
        localStorage.user = JSON.stringify(id)
    } else {
        id[1] = "Anon"
        localStorage.user = JSON.stringify(id)
    }
    sock.send(JSON.stringify([id,clicks]))
}
sock.onopen = () => {
    updateClicks()
    setInterval(updateClicks,175)
}
sock.onmessage = function(msg){ 
    document.getElementById("clicknum").innerText = JSON.parse(msg.data)[1]
}
btn.onclick = OnClick
