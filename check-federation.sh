#!/bin/bash

DURATION=$(</dev/stdin)
if (($DURATION <= 30000 )); then
    exit 60
else
    curl -s -k https://synapse.embassy/_matrix/federation/v1/version
    RES=$?
    if test "$RES" != 0; then
        echo "Homeserver is unreachable" >&2
        exit 1
    fi
fi
