import sys
from lambda_helpers import *

def DeployToDev(function_name, function_source_dir):
  updated_function_def = UpdateLambdaFunctionCode(function_name, function_source_dir, "../build")
  version = updated_function_def["Version"]
  print(f"Successfully deployed function '{function_name}' (version={version})")

try:
  DeployToDev("gnarly-authenticate-user","../functions/gnarly_authenticate_user")
  DeployToDev("gnarly-load-data","../functions/gnarly_load_data")
  DeployToDev("gnarly-save-data","../functions/gnarly_save_data")

except BaseException as err:
  print(f"Failed (error={err})")
  sys.exit(1)
