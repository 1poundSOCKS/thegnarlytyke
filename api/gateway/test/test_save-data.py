import requests

url = "https://z4oiwf4tli.execute-api.eu-west-2.amazonaws.com/dev/save-data"
parameters = "user_id=123&user-token=456"

def test_lambda1():
  response = requests.post(f"{url}?{parameters}")
  assert response.status_code == 200

  body = response.json()
  assert body["error"] == None
