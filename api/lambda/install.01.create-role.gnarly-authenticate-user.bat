set role-name=gnarly-authenticate-user
set policy#1-name=lambda-read-userdata

aws iam create-role --role-name %role-name% --assume-role-policy-document file://source/lambda-default.role.json > output/%role-name%.role.json
aws iam attach-role-policy --role-name %role-name% --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaRole
aws iam put-role-policy --role-name %role-name% --policy-name %policy#1-name% --policy-document file://source/%policy#1-name%.policy.json
