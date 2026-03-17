#!/bin/bash
# Local deployment script for pushing updates to Vultr
echo "Deploying source code to Vultr..."
rsync -avz --delete --exclude 'node_modules' --exclude '.git' --exclude '.vscode' --exclude '.astro' --exclude 'dist' ./ root@149.28.224.92:/var/www/hristijannajcheski.com/

echo "Building remotely and restarting server..."
ssh root@149.28.224.92 << 'ENDSSH'
  cd /var/www/hristijannajcheski.com
  npm install
  npm run build
  pm2 restart astro-personal
ENDSSH

echo "Deployment successful!"
