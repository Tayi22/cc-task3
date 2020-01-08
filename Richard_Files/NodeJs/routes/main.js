var AWS = require("aws-sdk");
var lambda = new AWS.Lambda();
var express = require('express');
var router = express.Router();
var FormData = require("form-data");
var http = require("http");
var requestMod = require("request");

router.get('/cancel', function(req, res, next) {
    req.session.calculating = false;
    
    res.redirect("/main");
});

router.post('/calcFile', async function(req, res, next){
    if (req.session.username == undefined){
        res.redirect("/");
        return;
    }
    
    req.session.calculating = false;
    req.session.calcFile = req.body.file;
    req.session.wordCount = 0;
    const username = req.session.username;

    /*
    var params = {
        FunctionName: "getFileByFileName",
        InvocationType: "RequestResponse",
        LogType: "Tail",
        Payload: '{ "username" : "' + username + '", "file" : "' + req.body.file + '"}'
    };
    
    var fileDataResponse;
    
    try{
        fileDataResponse = await lambda.invoke(params).promise();
    } catch(e) {
        req.session.calculating = false;
        res.render("error", {dynError : "Error while accessing File " + e.message});
        return;
    }
    const fileContent = JSON.parse(fileDataResponse.Payload);
    
    
    */
        
    var reqJson = new Object();
    reqJson.username = username
    reqJson.file = req.body.file;
    console.log(JSON.stringify(reqJson));
    //reqJson = JSON.stringify(reqJson);
    
    requestMod.post(
        'http://' + req.host + ':55551/upload',
        {json : {username : username, file: req.body.file}},
        function(error, response, body){
            req.session.calculating = false;
            if (error) {
                console.log("Server responded error " + error.message);
                var e = new Error("Cannot connect to Koordinator ");
                res.render("error", {dynError : "Cannot connect to Koordinator ", error : e});
            } else {
                console.log("Server responded ");
                console.log(body);
                if (response.statusCode == 200){
                    req.session.calculating = true;
                    res.redirect("/main");
                }
            }
        }
    );
    
    
    /*
    try{
        var request = http.request({
            method: 'POST',
            host: req.host,
            port: '55551',
            path: '/upload',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(reqJson)
        });
        
        
                    headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(reqJson)
            }
        
        
        request.end();
        
        request.on('error', function(ress){
            console.log("Server responded error " + ress.statusCode);
            var e = new Error("Cannot connect to Koordinator ");
            req.session.calculating = false;
            res.render("error", {dynError : "Cannot connect to Koordinator ", error : e});
        });
        
        request.on('response', function(ress){
            console.log("Server responded " + ress.statusCode);
            if (ress.statusCode == 201) {
                req.session.calculating = true;
                res.redirect("/main");
            } else {
                var e = new Error("Cannot connect to Koordinator " + ress.statusCode);
                req.session.calculating = false;
                res.render("error", {dynError : "Cannot connect to Koordinator ", error : e});
            }
        });

        
    } catch (e) {
        res.render("error", {dynError : "Cannot connect to Koordinator ", error : e});
    }
    */
    
    
    // res.redirect("/main");
});

/* GET users listing. */
router.get('/', async function(req, res, next) {
    
    if (req.session){
        if (req.session.loggedIn){
            var username = req.session.username;
            
            var params = {
                FunctionName: "getFiles",
                InvocationType: "RequestResponse",
                LogType: "Tail",
                Payload: '{ "username" : "' + username + '"}'
            };
            
            const fileData = await lambda.invoke(params).promise();
            const lambdaRes = JSON.parse(fileData.Payload);

            var body = JSON.parse(lambdaRes.body); 
            
            
            if (lambdaRes.statusCode != 200){
                res.render("error", {dynError: "error: " + lambdaRes.statusCode });
            } else if (req.session.calculating) {
                var conHandler = req.app.get("conHandler");
                console.log(conHandler.printMe());
                res.render("main", {userWelcome: "HI! " + username, title: 'CC Task 3 Main Page', fileList: new Array(), backToMain: true, calcFile: req.session.calcFile});
            } else {
                res.render("main", {userWelcome: "HI! " + username, title: 'CC Task 3 Main Page' , fileList: body.files, backToMain: false});
            }
        } else {
            res.send('<a href="/"> Login to view this page </a>');
        }
    } else {
        res.send('<a href="/"> Login to view this page </a>');
    }
    
});




module.exports = router;
