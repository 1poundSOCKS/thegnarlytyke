import os
import json
import datetime
import boto3
from botocore.errorfactory import ClientError

def lambda_handler(event, context):

    BUCKET_NAME = os.environ.get('BUCKET_NAME')

    string = event['body']
    encoded_string = string.encode("utf-8")

    s3 = boto3.client('s3')
    request_data = event['queryStringParameters']
    object_id = request_data['id']

    filename = "{}.json".format(object_id)
    data_key = "data/{}".format(filename)
    
    datetime_stamp = datetime.datetime.now().strftime("%G%m%d.%H%M%S.%f")
    backup_data_key = "backup/data/{}.{}.json".format(object_id,datetime_stamp)
    
    copy_source={'Bucket':BUCKET_NAME,'Key':data_key}
    try:
        s3.copy_object(CopySource=copy_source,Bucket=BUCKET_NAME,Key=backup_data_key)
    except ClientError:
        print("backup failed")

    s3.put_object(Bucket=BUCKET_NAME, Key=data_key, Body=encoded_string)
    
    return {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "body": json.dumps(
            {
                "filename": filename
            }
        )
    }
