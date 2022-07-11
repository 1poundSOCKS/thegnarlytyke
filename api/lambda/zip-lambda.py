import os
import zipfile

zip_path = os.path.abspath("build/save-data.zip")

os.chdir("source/save-data")

with zipfile.ZipFile(zip_path, mode="w") as archive:
  archive.write("lambda_function.py")