import sys
import boto3

s3 = boto3.resource('s3')
BUCKET = "dev.data.thegnarlytyke.com"
local_feed_datafile = sys.argv[1]
s3_object_id = "data/feed.json"

environment = sys.argv[2]

if environment == 'dev':
    BUCKET = "dev.data.thegnarlytyke.com"
elif environment == "test":
    BUCKET = "test.data.thegnarlytyke.com"
elif environment == "prod":
    BUCKET = "data.thegnarlytyke.com"

print(f"uploading '{s3_object_id}' to bucket '{BUCKET}'")
s3.Bucket(BUCKET).upload_file(local_feed_datafile, s3_object_id)
