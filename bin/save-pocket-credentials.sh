#!/bin/bash
# Script: save-pocket-credentials.sh
# Description: Saves the Pocket API consumer key and access token to SSM Parameter Store 
# Usage: ./save-pocket-credentials.sh <stack-name>
set -e

stack_name=$1

# ensure correct usage
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <stack-name>"
    exit 1
fi

# get the stack outputs so we can get the param names 
outputs=$(aws cloudformation describe-stacks \
    --stack-name "$stack_name" \
    --query "Stacks[0].Outputs")

# expect the stack exports the names of the consumer / access key params for us
access_token_name=$(echo $outputs | jq -r '.[] | select(.OutputKey == "AccessTokenName") | .OutputValue')
consumer_key_name=$(echo $outputs | jq -r '.[] | select(.OutputKey == "ConsumerKeyName") | .OutputValue')

if [ -z "$access_token_name" ] || [ -z "$consumer_key_name" ]; then
    echo "Failed to get access token / consumer key from describe-stacks output."
    exit 1
fi

# get the consumer / access key values from the user
read -sp "Pocket API Consumer Key: " consumer_key_value
echo
if [ -z "$consumer_key_value" ]; then
    echo "Invalid Consumer Key."
    exit 1
fi
read -sp "Pocket API Access Token: " access_token_value
echo
if [ -z "$access_token_value" ]; then
    echo "Invalid Access Token."
    exit 1
fi

# update the params with the new values and change to SecureString type

aws ssm put-parameter \
    --name "$consumer_key_name" \
    --value "$consumer_key_value" \
    --type SecureString \
    --tier Standard \
    --overwrite > /dev/null

aws ssm put-parameter \
    --name "$access_token_name" \
    --value "$access_token_value" \
    --type SecureString \
    --tier Standard \
    --overwrite > /dev/null

echo "Successfully saved Pocket API credentials."