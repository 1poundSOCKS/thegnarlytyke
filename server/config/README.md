# Download config.json

aws s3api get-object --bucket <bucket-name> --key config.json config.json

# Upload config.json

aws s3 cp config.json s3://<bucket-name>

# Upload all config files

aws s3 sync <folder-name> s3://<bucket-name>
