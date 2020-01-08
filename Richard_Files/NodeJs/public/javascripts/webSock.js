console.log("webSock aktivate");
const id = window.localStorage.getItem("id");
const wsUrl = 'wss://'+ window.location.host + '/';
const fileName = document.getElementById("filename").innerHTML;

const ws = new WebSocket(wsUrl);

ws.onopen = function() {
    console.log('WebSocket Client Connected');
    ws.send(JSON.stringify({
      method: "start",
      value: id,
      fileName: fileName
    }));
};

ws.onmessage = function(e) {
    const recvData = JSON.parse(e.data);
    const wordCount = recvData.wordCount
    const finish = recvData.finished;
    const buttName = recvData.buttonName;
    var ret = wordCount;
    if (finish) ret += " (Finished)";
    console.log(recvData);
    document.getElementById("progress").innerHTML = "WordCount: " + ret;
    if (buttName != undefined){
        document.getElementById("backToMainBut").innerHTML = buttName;
    }
    
};