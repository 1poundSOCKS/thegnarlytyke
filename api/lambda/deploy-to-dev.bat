set function-name=gnarly-authenticate-user
python source/zip-function2.py source/%function-name%/function build/%function-name%
aws lambda update-function-code --function-name %function-name% --zip-file fileb://build/%function-name%.zip --publish > output/%function-name%.update.json

set function-name=gnarly-save-data
python source/zip-function2.py source/%function-name%/function build/%function-name%
aws lambda update-function-code --function-name %function-name% --zip-file fileb://build/%function-name%.zip --publish > output/%function-name%.update.json

set function-name=gnarly-load-data
python source/zip-function2.py source/%function-name%/function build/%function-name%
aws lambda update-function-code --function-name %function-name% --zip-file fileb://build/%function-name%.zip --publish > output/%function-name%.update.json
