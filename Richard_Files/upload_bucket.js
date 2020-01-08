// JavaScript File
var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});

let s3 = new AWS.S3({apiVersion: '2019-12-22'});


// call S3 to retrieve upload file to specified bucket
var uploadParams = {Bucket: process.argv[2], Key: '', Body: ''};
var file = process.argv[3];

let extn = file.split('.').pop();
let contentType = 'application/octet-stream';
if (extn == 'html') contentType = "text/html; charset=utf-8";
if (extn == 'css') contentType = "text/css";
if (extn == 'js') contentType = "application/javascript";
if (extn == 'png' || extn == 'jpg' || extn == 'gif') contentType = "image/" + extn;



// Configure the file stream and obtain the upload parameters
var fs = require('fs');
var fileStream = fs.createReadStream(file);
fileStream.on('error', function(err) {
  console.log('File Error', err);
});
uploadParams.Body = fileStream;
var path = require('path');
uploadParams.Key = path.basename(file);
uploadParams.ContentType = contentType;

// call S3 to retrieve upload file to specified bucket
s3.upload (uploadParams, function (err, data) {
  if (err) {
    console.log("Error", err);
  } if (data) {
    console.log("Upload Success", data.Location);
  }

});