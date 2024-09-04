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
access_key_name=$(echo $outputs | jq -r '.[] | select(.OutputKey == "AccessKeyName") | .OutputValue')
consumer_key_name=$(echo $outputs | jq -r '.[] | select(.OutputKey == "ConsumerKeyName") | .OutputValue')

if [ -z "$access_key_name" ] || [ -z "$consumer_key_name" ]; then
    echo "Failed to get access key / consumer key from describe-stacks output."
    exit 1
fi

# get the consumer / access key values from the user
read -sp "Pocket API Consumer Key: " consumer_key_value
echo
read -sp "Pocket API Access Key: " access_key_value
echo

# update the params with the new values
aws ssm put-parameter \
    --name "$consumer_key_value" \
    --value "$consumer_key_value" \
    --type SecureString \
    --tier Standard \
    --overwrite > /dev/null

aws ssm put-parameter \
    --name "$access_key_name" \
    --value "$access_key_value" \
    --type SecureString \
    --tier Standard \
    --overwrite > /dev/null

echo "Saved Pocket API keys to SSM Parameter Store."