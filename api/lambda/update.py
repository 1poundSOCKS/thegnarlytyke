import shutil
import boto3
import json

shutil.make_archive("build/save-data", 'zip', "source/save-data")

with open('build/save-data.zip', 'rb') as f:
	zipped_code = f.read()

client = boto3.client('lambda')

response = client.update_function_code(
    FunctionName='gnarly-SaveData',
    ZipFile=zipped_code,
    Publish=True
)

responseText = json.dumps(response, indent=2)

with open('log/save-data.update.json', 'w') as f:
	f.write(responseText)

version = response["Version"]
print(version)