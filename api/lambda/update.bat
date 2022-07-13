set function-name=gnarly-save-data

@REM python zip-lambda.py
@REM aws lambda update-function-code --function-name gnarly-SaveData --zip-file fileb://build/save-data.zip --publish

python source/zip-function.py %function-name%
aws lambda update-function-code --function-name %function-name% --zip-file fileb://build/%function-name%.zip --publish > output/%function-name%.update.json
