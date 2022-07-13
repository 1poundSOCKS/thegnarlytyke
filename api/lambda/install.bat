@REM aws iam create-role --role-name gnarly-SaveData --assume-role-policy-document file://source/lambda-default.role.json > output/role.json
@REM aws iam attach-role-policy --role-name gnarly-SaveData --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaRole
@REM aws iam attach-role-policy --role-name gnarly-SaveData --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
@REM aws iam put-role-policy --role-name gnarly-SaveData --policy-name gnarly-WriteData --policy-document file://source/lambda-write-data.policy.json
python source/create-function.py gnarly-SaveData output/role.json
@REM python zip-lambda.py
@REM aws lambda create-function --function-name gnarly-SaveData --zip-file fileb://build/save-data.zip --runtime python3.9 --role arn:aws:iam::081277733545:role/gnarly-SaveData --handler lambda_function.lambda_handler --timeout 10
@REM aws lambda create-alias --function-name gnarly-SaveData --name dev --function-version $LATEST
@REM aws lambda create-alias --function-name gnarly-SaveData --name test --function-version 1
@REM aws lambda create-alias --function-name gnarly-SaveData --name prod --function-version 1
