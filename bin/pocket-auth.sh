#!/bin/bash
# Script: pocket-auth.sh
# Description: Performs the Pocket Authentication flow outlined at: https://getpocket.com/developer/docs/authentication
# Usage: ./pocket-auth.sh <consumer-key> [callback-port]
set -e

consumer_key=$1
callback_port=${2:-3000}

# ensure correct usage
if [ "$#" -lt 1 ]; then
    echo "usage: $0 <consumer-key>"
    exit 1
fi

# ====================
# STEP 1: Obtain a request token
# ====================

# redirecting to local node server to finish auth flow
local_redirect_url="http://localhost:$callback_port"

# pocket API expects we provide consumer key and redirect URI
body=$(jq -n \
    --arg key "$consumer_key" \
    --arg uri "$local_redirect_url" \
    '{consumer_key:$key,redirect_uri:$uri}' )

# obtain the request token from Pocket API
request_token=$(curl -s -X POST https://getpocket.com/v3/oauth/request \
    -H "Content-Type: application/json" \
    -H "X-Accept: application/json" \
    -d "$body" | jq -r '.code')

# ensure request token
if [ -z "$request_token" ]; then
    echo "Could not get request token from Pocket API"
    exit 1
fi

# ====================
# STEP 2: Redirect user to Pocket to continue authorization
# ====================

# redirect the user to pocket
pocket_redirect_url="https://getpocket.com/auth/authorize?request_token=$request_token&redirect_uri=$local_redirect_url"
echo "Open this link to authorize the connection to your pocket account (ctrl+c to cancel): $pocket_redirect_url"

# start node server