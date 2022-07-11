aws lambda delete-function --function-name gnarly-SaveData
aws iam detach-role-policy --role-name gnarly-SaveData --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaRole
aws iam delete-role-policy --role-name gnarly-SaveData --policy-name gnarly-WriteData
aws iam delete-role --role-name gnarly-SaveData
