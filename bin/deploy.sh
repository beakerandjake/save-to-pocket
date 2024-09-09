#!/bin/bash
# Script: fdeploy.sh
# Description: Performs a full deploy of the application to AWS.
# Usage: ./deploy.sh
set -e

db_stack_name=save-to-pocket-db
config_stack_name=save-to-pocket-config
frontend_stack_name=save-to-pocket-frontend

# ===================================================
# Deploy & configure the configuration stack
# ===================================================

# create the config stack & wait for creation to be completed
echo "Deploying $config_stack_name stack..."
bin/deploy-resource.sh resources/config.template "$config_stack_name" > /dev/null
aws cloudformation wait stack-create-complete --stack-name "$config_stack_name"
echo "Successfully deployed $config_stack_name."

# add the actual credentials to the newly created config stack
bin/save-pocket-credentials.sh "$config_stack_name"

# ===================================================
# Deploy & configure the database stack
# ===================================================

# create the db stack & wait for creation to be completed
echo "Deploying $db_stack_name stack..."
bin/deploy-resource.sh resources/db.template "$db_stack_name" > /dev/null
aws cloudformation wait stack-create-complete --stack-name "$db_stack_name"
echo "Successfully deployed $db_stack_name."

# ensure at least one user is in the database
read -p "Enter default user [user]: " user_name
user_name=${user_name:-user}
bin/add-user.sh "$db_stack_name" "$user_name"

# ===================================================
# Deploy the frontend stack
# ===================================================

# create the frontend stack & wait for creation to be completed
echo "Deploying $frontend_stack_name stack..."
sam deploy \
    --stack-name "$frontend_stack_name" \
    --no-confirm-changeset \
    --no-progressbar > /dev/null
echo "Successfully deployed $frontend_stack_name."

# get the api url from the frontend stack
api_url=$(aws cloudformation describe-stacks \
    --stack-name "$frontend_stack_name" \
    --query "Stacks[0].Outputs[?OutputKey=='SaveToPocketApi'].OutputValue" \
    --output text)

echo "save-to-pocket deployed at: $api_url"