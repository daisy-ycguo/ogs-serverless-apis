#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo -e "Usage: $0 [name]"
    exit
fi

COUNTER_API_URL=`wsk api list | tail -1 | awk '{print $5}'`

curl -X DELETE "${COUNTER_API_URL}?name=${1}"
