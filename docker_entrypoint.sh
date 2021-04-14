#!/bin/sh

set -e

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')

if ! [ -f /data/homeserver.yaml ]; then
    SYNAPSE_SERVER_NAME=$TOR_ADDRESS SYNAPSE_REPORT_STATS=yes /start.py generate
    yq e -i ".federation_certificate_verification_whitelist.0 = \"*.onion\"" /data/homeserver.yaml
fi

if [ "$(yq e ".enable-registration" /data/start9/config.yaml)" = "true" ]; then
    yq e -i ".enable_registration = true" /data/homeserver.yaml
else
    yq e -i ".enable_registration = false" /data/homeserver.yaml
fi

cat /var/www/config.json | jq ".default_server_config[\"m.homeserver\"].base_url = \"http://${TOR_ADDRESS}\"" > /var/www/config.json.tmp && mv /var/www/config.json.tmp /var/www/config.json
cat /var/www/config.json | jq ".default_server_config[\"m.homeserver\"].server_name = \"${TOR_ADDRESS}\"" > /var/www/config.json.tmp && mv /var/www/config.json.tmp /var/www/config.json

echo "" > /etc/nginx/conf.d/default.conf
cat >> /etc/nginx/conf.d/default.conf <<EOT
server_names_hash_bucket_size 128;
server {
    listen 80;
    listen 443 ssl;
    listen 8448 ssl;
    ssl_certificate /data/cert.pem;
    ssl_certificate_key /data/key.pem;
EOT
echo "    server_name ${TOR_ADDRESS};" >> /etc/nginx/conf.d/default.conf
cat >> /etc/nginx/conf.d/default.conf <<EOT
    root /var/www;
    location /_matrix/ {
        proxy_pass http://localhost:8008/_matrix/;
    }
}
EOT

if ! [ -f /data/cert.pem ] || ! [ -f /data/key.pem ]; then 
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /data/key.pem -out /data/cert.pem -config /etc/ssl/cert.conf
fi

cp /etc/torsocks.conf.template /etc/torsocks.conf
echo "server = $HOST_IP" >> /etc/torsocks.conf
nginx
exec tini torsocks python /start.py
