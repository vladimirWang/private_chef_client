#!/bin/bash

echo "build client"
npm run build

echo "zip dist"
zip -r dist.zip dist

echo "complete, check dist.zip"
# echo "transfer dist.zip to server"
# scp dist.zip root@135.224.68.145:~/private_chef_server/nginx/html
