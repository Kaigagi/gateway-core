sudo apt-get update
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - 
sudo apt-get install -y nodejs
sudo apt-get install git
cd ~/
git clone https://github.com/GDSC-HSU/gateway-core.git
cd ~/gateway-core && sudo npm i 