from function.lambda_function import lambda_handler
import json

function_name = "gnarly-authenticate-user:dev"

function_event = {
  "bucket" : "dev.userdata.thegnarlytyke.com",
  "user_id": "dev-user",
  "user_token": "dev-token"
}

def test_lambda():
    response = lambda_handler(function_event, None)
    status_code = response.get('statusCode')
    body = json.loads(response.get('body'))
    error = body.get("error")
    assert status_code == 200 and error == None
    