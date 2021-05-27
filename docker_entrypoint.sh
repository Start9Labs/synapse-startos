#!/bin/sh

set -e

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
echo "$HOST_IP   tor" >> /etc/hosts

if ! [ -f /data/homeserver.yaml ]; then
    SYNAPSE_SERVER_NAME=$TOR_ADDRESS SYNAPSE_REPORT_STATS=no /start.py generate
    yq e -i ".federation_certificate_verification_whitelist[0] = \"*.onion\"" /data/homeserver.yaml
    yq e -i ".listeners[0].bind_addresses = [\"127.0.0.1\"]" /data/homeserver.yaml
fi

cat /var/www/config.json | jq ".default_server_config[\"m.homeserver\"].base_url = \"http://${TOR_ADDRESS}\"" > /var/www/config.json.tmp && mv /var/www/config.json.tmp /var/www/config.json
cat /var/www/config.json | jq ".default_server_config[\"m.homeserver\"].server_name = \"${TOR_ADDRESS}\"" > /var/www/config.json.tmp && mv /var/www/config.json.tmp /var/www/config.json

LAN_ADDRESS="$(echo "$TOR_ADDRESS" | sed -r 's/(.+)\.onion/\1.local/g')"

echo "" > /etc/nginx/conf.d/default.conf
cat >> /etc/nginx/conf.d/default.conf <<"EOT"
server_names_hash_bucket_size 128;
server {
    listen 80;
    listen 443 ssl;
    listen 8448 ssl;
    ssl_certificate /data/cert.pem;
    ssl_certificate_key /data/key.pem;
EOT
echo "    server_name ${TOR_ADDRESS};" >> /etc/nginx/conf.d/default.conf
echo "    server_name ${LAN_ADDRESS};" >> /etc/nginx/conf.d/default.conf
cat >> /etc/nginx/conf.d/default.conf <<"EOT"
    root /var/www;
    location ~* ^(\/_matrix|\/_synapse\/client) {
        proxy_pass http://127.0.0.1:8008;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;

        # Nginx by default only allows file uploads up to 1M in size
        # Increase client_max_body_size to match max_upload_size defined in homeserver.yaml
        client_max_body_size 50M;
    }
}
EOT

if ! [ -f /data/cert.pem ] || ! [ -f /data/key.pem ]; then 
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /data/key.pem -out /data/cert.pem -config /etc/ssl/cert.conf
fi

if [ "$(yq e ".tor-only-mode" /data/start9/config.yaml)" = "true" ]; then
    cp /root/priv-config-forward-all /etc/privoxy/config
else
    cp /root/priv-config-forward-onion /etc/privoxy/config
fi


if [ "$1" = "reset-first-user" ]; then
    query() {
        sqlite3 /data/homeserver.db "$*"
    }

    password=$(cat /dev/urandom | base64 | head -c 16)
    hashed_password=$(hash_password -p "$password")
    first_user_name=$(query "select name from users where creation_ts = (select min(creation_ts) from users) limit 1;")
    echo 'version: 2' > /data/start9/stats.yaml
    echo 'data:' >> /data/start9/stats.yaml
    echo '  Default Username:' >> /data/start9/stats.yaml
    echo '    type: string' >> /data/start9/stats.yaml
    echo '    value: "'"$first_user_name"'"' >> /data/start9/stats.yaml
    echo '    description: This is your default username. While it is not necessary, you may change it inside your File Browser web application. That change, however, will not be reflected here. If you change your default username and forget your new username, you can regain access by resetting the first user.' >> /data/start9/stats.yaml
    echo '    copyable: true' >> /data/start9/stats.yaml
    echo '    masked: false' >> /data/start9/stats.yaml
    echo '    qr: false' >> /data/start9/stats.yaml
    echo '  Default Password:' >> /data/start9/stats.yaml
    echo '    type: string' >> /data/start9/stats.yaml
    echo '    value: "'"$password"'"' >> /data/start9/stats.yaml
    echo '    description: This is your randomly-generated, default password. While it is not necessary, you may change it inside your Element web application (or whatever client software you use to connect to Synapse). That change, however, will not be reflected here.' >> /data/start9/stats.yaml
    echo '    copyable: true' >> /data/start9/stats.yaml
    echo '    masked: true' >> /data/start9/stats.yaml
    echo '    qr: false' >> /data/start9/stats.yaml
    query "update users set password_hash=\"$hashed_password\" where name=\"$first_user_name\""
    echo "Your new password is: $password"
    echo 'This will also be reflected in `Properties` for this service.'
    exit 0
fi

python /configurator.py
nginx
privoxy /etc/privoxy/config
export https_proxy="127.0.0.1:8118"
exec tini /start.py
