import os
import json
import datetime
import boto3
from botocore.errorfactory import ClientError

_USERDATA_BUCKET_NAME = "{}.userdata.thegnarlytyke.com"
_DATA_BUCKET_NAME = "{}.data.thegnarlytyke.com"

def lambda_handler(event, context):

    stage = GetStage(event)
    print("stage: {}".format(stage))
    USERDATA_BUCKET_NAME = _USERDATA_BUCKET_NAME.format(stage)
    print("userdata bucket: {}".format(USERDATA_BUCKET_NAME))
    DATA_BUCKET_NAME = _DATA_BUCKET_NAME.format(stage)
    print("data bucket: {}".format(DATA_BUCKET_NAME))

    parameters = event['queryStringParameters']
    
    user_id = parameters.get('user_id')
    user_token = parameters.get('user_token')

    # check authentication 
    lambda_client = boto3.client('lambda')
    inputParams = {"user_id": user_id,"user_token":user_token,"stage":stage}
    response = lambda_client.invoke(
        FunctionName = 'arn:aws:lambda:eu-west-2:081277733545:function:AuthenticateUser',
        InvocationType = 'RequestResponse',
        Payload = json.dumps(inputParams)
    )
    response = json.load(response['Payload'])
    print(response)

    if response.get("error"):
        return {
            "statusCode": 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST'
            },
            "body": json.dumps(
                {
                    "error": "not authorised"
                }
            )
        }
    
    string = event['body']
    encoded_string = string.encode("utf-8")

    s3 = boto3.client('s3')
    object_id = parameters['id']

    filename = "{}.json".format(object_id)
    data_key = "data/users/{}/{}".format(user_id,filename)
    
    datetime_stamp = datetime.datetime.now().strftime("%G%m%d.%H%M%S.%f")
    backup_data_key = "backup/data/{}.{}.json".format(object_id,datetime_stamp)
    
    copy_source={'Bucket':DATA_BUCKET_NAME,'Key':data_key}
    try:
        s3.copy_object(CopySource=copy_source,Bucket=DATA_BUCKET_NAME,Key=backup_data_key)
    except ClientError:
        print("backup failed")

    s3.put_object(Bucket=DATA_BUCKET_NAME, Key=data_key, Body=encoded_string)
    
    return {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
        },
        "body": json.dumps(
            {
                "filename": filename
            }
        )
    }
    
def GetStage(event):
    request_context = event["requestContext"]
    return request_context["stage"]