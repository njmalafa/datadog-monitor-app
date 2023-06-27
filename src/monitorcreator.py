import csv
import os
import socket
import logging
import certifi
import ssl
from datadog import initialize, api

logging.basicConfig(filename='monitor_creation.log', level=logging.DEBUG)

# Datadog API credentials
OPTIONS = {
    
}

initialize(**OPTIONS)

# Default monitor options
DEFAULT_OPTIONS = {
    'notify_no_data': True,
    'no_data_timeframe': 60,
    'escalation_time': 0,
    'escalation_message': "",
    'renotify_interval': 0
}

# Dictionary mapping monitor types to their options
MONITOR_TYPES = {
    'consumer down': {
        "query": "avg(last_5m):max:{{kafka.consumer.producer_status,environment:{env},topic:{topic},group:{group},platform:confluent-platform,service:bkr}}.over('') by {partition} < 1",
        "message": "Consumer group {group} is down for topic {topic} in {env}.",
        "monitor_name": "Consumer Down - {topic} - {group}"
    },
    'consumer lag': {
        "query": "max(last_15m):sum:kafka.consumer_lag{{env:{env},topic:{topic},group:{group},platform:confluent-platform,service:bkr,host:{host},version:7.1.6}} by {{topic}} > {threshold}",
        "message": "Consumer group {group} has a lag of {threshold} or higher for topic {topic} in {env}.",
        "monitor_name": "Consumer Lag - {topic} - {group}"
    },
    'producer error rate': {
        "query": "avg(last_5m):avg:{{kafka.producer.record_error_rate,environment:{env},topic:{topic},platform:confluent-platform,service:bkr}}.over('') by {partition} > {threshold}",
        "message": "Producer error rate for topic {topic} in {env} is {threshold} or higher.",
        "monitor_name": "Producer Error Rate - {topic}"
    }
}

def format_monitor_options(monitor_type, row):
    env = row['Environment']
    partition = 'partition' if env == 'oz' else 'partition,'
    options = MONITOR_TYPES[monitor_type]
    formatted_options = {
        key: value.format(env=env, topic=row['Kafka Topics'], group=row['Consumer Group Id'], threshold=row['Alert Threshold'], partition=partition, host=socket.gethostname())
        for key, value in options.items()
    }
    print(formatted_options)
    return formatted_options

def create_monitor(row):
    try:
        monitor_type = row['Monitor Type']

        if monitor_type.lower() not in MONITOR_TYPES:
            raise ValueError(f"Invalid monitor type '{monitor_type}'.")
        
        
        options = format_monitor_options(monitor_type, row)
        query = options.pop("query")
        print(query)
        message = options.pop("message")
        print(message)
        name = options.pop("monitor_name")
        print(name)

        # Add tags
        environment = row['Environment'].lower()
        if environment not in ['snp-ats','snp-atn','oz','cpz']:
            raise ValueError(f"Invalid environment '{environment}'.")
        tags = [
            'kafka', 'monitor',
            f"env:{environment}",
            f"topic:{row['Kafka Topics']}",
            'version:7.1.6',
            f'zone:{environment[-3:]}',
            'notifiedTeam:Platform',
            'platform:cp',
            'atm_id:PP00003998'
        ]
        if monitor_type.lower() == 'consumer lag':
            tags.append(f"group:{row['Consumer Group Id']}")

        # Create SSL context
        context = ssl.create_default_context()

        # Load the root certificates
        context.load_default_certs()

        # Remove non-serializable attributes and methods from context dictionary
        context_dict = context.__dict__
        context_dict.pop('_context', None)

        # Create the monitor object
        monitor = {
            "type": 'query alert',
            "query": query,
            "name": name,
            "message": message,
            "tags": tags,
            "options": {**DEFAULT_OPTIONS, **options},
        }

        print(monitor)
        response = api.Monitor.create(monitor, ssl=context_dict)
        print(api.Monitor.create(monitor, ssl=context_dict))
        print(response)
        print(f"Created monitor with response: {response}")

    except Exception as e:
        print(f"Failed to create monitor for {monitor_type} on {row['Kafka Topics']}. Error: {str(e)}")

def main():
    try:
        # Read input file
        with open('sampleinput.csv', 'r') as f:
            reader = csv.DictReader(f)
            rows = list(reader)

        # Create monitors for each row in the input file
        for row in rows:
            create_monitor(row)

    except Exception as e:
        print(f"Failed to create monitors. Error: {str(e)}") 

if __name__ == '__main__':
    main()


