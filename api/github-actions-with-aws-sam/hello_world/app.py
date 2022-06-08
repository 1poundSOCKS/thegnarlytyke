import json
import boto3


def lambda_handler(event, context):
    """Sample pure Lambda function

    Parameters
    ----------
    event: dict, required
        API Gateway Lambda Proxy Input Format

        Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format

    context: object, required
        Lambda Context runtime methods and attributes

        Context doc: https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    ------
    API Gateway Lambda Proxy Output Format: dict

        Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
    """

    # try:
    #     ip = requests.get("http://checkip.amazonaws.com/")
    # except requests.RequestException as e:
    #     # Send some context about this error to Lambda Logs
    #     print(e)

    #     raise e

    s3 = boto3.client('s3')
    # obj = s3.get_object(Bucket="data.thegnarlytyke.com", Key="config.json")
    
    request_data = event['queryStringParameters']
    crag_id = request_data['id']
    data_key = "data/{}.crag.json".format(crag_id)
    # obj = s3.get_object(Bucket="data.thegnarlytyke.com", Key="data/0b950bd3-ea3b-44d1-ac40-28081c1d732a.crag.json")
    obj = s3.get_object(Bucket="data.thegnarlytyke.com", Key=data_key)
    
    j = json.loads(obj['Body'].read().decode('utf-8'))

    return {
        "statusCode": 200,
        "body": json.dumps(
            j
            # {
            #     "message": "hello world",
            #     # "location": ip.text.replace("\n", "")
            # }
        ),
    }
