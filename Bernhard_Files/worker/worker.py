import sys
import pika
import time
import logging
import boto3
import json
import os


print("Starting worker")

credentials = pika.PlainCredentials('guest', 'guest')
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host='rabbit',
        port=5672,
        connection_attempts=5, 
        retry_delay=5,
        )
)
channel = connection.channel()
    
channel.queue_declare(queue='task_queue', durable=True)
print(" [*] Waiting for messages. To exit press CTRL+C'")

files = {}

def callback(ch, method, properties, body: bytes):
    message = json.loads(body.decode())
    line = message.get('line')
    username = message.get('username')
    filename = message.get('filename')
    total_parts = message.get('total_parts')
    
    file = f"{username}_{filename}"
    
    finished = False
    
    print(f" [x] Received message: {line}")
    try:
        payload = {
                "username": username,
                "file": filename,
            }
        
        client = boto3.client('lambda')
        response = client.invoke(
            FunctionName='getFileCalcData',
            InvocationType='RequestResponse',
            Payload=json.dumps(payload).encode()
        )
        
        data = json.loads(response['Payload'].read())
        if data.get('statusCode') != 200:
            return
        else:
            try:
                word_count = json.loads(data['body']).get('wordCount') or 0
            except:
                return
            
        if file in files:
            if total_parts == files.get(file) + 1:
                finished = True
                files.pop(file)
            else:
                files[file] = files[file] + 1
        else:
            word_count = 0
            if total_parts != 1:
                files[file] = 1
            else:
                finished = True
        
        delimiters = [".", ";", "/", ","]
        for delimiter in delimiters:
            line = line.replace(delimiter, " ")
            
        number_of_words = len(line.split(" ")) 
        word_count = word_count + number_of_words
        print(f"Total number of words: {str(word_count)}")
        time.sleep(1)
        print(" [x] Done")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        
        payload = {
                "username": username,
                "file": filename,
                "wordCount": word_count,
                "content": None,
                "finish": finished
            }
        
        response = client.invoke(
            FunctionName='addFile',
            InvocationType='RequestResponse',
            Payload=json.dumps(payload).encode()
        )
        
        data = json.loads(response['Payload'].read())
        
        print(data)
    except Exception as e:
        print(str(e))


channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='task_queue', on_message_callback=callback)

channel.start_consuming()