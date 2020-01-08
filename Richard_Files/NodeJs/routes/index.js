var express = require('express');
var AWS = require("aws-sdk");
var router = express.Router();
const url = require('url'); 

var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

AWS.config.update({
    region: "us-east-1"
});

var lambda = new AWS.Lambda();


/* GET home page. */
router.get('/', function(req, res, next) {
    var errorP = req.query.errorP;
    console.log(req.session.loggedIn);
    if (req.session.loggedIn){
        res.redirect("/main");
    } else {
        res.render('index', { title: 'CC Task 3 Welcome Page' , errorP: errorP});
    }
});

router.post('/pushWordCount', function(req, res, next) {
    const username = req.body.username;
    const wordCount = req.body.wordCount;
    const finish = req.body.finish;
    if (username == undefined) res.send(400);
    var conHandler = req.app.get("conHandler");
    conHandler.sendToCon(username, wordCount, finish);
    res.send(200);
});


router.get("/test", async function(req, res, next){

    const username = "richard";
    const fileName = "test.txt";

    var params = {
        FunctionName: "getFileCalcData",
        InvocationType: "RequestResponse",
        LogType: "Tail",
        Payload: '{ "username" : "' + username +'", "file" : "' + fileName + '"}'
    };
    
    const data = await lambda.invoke(params).promise();
    const calcData = JSON.parse((JSON.parse(data.Payload)).body);
    console.log(calcData.wordCount);
    

    res.redirect("/");
});

router.post('/auth', async function(req, res, next){
    
    var username = req.body.username;
    var password = req.body.password;
    
    if (username && password){
        
        var params = {
            FunctionName: "authUser",
            InvocationType: "RequestResponse",
            LogType: "Tail",
            Payload: '{ "username" : "' + username +'", "password" : "' + password + '"}'
        };
        
        var lambdaData
        try{
            lambdaData = await lambda.invoke(params).promise();
        } catch (e){
            res.render("error", {dynErr: e, error: e});
            return;
        }
        
        const lambdaPayload = JSON.parse(lambdaData.Payload);
        const lambdaStatusCode = lambdaPayload.statusCode;
        
        if (lambdaStatusCode == 200){
            req.session.loggedIn = true;
            req.session.username = username;
            res.redirect("main");
            res.end();
            return;
        } else {
            res.redirect(url.format({
                pathname:"/",
                query: {
                "errorP": "Wrong Credentials"
                }
            }));
        }
    }
});



router.post("/upload", async function(req, res) {
    if(req.files) {
        var file = req.files.filesfld;
        const username = req.session.username;
        
        if (username != null){
            var params = {
                FunctionName: "addFile",
                InvocationType: "RequestResponse",
                LogType: "Tail",
                Payload: '{ "username" : "' + username +'", "file" : "' + file.name + '", "wordCount" : 0, "content" : "' + encodeURI(file.data.toString().trim()) + '"}'
            };
            
            const lambdaData = await lambda.invoke(params).promise();
            const lambdaPayload = JSON.parse(lambdaData.Payload);
            const lambdaStatusCode = lambdaPayload.statusCode;
            
            res.sendStatus(lambdaStatusCode);
            
        } else {
            res.sendStatus(500);
        }
    }
});

module.exports = router;


/*

var params = {
            TableName: 'User',
            Key: {
                'User_Id': {S: username}
            },
            ProjectionExpression: 'password'
        };
        
        ddb.getItem(params).promise().then(function(data){
            if (data.Item == undefined){
                res.redirect(url.format({
                    pathname:"/",
                    query: {
                      "errorP": "Wrong Credentials"
                    }
                }));
                return;
            }
            var dbPassword = data.Item.password.S;
            
            
            
            */