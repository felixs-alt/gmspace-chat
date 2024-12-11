const btn = document.getElementById("btn")
const sock = new WebSocket("ws://localhost:2939")
var clicks = 0
var multiplier = 1
var id = []
const uname = document.getElementById("username")
let leader = {}

if (localStorage.leader) {
    leader = JSON.parse(atob(localStorage.leader))
}

function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

async function Signup() {
    id = [generateGUID(),"Anon",getColor()]
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
    clicks = Number(clicks) + multiplier
    document.getElementById("btntext").innerHTML = clicks
}

function getColor(){ 
    return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
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
sock.onmessage = async function(msg){ 
    data = JSON.parse(msg.data)
    leader[data[0][0]] = { rank: 0, name: data[0][1], score: data[1], color:data[0][2]}
    localStorage.leader = btoa(JSON.stringify(leader))
    updateArray(leader)
}
  function updateArray(data) {
  let container = document.querySelector(".leadercontainer");
  container.innerHTML = ""

  data = Object.values(data)
  console.log(data)
  data.sort((a, b) => {
      if (b.score === a.score) {
        return a.name.localeCompare(b.name); // Sort by name if scores are equal
      }
      return b.score - a.score; // Sort by score in descending order
    })
    .forEach((e, i) => (e.rank = i));
  
  data.forEach((el, i) => {
    let box = document.createElement("div");
    box.className = "team";
    box.style.setProperty("--i", i);
    let name = document.createElement("span");
    name.style.setProperty("color", el.color);
    name.className = "name";
    name.innerHTML = el.name;
    let score = document.createElement("span");
    score.style.setProperty("color", el.color);
    score.className = "score";
    let icon = document.createElement("i");
    icon.className = "fa-solid fa-" + el.name;
    score.innerHTML = el.score;
    box.appendChild(icon);
    box.appendChild(name);
    box.appendChild(score);
    box.style.setProperty("--color", "#1a1a1a");
    container.appendChild(box);
  
  });
}


btn.onclick = async function (e){
    OnClick()
    clickParticles(e)
}
