import json
import boto3

BUCKET_NAME = "test.data.thegnarlytyke.com"

def lambda_handler(event, context):

    s3 = boto3.client('s3')
    request_data = event['queryStringParameters']
    object_id = request_data['id']
    data_key = "images/{}.topo.txt".format(object_id)
    obj = s3.get_object(Bucket=BUCKET_NAME, Key=data_key)
    t = obj['Body'].read().decode('utf-8')

    return {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "body": t
    }
