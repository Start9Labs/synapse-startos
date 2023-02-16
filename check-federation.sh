#!/bin/bash

FEDERATION=$(yq e '.federation' /data/start9/config.yaml)

if [$FEDERATION == 'false']; then
    exit 59
fi

DURATION=$(</dev/stdin)
if (($DURATION <= 30000 )); then
    exit 60
else
    curl -s -k https://synapse.embassy/_matrix/federation/v1/version &>/dev/null
    exit_code=$?
    if test "$exit_code" != 0; then
        echo "Homeserver is unreachable" >&2
        exit 1
    fi
fi
