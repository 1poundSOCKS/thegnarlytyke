import json
from functions.gnarly_authenticate_user.source.lambda_function import lambda_handler as authenticate_user
from functions.gnarly_save_data.source.lambda_function import lambda_handler as save_data
from functions.gnarly_load_data.source.lambda_function import lambda_handler as load_data

function_event_authenticate = {
  "bucket" : "dev.userdata.thegnarlytyke.com",
  "user_id": "dev-user",
  "user_token": "dev-token"
}

function_event_save_data = {
  "stageVariables": {
    "lambdaAlias": "dev",
    "dataBucket": "dev.data.thegnarlytyke.com",
    "userdataBucket": "dev.userdata.thegnarlytyke.com"
  },
  "queryStringParameters": {
    "user_id": "dev-user",
    "user_token": "dev-token",
    "id": "test-id",
    "type": "test-type"
  },
  "body": '{"msg":"hello"}'
}

function_event_load_data = {
  "stageVariables": {
    "lambdaAlias": "dev",
    "dataBucket": "dev.data.thegnarlytyke.com",
    "userdataBucket": "dev.userdata.thegnarlytyke.com"
  },
  "queryStringParameters": {
    "user_id": "dev-user",
    "user_token": "dev-token",
    "id": "test-id",
    "type": "test-type"
  }
}

def test_lambda():
    response = authenticate_user(function_event_authenticate, None)
    status_code = response.get('statusCode')
    body = json.loads(response.get('body'))
    error = body.get("error")
    assert status_code == 200 and error == None

    response = save_data(function_event_save_data, None)
    status_code = response.get('statusCode')
    body = json.loads(response.get('body'))
    error = body.get("error")
    assert status_code == 200 and error == None

    response = load_data(function_event_load_data, None)
    status_code = response.get('statusCode')
    body = json.loads(response.get('body'))
    error = body.get("error")
    assert status_code == 200 and error == None
    assert body == {"msg":"hello"}