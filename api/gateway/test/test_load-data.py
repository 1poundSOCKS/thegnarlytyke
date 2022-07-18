import requests

alias = "dev"
logon_url = f"https://z4oiwf4tli.execute-api.eu-west-2.amazonaws.com/{alias}/logon"
load_url = f"https://z4oiwf4tli.execute-api.eu-west-2.amazonaws.com/{alias}/load-data"
object_id = "crag-index"

def test_lambda1():
  logon_data = {"email":"mathew.coburn@gmail.com","password":"1234"}
  logon_response = requests.post(logon_url, json = logon_data)
  logon_response_body = logon_response.json()
  assert logon_response_body.get("error") == None
  user_id = logon_response_body.get("user_id")
  user_token = logon_response_body.get("user_token")
  assert user_id != None
  assert user_token != None

  load_parameters = f"user_id={user_id}&user_token={user_token}&id={object_id}"
  load_response = requests.get(f"{load_url}?{load_parameters}")
  assert load_response.status_code == 200
  load_response_body = load_response.json()
  assert load_response_body.get("error") == None
