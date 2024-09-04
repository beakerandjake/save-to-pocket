#!/bin/bash

stack_name=$1
user_name=$2

# ensure correct usage
if [ "$#" -ne 2 ]; then
    echo "usage: $0 <stack-name> <user-name>"
    exit 1
fi

# get the table name from the cloudformation stack
table_name=$(aws cloudformation describe-stacks \
    --stack-name $stack_name \
    --query "Stacks[0].Outputs[?OutputKey=='TableName'].OutputValue" \
    --output text)

# bail if failed to get table name
if [ $? -ne 0 ]; then
    exit 1
fi

# prompt user for the password of the new api user
read -sp "password:" p1
echo
read -sp "confirm password:" p2
echo

# bail if passwords do not match
if [ "$p1" != "$p2" ]; then
    echo "passwords do not match"
    exit 1
fi

# generate a hashed password from the raw password
hashed_password=$(node lib/hashPassword.js $p1)

# save user to table
aws dynamodb put-item \
    --table-name $table_name \
    --item "{\"user\":{\"S\": \"$user_name\"},\"hashed_password\":{\"S\":\"$hashed_password\"}}"