aws s3 sync s3://test.thegnarlytyke.com s3://thegnarlytyke.com --exclude "config.json" --delete
aws cloudfront create-invalidation --distribution-id E36NDLK7X4PLKS --paths "/*"
