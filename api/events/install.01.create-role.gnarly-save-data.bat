set role-name=gnarly-save-data
set policy#1-name=lambda-write-data

aws iam create-role --role-name %role-name% --assume-role-policy-document file://source/lambda-default.role.json > output/%role-name%.role.json
aws iam attach-role-policy --role-name %role-name% --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaRole
aws iam attach-role-policy --role-name %role-name% --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam put-role-policy --role-name %role-name% --policy-name %policy#1-name% --policy-document file://source/%policy#1-name%.policy.json
