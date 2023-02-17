#!/bin/sh

set -e

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
export TOR_ADDRESS=$(yq e '.tor-address' /data/start9/config.yaml)
FEDERATION=$(yq e '.federation' /data/start9/config.yaml)
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
    if [ $FEDERATION == "true" ]; then
        yq e -i ".listeners[0].resources.names = [client, keys, media, metrics, health, federation]" /data/homeserver.yaml
    else
        yq e -i ".listeners[0].resources.names = [client, keys, media, metrics, health]" /data/homeserver.yaml
        yq e -i ".federation_domain_whitelist = []" /data/homeserver.yaml
    fi
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
    location ~* ^(\/_matrix|\/_synapse\/client|\/_synapse\/admin) {
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

if [ $FEDERATION == "false" ]; then
echo "    server_name ${TOR_ADDRESS};" >> /etc/nginx/conf.d/default.conf
cat >> /etc/nginx/conf.d/default.conf <<"EOT"
    location /_matrix/federation {
        deny all;
        return 403;
    }
EOT
fi

if [ "$(sqlite3 /data/homeserver.db "SELECT COUNT(*) FROM users WHERE name LIKE '@admin:%';" | awk '{print $1}')" -eq 0 ]; then
    echo
    echo "Synapse-admin user not found. Creating ..."
    echo
    admin_password=$(cat /dev/urandom | base64 | head -c 16)
    timeout 10s synapse_homeserver -c /data/homeserver.yaml &
    sleep 3
    register_new_matrix_user --config /data/homeserver.yaml --user admin --password $admin_password --admin
    yq e '.admin_password = "'$admin_password'"' -i /data/start9/config.yaml
fi

if [ "$1" = "reset-first-user" ]; then
    query() {
        sqlite3 /data/homeserver.db "$*"
    }
    password=$(cat /dev/urandom | base64 | head -c 16)
    hashed_password=$(hash_password -p "$password" -c "/data/homeserver.yaml")
    first_user_name=$(query "SELECT name FROM users WHERE creation_ts = (SELECT MIN(creation_ts) FROM users) AND name NOT LIKE '@admin:%' LIMIT 1;")
#    first_user_name=$(query "select name from users where creation_ts = (select min(creation_ts) from users) limit 1;")
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
sed -i 's#synapse.onion#'$TOR_ADDRESS'#g' /var/www/static/js/main.*.js
nginx
privoxy /root/priv-config-forward-onion
export https_proxy="127.0.0.1:8118"
exec tini /start.py
