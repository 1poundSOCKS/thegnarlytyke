aws iam create-role --role-name gnarly-SaveData --assume-role-policy-document file://source/lambda-default.role.json
aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaRole --role-name gnarly-SaveData
aws iam put-role-policy --role-name gnarly-SaveData --policy-name gnarly-WriteData --policy-document file://source/lambda-write-data.policy.json
python zip-lambda.py
aws lambda create-function --function-name gnarly-SaveData --zip-file fileb://build/save-data.zip --runtime python3.9 --role arn:aws:iam::081277733545:role/gnarly-SaveData --handler lambda_function.lambda_handler --timeout 10
