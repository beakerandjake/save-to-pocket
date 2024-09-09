#!/bin/bash
# Script: delete.sh
# Description: Removes all deployed stacks for save-to-pocket application from AWS.
# Usage: ./delete.sh
set -e

db_stack_name=save-to-pocket-db
config_stack_name=save-to-pocket-config
frontend_stack_name=save-to-pocket-frontend

echo "Deleting stacks..."
sam delete --stack-name $frontend_stack_name --no-prompts > /dev/null
aws cloudformation delete-stack --stack-name $config_stack_name
aws cloudformation delete-stack --stack-name $db_stack_name
echo "Deleted stacks: $db_stack_name, $config_stack_name, $frontend_stack_name."