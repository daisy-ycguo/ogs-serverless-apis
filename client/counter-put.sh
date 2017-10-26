#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo -e "Usage: $0 [name of counter] [count of counter]"
    exit
fi

COUNTER_API_URL=`wsk api list -i | tail -1 | awk '{print $5}'`

curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{"name":"'$1'","count":'$2'}' \
  $COUNTER_API_URL
