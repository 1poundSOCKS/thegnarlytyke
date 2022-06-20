# thegnarlytyke

# web live
aws s3 sync s3://test.thegnarlytyke.com s3://thegnarlytyke.com --exclude "config.json" --delete

# data live
aws s3 sync s3://test.data.thegnarlytyke.com s3://data.thegnarlytyke.com --delete