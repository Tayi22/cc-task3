// JavaScript File
var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});

s3 = new AWS.S3({apiVersion: '2019-12-22'});

s3.listBuckets(function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});