# Get MongoDB files
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

# Update Package Lists
sudo apt-get update

# Download node source
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

sudo apt-get install -y nodejs mongodb-org nginx

# Create secure SSL key (takes a minute or 2)
# sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

# sudo apt-get install git bc
# sudo git clone https://github.com/letsencrypt/letsencrypt
# cd /opt/letsencrypt
# ./letsencrypt-auto certonly --standalone -d mediamade.me -d www.mediamade.me

# Need to copy files from host to right files in question
# cd /var/www/mediamade

# sudo cp ./config/nginx/sites-enabled/default /etc/nginx/sites-enabled/default
# sudo cp ./config/nginx/snippets/ssl-params.conf /etc/nginx/snippets/ssl-params.conf

# sudo service nginx start

# Install npm packages
npm install

sudo npm install -g pm2
pm2 start www/bin

echo "cd /var/www/mediamade" >> /home/vagrant/.bashrc