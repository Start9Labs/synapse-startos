#!/bin/sh

set -e

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
echo "$HOST_IP   tor" >> /etc/hosts

if ! [ -f /data/homeserver.yaml ]; then
    SYNAPSE_SERVER_NAME=$TOR_ADDRESS SYNAPSE_REPORT_STATS=yes /start.py generate
    yq e -i ".federation_certificate_verification_whitelist[0] = \"*.onion\"" /data/homeserver.yaml
    yq e -i ".listeners[0].bind_addresses = [\"127.0.0.1\"]" /data/homeserver.yaml
fi

# if [ "$(yq e ".enable-registration" /data/start9/config.yaml)" = "true" ]; then
#     yq e -i ".enable_registration = true" /data/homeserver.yaml
# else
#     yq e -i ".enable_registration = false" /data/homeserver.yaml
# fi

# if [ "$(yq e ".advanced.smtp.enabled" /data/start9/config.yaml)" = "true" ]; then
#     yq e -i ".public_baseurl = \"$TOR_ADDRESS\"" /data/homeserver.yaml
#     SMTP_SERVER="$(yq e ".advanced.smtp.address" /data/start9/config.yaml | sed 's/\"/\\"/g')"
#     yq e -i ".email.smtp_host = \"$SMTP_SERVER\"" /data/homeserver.yaml
#     SMTP_PORT="$(yq e ".advanced.smtp.port" /data/start9/config.yaml)"
#     yq e -i ".email.smtp_port = $SMTP_PORT" /data/homeserver.yaml
#     SMTP_FROM_ADDRESS="$(yq e ".advanced.smtp.from-address" /data/start9/config.yaml)"
#     SMTP_NOTIF_FROM="Your Friendly %(app)s homeserver <$SMTP_FROM_ADDRESS>"
#     yq e -i ".email.notif_from = \"$SMTP_NOTIF_FROM\"" /data/homeserver.yaml
#     if yq e -e ".advanced.smtp.authentication.username" /data/start9/config.yaml > /dev/null; then
#         SMTP_LOGIN="$(yq e ".advanced.smtp.authentication.username" /data/start9/config.yaml | sed 's/\"/\\"/g')"
#         yq e -i ".email.smtp_user = \"$SMTP_LOGIN\"" /data/homeserver.yaml
#     fi
#     if yq e -e ".advanced.smtp.authentication.password" /data/start9/config.yaml > /dev/null; then
#         SMTP_PASSWORD="$(yq e ".advanced.smtp.authentication.password" /data/start9/config.yaml | sed 's/\"/\\"/g')"
#         echo $SMTP_PASSWORD
#         yq e -i ".email.smtp_pass = \"$SMTP_PASSWORD\"" /data/homeserver.yaml
#     fi
#     SMTP_REQUIRE_TS="$(yq e ".advanced.smtp.require-transport-security" /data/start9/config.yaml)"
#     yq e -i ".email.require_transport_security = $SMTP_REQUIRE_TS" /data/homeserver.yaml
#     if yq e -e ".advanced.smtp.app-name" /data/start9/config.yaml > /dev/null; then
#         SMTP_APP_NAME="$(yq e ".advanced.smtp.app-name" /data/start9/config.yaml | sed 's/\"/\\"/g')"
#         yq e -i ".email.app_name = \"$SMTP_APP_NAME\"" /data/homeserver.yaml
#     fi
#     SMTP_ENABLE_NOTIFS="$(yq e ".advanced.smtp.enable-notifs" /data/start9/config.yaml)"
#     yq e -i ".email.enable_notifs = $SMTP_ENABLE_NOTIFS" /data/homeserver.yaml
#     SMTP_NOTIF_FOR_NEW_USERS="$(yq e ".advanced.smtp.notif-for-new-users" /data/start9/config.yaml)"
#     yq e -i ".email.notif_for_new_users = $SMTP_NOTIF_FOR_NEW_USERS" /data/homeserver.yaml
# fi

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

python /configurator.py
nginx
privoxy /etc/privoxy/config
export https_proxy="127.0.0.1:8118"
exec tini /start.py
