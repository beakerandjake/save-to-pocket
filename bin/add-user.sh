#!/bin/bash
# Script: add-user.sh
# Description: Adds a new user item to the UsersTable 
# Usage: ./add-user.sh <db-stack-name> <user-name>
set -e

stack_name=$1
user_name=$2

# ensure correct usage
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <db-stack-name> <user-name>"
    exit 1
fi

# get the dynamodb table name from the stack
table_name=$(aws cloudformation describe-stacks \
    --stack-name "$stack_name" \
    --query "Stacks[0].Outputs[?OutputKey=='TableName'].OutputValue" \
    --output text)

# prompt for the password of the new user
read -sp "Password:" p1
echo
read -sp "Confirm password:" p2
echo

# ensure entered passwords match
if [ "$p1" != "$p2" ]; then
    echo "Passwords do not match."
    exit 1
fi

# generate a hashed password from the raw password
hashed_password=$(node lib/hashPassword.js $p1)

# save user to table
aws dynamodb put-item \
    --table-name "$table_name" \
    --item "{\"id\":{\"S\": \"$user_name\"},\"hashed_password\":{\"S\":\"$hashed_password\"}}"

echo "Successfully added to Users table."