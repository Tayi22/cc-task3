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
I split the workload with the following specifications
- Messaging Protocol
  - How to exchange Messages
  - RabbitMQ as Solution?
  - Done by everyone
  
- Webserver
  - NodeJs With Websockets for real time updates
  - Done by Richard
  
- Koordinator
  - Splits Workoad to task and distributes
  - Sends Updates from Worker to Webservice
  - Done by Bernhard


- Worker
  - Splits Task furthermore and works on it
  - Sends updates to Koordinator
  - Done by Bernhard

- DB
  - Saves user Text Files
  - Done by Richard


- External Word Checking Service
  - Checks for Spelling Errors
  - Done by ?
  
  
  # How to run RabbitMQ and koordinator and worker:
  At the moment there is a docker-compose.yaml which starts up one instance of koordinator, rabbitmq and worker. 
  - Start it up with docker-compose up. 
  - If everything is running (check woith docker ps because the worker has to restart some times until rabbitmq is running) call http://3.95.235.221:8080/upload to start sending split messages from the test.txt file. 
  - Worker should print the actual word number. 
 


