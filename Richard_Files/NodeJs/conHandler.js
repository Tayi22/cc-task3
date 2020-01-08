var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1"
});

var lambda = new AWS.Lambda();


module.exports = function(){
    var conArr = [];
    
    

    this.addCon = function(connection_, id_, filename_){
        for (var i = 0; i < conArr.length; i++){
            if (conArr[i].id == id_ ) return;
        }
        
        var conObj = {
            connection: connection_,
            id: id_,
            fileName: filename_,
            active: true
        };
        
        conArr.push(conObj);
        console.log("Connection added");
    };

    
    this.setActiveStatus = function(status, id){
        conArr.forEach(function(arrayItem){
           if (arrayItem.id == id){
               arrayItem.active = status;
               console.log(id + " set " + status);
           } 
        });
    };
    
    this.loopConArr = function(){
        if (conArr.length == 0) return;
        conArr.forEach(function(arrayItem, index, object){
            // console.log(arrayItem.id + " " + arrayItem.fileName);
            if (arrayItem.connection.state == 'closed'){
                object.splice(index, 1);
                console.log("Connection " + arrayItem.id + " removed.");
                return;
            }
            if (!arrayItem.active) return;
            var params = {
                FunctionName: "getFileCalcData",
                InvocationType: "RequestResponse",
                LogType: "Tail",
                Payload: '{ "username" : "' + arrayItem.id + '", "file" : "' + arrayItem.fileName + '"}'
            };
            
            lambda.invoke(params, function(err, data){
                if (err) {
                    console.log("error in loopOnArr " + err.message)
                } else {
                    const calcDataLambda = JSON.parse((JSON.parse(data.Payload)).body);
                    var calcData = new Object();
                    calcData.wordCount = calcDataLambda.wordCount;
                    calcData.finished = calcDataLambda.finished;
                    if (calcDataLambda.finished){
                        arrayItem.active = false;
                        calcData.buttonName = "Back to Main";
                    }
                    arrayItem.connection.send(JSON.stringify(calcData));
                }
            })
        });
    };
    
    this.sendToCon = function(id, wordCount, finish){
        
        if (conArr.length == 0) return;
        var jsonObj = new Object();
        jsonObj.wordCount = wordCount;
        jsonObj.finish = finish;
        conArr.forEach(function(arrayItem){
            if (arrayItem.id == id){
                arrayItem.connection.send(JSON.stringify(jsonObj));
                return;
            }
        });
    };
    
    this.printMe = function(){
       if (conArr.length == 0) return "Nothing here";
       var returner = "";
       conArr.forEach(function(arrayItem){
          returner += arrayItem.id; 
       });
       return returner;
    };
    
    
};