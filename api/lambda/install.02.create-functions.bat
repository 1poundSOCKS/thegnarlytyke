set function-name=gnarly-save-data

python source/zip-function.py %function-name%
python source/create-function.py %function-name% output/%function-name%.role.json
aws lambda create-alias --function-name %function-name% --name dev --function-version $LATEST > output/%function-name%.dev.alias.json
aws lambda publish-version --function-name %function-name% > output/%function-name%.function.json
@REM aws lambda create-alias --function-name %function-name% --name test --function-version 1 > output/%function-name%.test.alias.json
@REM aws lambda create-alias --function-name %function-name% --name prod --function-version 1 > output/%function-name%.prod.alias.json
