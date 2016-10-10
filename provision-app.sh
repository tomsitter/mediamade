# Get MongoDB files
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

# Update Package Lists
sudo apt-get update

# Download node source
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

# Install node and MongoDB
sudo apt-get install -y nodejs mongodb-org

# Install npm packages
cd /var/www/mediamade
npm install

echo "cd /var/www/mediamade" >> /home/vagrant/.bashrc