# cc-task3
Task 3 for Cloud Computing 2019 WS

How to access AWS Classroom
https://www.awseducate.com/signin


Install AWS CLI
https://docs.aws.amazon.com/cli/latest/userguide/install-cliv1.html

What we can use:
AWS Cloud Basics including (EC2, S3, RDS, Cloud9, CloudFormation, Tag) and AWS Serverless (Lambda, API Gateway, S3, DynamoDB)


Connect to ec2 instance:
You need the keyPair we send around.
Public DNS of the testing instance: ec2-52-70-215-172.compute-1.amazonaws.com

Connect to service
ssh -i myKeyPair.pem ec2-user@ec2-52-70-215-172.compute-1.amazonaws.com

We need:
- A Webserver which is exposed to the public that displays our GUI
- 
