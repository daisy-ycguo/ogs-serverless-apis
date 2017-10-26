#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo -e "Usage: $0 [name]"
    exit
fi

COUNTER_API_URL=`wsk api list -i | tail -1 | awk '{print $5}'`

curl ${COUNTER_API_URL}?name=${1}
