#!/bin/sh

FEDERATION=$(yq e '.federation' /data/start9/config.yaml)

if [ "$FEDERATION" = 'false' ]; then
    exit 59
fi

read DURATION
if [ "$DURATION" -le 10000 ]; then
    exit 60
else
    CHCK='curl -skf https://synapse.embassy/_matrix/federation/v1/version >/dev/null 2>&1'
    eval "$CHCK"
    exit_code=$?
    if [ "$exit_code" -ne 0 ]; then
        echo "Initializing Homeserver ..."  >&2
        exit 61
        sleep 25
        eval "$CHCK"
        exit_code=$?
        if [ "$exit_code" -ne 0 ]; then
            echo "Homeserver is unreachable" >&2
            exit 1
        fi
    fi
fi
