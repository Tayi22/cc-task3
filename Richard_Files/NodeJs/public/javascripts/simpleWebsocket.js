console.log("Websocket runns here");

if (window.localStorage.getItem("id") == ""){
  window.location.href = "/";
}

const ws = new WebSocket('ws://ec2-107-23-145-152.compute-1.amazonaws.com:8080/');
var progress;


ws.onopen = function() {
    console.log('WebSocket Client Connected');
    let id = window.localStorage.getItem("id");
    ws.send(JSON.stringify({
      method: "start",
      value: id
    }));
};

ws.onmessage = function(e) {
  console.log("Received: '" + e.data + "'");
  progress += 10;
  if (progress > 100) return;
  document.getElementById("bar").style.width = progress + "%"
};

function activateStream(){
  var elem = document.getElementById("bar");
  progress = 0;
  elem.style.width = progress + "%";
  
  
  ws.send(JSON.stringify({
    id: window.localStorage.getItem("id"),
    method: "activate",
    value: true
  }));
}

function deActivateStream(){
  ws.send(JSON.stringify({
    id: window.localStorage.getItem("id"),
    method: "activate",
    value: false
  }));
}



