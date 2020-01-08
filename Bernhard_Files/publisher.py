import pika
import sys

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='task_queue', durable=True)
channel.basic_qos(prefetch_count=1)

with open('test.txt') as f:
    lines = f.readlines()
print(lines[1])
#removing /n lines
lines = [x.strip() for x in lines] 

for i in range(len(lines)):
    if(lines[i]!= ""):
        message = lines[i]
        channel.basic_publish(
            exchange='',
            routing_key='task_queue',
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ))
        print(" [x] Sent %r" % message)
connection.close()