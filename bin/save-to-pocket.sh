#!/bin/bash
# Script: save-to-pocket.sh
# Description: Saves an item to pocket using the save-to-pocket api 
# Usage: ./save-to-pocket.sh <item_url>
set -e

item_url=$1

# ensure correct usage
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <item_url>"
    exit 1
fi

# load config file
config_file=~/.save-to-pocket/config

# ensure config file exists
if [ ! -f "$config_file" ]; then
    echo "Could not find config file: $config_file"
    exit 1
fi

# set variables from the config file
while IFS='=' read -r key value; do
    case "$key" in
        url) api_url="$value" ;;
        username) username="$value" ;;
        password) password="$value" ;; 
    esac
done < "$config_file"

# ensure configuration file is valid
if [ -z "$api_url" ] || [ -z "$username" ] || [ -z "$password" ]; then
    echo "Invalid config file: ensure url, username and password are set"
    exit 1
fi

# since using basic http auth, ensure using https protocol
if [[ "$api_url" != https://* ]]; then
    echo "Invalid config file: API URL must use https protocol"
    exit 1
fi

# HTTP Basic auth expects we base64 encode 'username:password'
basic_auth=$(echo -n "${username}:${password}" | base64)

curl -X POST $api_url \
    -H "Content-Type: application/json" \
    -H "Authorization: Basic $basic_auth" \
    -d "{\"url\":\"$item_url\"}" \
    -w "\n"

    