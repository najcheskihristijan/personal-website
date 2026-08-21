#!/bin/bash
# Local deployment script for pushing updates to Vultr
# NOTE: '/data' and '.env' are excluded on purpose. The leading slash anchors it to the repo
# root so it does NOT also exclude src/data (which the build needs). rsync runs with --delete, so without these
# exclusions every deploy would overwrite the server's live data/ with the local copy and
# delete anything not present locally - captured leads and client review decisions included.
echo "Deploying source code to Vultr..."
rsync -avz --delete --exclude 'node_modules' --exclude '.git' --exclude '.vscode' --exclude '.astro' --exclude 'dist' --exclude '/data' --exclude '.env' ./ root@149.28.224.92:/var/www/hristijannajcheski.com/

echo "Building remotely and restarting server..."
ssh root@149.28.224.92 << 'ENDSSH'
  cd /var/www/hristijannajcheski.com
  npm install
  npm run build
  pm2 restart astro-personal
ENDSSH

echo "Deployment successful!"
