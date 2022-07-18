import requests

save_url = "https://z4oiwf4tli.execute-api.eu-west-2.amazonaws.com/dev/save-data"
load_url = "https://z4oiwf4tli.execute-api.eu-west-2.amazonaws.com/dev/load-data"
parameters = "user_id=123&user-token=456"
data = {'somekey': 'somevalue'}

def test_lambda1():
  response = requests.post(f"{save_url}?{parameters}", json = data)
  assert response.status_code == 200

  body = response.json()
  assert body["error"] == None
