const btn = document.getElementById("btn")
const sock = new WebSocket("wss://2939-felixsalt-gmspacechat-pp1ubiogkhx.ws-eu117.gitpod.io/")
var clicks = 0
var id = []
const uname = document.getElementById("username")
let leader = {"1":{ rank: 0, name: "horse", score: 0, color: "#006635" },"2":{ rank: 0, name: "cat", score: 0, color: "#191966" },"3":{ rank: 0, name: "dog", score: 0, color: "#275929" }}

function guidToSeed(guid) {
    // Remove non-alphanumeric characters
    const cleaned = guid.replace(/[^a-fA-F0-9]/g, '');
    // Convert to a number by taking a portion of the GUID
    return parseInt(cleaned.slice(0, 13), 16); // Slice for 13 digits max (Number limit)
}

function seededRandom(seed) {
    let value = seed;
    return function () {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    };
}

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

function getColor(seed){ 
    return "hsl(" + 360 * seededRandom(seed) + ',' +
               (25 + 70 * seededRandom(seed)) + '%,' + 
               (85 + 10 * seededRandom(seed)) + '%)'
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
    const seed = guidToSeed(data[0][0])
    leader[data[0][0]] = { rank: 0, name: data[0][1], score: data[1], color: getColor(seed) }
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
    name.className = "name";
    name.innerHTML = el.name;
    let score = document.createElement("span");
    score.className = "score";
    let icon = document.createElement("i");
    icon.className = "fa-solid fa-" + el.name;
    score.innerHTML = el.score;
    box.appendChild(icon);
    box.appendChild(name);
    box.appendChild(score);
    box.style.setProperty("--color", el.color);
    container.appendChild(box);
  
  });
}


btn.onclick = OnClick
