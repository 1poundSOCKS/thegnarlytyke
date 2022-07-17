from function.lambda_function import lambda_handler
import json

function_name = "gnarly-load-data:dev"

function_event = {
  "stageVariables": {
    "lambdaAlias": "dev",
    "dataBucket": "dev.data.thegnarlytyke.com",
    "userdataBucket": "dev.userdata.thegnarlytyke.com"
  },
  "queryStringParameters": {
    "user_id": "dev-user",
    "user_token": "dev-token",
    "id": "test-id",
    "type": "test_type"
  },
  "body": "testing..."
}

def test_lambda():
    response = lambda_handler(function_event, None)
    status_code = response.get('statusCode')
    body = json.loads(response.get('body'))
    error = body.get("error")
    assert status_code == 200 and error == None
    