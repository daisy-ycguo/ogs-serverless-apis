#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo -e "Usage: $0 [names of counters]"
    exit
fi

COUNTER_API_URL=`wsk api list -i | tail -1 | awk '{print $5}'`

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"('$1')")}' \
  $COUNTER_API_URL
