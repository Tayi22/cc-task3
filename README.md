# cc-task3
Task 3 for Cloud Computing 2019 WS

How to access AWS Classroom
https://www.awseducate.com/signin


Install AWS CLI
https://docs.aws.amazon.com/cli/latest/userguide/install-cliv1.html

What we can use:
AWS Cloud Basics including (EC2, S3, RDS, Cloud9, CloudFormation, Tag) and AWS Serverless (Lambda, API Gateway, S3, DynamoDB)

# EC2:
- https://aws.amazon.com/de/ecr/
- Create and Manage Instances for docker files

# S3:
- https://aws.amazon.com/de/s3/
- 

# Cloud9:
- Login to a01406826@unet.univie.ac.at (CC2019G_A)
- Open the Console
- Under Services connect to Cloud9 IDE
- Choose the cc19 instance to connect
- Java Tutorial https://docs.aws.amazon.com/cloud9/latest/user-guide/sample-java.html#sample-java-install

# Instance for Cloud9:
- m5.large
- Ubuntu Server 18.04 LTS
- Closes after 30 Min Idle
- Network VPC: vpc-ee8da894 (Default)
- subnet-30fe267d (us-east-1a)

# RabbitMQ
- For messages and queues
- https://www.rabbitmq.com/ec2.html

# Connect to ec2 instance:
You need the keyPair we send around.
Public DNS of the testing instance: ec2-52-70-215-172.compute-1.amazonaws.com

# Connect to service
ssh -i myKeyPair.pem ec2-user@ec2-52-70-215-172.compute-1.amazonaws.com

# First Steps:
- Richard: Webserver with a basic GUI
  - Sends a GET Request to Koordinator zu Endpoint /ping
  - Excpets a JSON with Status 200 and message: "Hello World"


