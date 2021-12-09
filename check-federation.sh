#!/bin/bash

curl_result=$(curl -s -k https://synapse.embassy/_matrix/federation/v1/version)
exit_code=$?

if [[ "$exit_code" == 0 ]]; then
    exit 0
else
    exit 60
fi

exit $exit_code
