import json
import boto3

def lambda_handler(event, context):

    s3 = boto3.client('s3')
    print(event)
    # request_data = event['queryStringParameters']
    # crag_id = request_data['id']
    # # data_key = "data/{}.crag.json".format(crag_id)
    data_key = "610cb7a8-6bd7-4165-ab49-04703a970f6d.txt"
    obj = s3.get_object(Bucket="images.thegnarlytyke.com", Key=data_key)
    # j = json.loads(obj['Body'].read().decode('utf-8'))
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
