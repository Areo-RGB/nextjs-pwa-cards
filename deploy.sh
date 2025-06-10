#!/bin/bash
# Deployment script for Next.js PWA to DigitalOcean Droplet

echo "🚀 Deploying Next.js PWA to DigitalOcean Droplet..."

SERVER_IP="165.232.70.246"
APP_NAME="nextjs-pwa"
GITHUB_REPO="https://github.com/Anwender/nextjs-pwa-react.git"

echo "📡 Connecting to server $SERVER_IP..."

# SSH commands to run on the server
ssh root@$SERVER_IP << 'ENDSSH'
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Clone the repository
cd /var/www
rm -rf nextjs-pwa
git clone https://github.com/Anwender/nextjs-pwa-react.git nextjs-pwa
cd nextjs-pwa

# Install dependencies
npm install

# Build the application
npm run build

# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'nextjs-pwa',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/nextjs-pwa',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start the application with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Configure Nginx
cat > /etc/nginx/sites-available/nextjs-pwa << EOF
server {
    listen 80;
    server_name 165.232.70.246;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/nextjs-pwa /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t && systemctl restart nginx

echo "✅ Deployment completed! App is running on http://165.232.70.246"
ENDSSH

echo "🎉 Deployment script completed!"
