#!/bin/bash
# Script: deploy-resource.sh
# Description: Deploys a couldformation template 
# Usage: ./deploy-resource.sh <file-name> <stack-name>
set -e

file_name=$1
stack_name=$2

# ensure correct usage
if [ "$#" -ne 2 ]; then
    echo "usage: $0 <file-name> <stack-name>"
    exit 1
fi

# ensure requested template file exists
if [ ! -f $file_name ]; then
    echo "Could not find file at: $file_name"
    exit 1
fi

# aws cli expects local templates to be prefixed with file://
file_arg="file://$file_name"

# validates before deploy
aws cloudformation validate-template --template-body "$file_arg" > /dev/null
aws cloudformation create-stack --stack-name "$stack_name" --template-body "$file_arg"