function Sidebar() {
    if(document.getElementById("sidebar").style.width == "45%"){
        document.getElementById("sidebar").style.width = "0";
    } else {
        document.getElementById("sidebar").style.width = "45%"; 
    }
}