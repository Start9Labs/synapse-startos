#!/bin/sh
if openssl x509 -enddate -noout -in cert.pem -checkend 604800; then
    openssl req -x509 -nodes -days 365 -keyin /data/key.pem -out /data/cert.pem -config /etc/ssl/cert.conf
fi
