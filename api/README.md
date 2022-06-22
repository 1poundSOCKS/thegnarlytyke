# thegnarlytyke-api

# setup environment variables (cloud)
aws lambda update-function-configuration --function-name gnarly-SaveDataFunction-JGdEpoGLyllL --environment "Variables={DATA_BUCKET=test.data.thegnarlytyke.com}"

# local test
sam local invoke "SaveDataFunction" -e events/event-SaveDataFunction.json --env-vars env-vars.json

# run API local for HTTP
sam local start-api --env-vars env-vars.json
