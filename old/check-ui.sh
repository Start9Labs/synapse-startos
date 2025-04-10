#!/bin/sh
FEDERATION=$(yq e '.federation' /data/start9/config.yaml)

if [ "$FEDERATION" = 'false' ]; then
    CHCK='curl -skf https://synapse.embassy/_matrix/client/versions >/dev/null 2>&1'
    eval "$CHCK"
    exit_code=$?
    if [ "$exit_code" -ne 0 ]; then
        echo "Initializing Homeserver ..." >&2
        exit 61
        sleep 25
        eval "$CHCK"
        exit_code=$?
        if [ "$exit_code" -ne 0 ]; then
            echo "Homeserver is unreachable" >&2
            exit 1
        fi
    fi
else
    while true; do
        if [ ! -f /data/start9/stats.yaml ]; then
            echo "Waiting for Synapse to finish initialization ..." >&2
            exit 61
        else
            chkstats=$(yq e '.data["Admin Username"].value' /data/start9/stats.yaml)
            if [ "$chkstats" = "admin" ]; then
                exit 0
            else
                echo "Failed to retrieve admin credentials." >&2
                exit 1
            fi
        fi
    done
fi
