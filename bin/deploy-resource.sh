#!/bin/bash
# Script: deploy-resource.sh
# Description: Deploys a couldformation template 
# Usage: ./deploy-resource.sh <file-name> <stack-name>

# ensure correct usage
if [ "$#" -ne 2 ]; then
    echo "usage: $0 <file-name> <stack-name>"
    exit 1
fi

# ensure requested template file exists
if [ ! -f $1 ]; then
    echo "could not find file at: $1"
    exit 1
fi

# aws cli expects local templates to be prefixed with file://
file_arg="file://$1"

# validates before deploy
aws cloudformation validate-template --template-body $file_arg > /dev/null \ 
    && aws cloudformation create-stack --stack-name $2 --template-body $file_arg