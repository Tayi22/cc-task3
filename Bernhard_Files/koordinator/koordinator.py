from flask import Flask,request, flash, redirect, Response, abort
import pika
import sys
import os
import logging
import boto3
from concurrent.futures import ThreadPoolExecutor
import json


app = Flask(__name__)

bind_to = { 'hostname': "0.0.0.0", 'port': 55551 }

@app.route('/ping')
def ping():
    if( request.is_json == True ):
        return "Hello World!"

@app.route("/")
def test():
    return "Hello World!"
    
@app.route("/upload", methods=['POST'])
def upload():
    app.logger.info(request.data)
    if request.method == 'POST' and request.is_json:
        username = request.json['username']
        filename = request.json['file']
        payload = {
            "username": username,
            "file": filename
        }
        client = boto3.client('lambda')
        response = client.invoke(
            FunctionName='getFileByFileName',
            InvocationType='RequestResponse',
            Payload=json.dumps(payload).encode()
        )

        data = json.loads(response['Payload'].read())
        if data.get('statusCode') != 200:
            file = None
        else:
            try:
                file = bytes(json.loads(data['body'])['data']).decode()
            except Exception as e:
                app.logger.info(f"{str(e)}")
                abort(400)
                
        if not file:
            app.logger.info("File not found")
            abort(404)
            
        app.logger.info("File present")
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host='rabbit')
            )
            channel = connection.channel()
            
            channel.queue_declare(queue='task_queue', durable=True)
            channel.basic_qos(prefetch_count=1)
            
            lines = file.split("\n")
            lines = [x.strip() for x in lines]
            
            total_parts = len([line for line in lines if line != ""])
            
            for i in range(len(lines)):
                if(lines[i]!= ""):
                    line = lines[i]
                    message = json.dumps({
                        "username": username,
                        "filename": filename,
                        "line": line,
                        "total_parts": total_parts,
                    })
                    channel.basic_publish(
                        exchange='',
                        routing_key='task_queue',
                        body=message.encode(),
                        properties=pika.BasicProperties(
                            delivery_mode=2,  # make message persistent
                        ))
                    app.logger.info(f" [x] Sent message: {message}")
            connection.close()
        except Exception as e:
            app.logger.error(f"Error: {str(e)}")
            print("Error " + str(e), flush=True)
        return "Messages sent"
    return Response("", status=201)


if __name__ == '__main__':
    app.secret_key = 'abcd'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.run(host=bind_to['hostname'], port=int(bind_to['port']), debug=True)