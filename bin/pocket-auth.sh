#!/bin/bash
# Script: pocket-auth.sh
# Description: Performs the Pocket Authentication flow outlined at: https://getpocket.com/developer/docs/authentication
# Usage: ./pocket-auth.sh [callback-port]
set -e

callback_port=${1:-3000}

# get consumer key
read -sp "Enter Pocket consumer key:" consumer_key
echo

if [ -z "$consumer_key" ]; then
    echo "Invalid consumer key"
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

echo "Open this link to authorize the connection to your pocket account (ctrl+c to cancel): https://getpocket.com/auth/authorize?request_token=$request_token&redirect_uri=$local_redirect_url"

# ====================
# STEP 3: Receive the callback from Pocket
# ====================

export PORT="$callback_port"
node lib/pocketCallbackServer.js

# ====================
# STEP 4: Convert a request token into a Pocket access token
# ====================

# pocket API expects we provide consumer key and request token
body=$(jq -n \
    --arg key "$consumer_key" \
    --arg token "$request_token" \
    '{consumer_key:$key,code:$token}' )

# obtain the access token
access_token=$(curl -s -X POST https://getpocket.com/v3/oauth/authorize \
    -H "Content-Type: application/json" \
    -H "X-Accept: application/json" \
    -d "$body" | jq -r '.access_token')

echo "Success, here is your secret pocket access token: $access_token"