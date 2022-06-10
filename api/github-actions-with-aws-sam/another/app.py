import json
import boto3


def load_image(event, context):

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

def save_image(event, context):

    string = event['body']
    encoded_string = string.encode("utf-8")

    s3 = boto3.client('s3')
    request_data = event['queryStringParameters']
    object_id = request_data['id']
    data_key = "{}.txt".format(object_id)
    s3.put_object(Bucket="images.thegnarlytyke.com", Key=data_key, Body=encoded_string)

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": "save image call successful"
            }
        )
    }
