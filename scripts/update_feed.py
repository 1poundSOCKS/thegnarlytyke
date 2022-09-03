import sys
import boto3

s3 = boto3.resource('s3')
BUCKET = "dev.data.thegnarlytyke.com"
local_feed_datafile = sys.argv[1]
s3_object_id = "data/feed.json"

s3.Bucket(BUCKET).upload_file(local_feed_datafile, s3_object_id)
