import json
import boto3


def lambda_handler(event, context):

    s3 = boto3.client('s3')    
    request_data = event['queryStringParameters']
    crag_id = request_data['id']
    data_key = "data/{}.crag.json".format(crag_id)
    obj = s3.get_object(Bucket="data.thegnarlytyke.com", Key=data_key)    
    j = json.loads(obj['Body'].read().decode('utf-8'))

    return {
        "statusCode": 200,
        "body": json.dumps(
            j
        ),
    }

def save_image(event, context):

    # string = "dfghj"
    # encoded_string = string.encode("utf-8")

    # s3 = boto3.client('s3')
    # request_data = event['queryStringParameters']
    # object_id = request_data['id']
    # data_key = "{}.jpg".format(object_id)
    # s3.Bucket("images.thegnarlytyke.com").put_object(Key=data_key, Body=encoded_string)


    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": "save image call successful"
            }
        ),
    }