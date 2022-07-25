#!/bin/sh

set -e

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
export TOR_ADDRESS=$(yq e '.tor-address' /data/start9/config.yaml)
echo "$HOST_IP   tor" >> /etc/hosts

if ! [ -f /data/homeserver.yaml ]; then
    if [ "$1" = "reset-first-user" ]; then
        cat << EOF
{
    "version": "0",
    "message": "Reset First User Failed",
    "value": "Database not found. Please start your homeserver and register a user before runnning this action.",
    "copyable": false,
    "qr": false
}
EOF
        exit 0
    fi
    SYNAPSE_SERVER_NAME=$TOR_ADDRESS SYNAPSE_REPORT_STATS=no /start.py generate
    yq e -i ".federation_certificate_verification_whitelist[0] = \"*.onion\"" /data/homeserver.yaml
    yq e -i ".listeners[0].bind_addresses = [\"127.0.0.1\"]" /data/homeserver.yaml
fi

echo "" > /etc/nginx/conf.d/default.conf
cat >> /etc/nginx/conf.d/default.conf <<"EOT"
server_names_hash_bucket_size 128;
server {
    listen 80;
    listen 443 ssl;
    listen 8448 ssl;
    ssl_certificate /mnt/cert/main.cert.pem;
    ssl_certificate_key /mnt/cert/main.key.pem;
EOT
echo "    server_name ${TOR_ADDRESS};" >> /etc/nginx/conf.d/default.conf
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

cat /var/www/index.html.template | sed "s/{{TOR_ADDRESS}}/${TOR_ADDRESS}/g" > /var/www/index.html

if [ "$(yq e ".advanced.tor-only-mode" /data/start9/config.yaml)" = "true" ]; then
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
    query "update users set password_hash=\"$hashed_password\" where name=\"$first_user_name\""
    cat << EOF
{
    "version": "0",
    "message": "Here is your new password. Please store it in a password manager.",
    "value": "$password",
    "copyable": true,
    "qr": false
}
EOF
    exit 0
fi

python /configurator.py
#Fixes and last minute config changes
echo "enable_registration_without_verification: true" >> /data/homeserver.yaml
echo "suppress_key_server_warning: true" >> /data/homeserver.yaml
nginx
privoxy /etc/privoxy/config
export https_proxy="127.0.0.1:8118"
exec tini /start.py
