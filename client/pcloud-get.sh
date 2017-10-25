#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo -e "Usage: $0 [id]"
    exit
fi

PCLOUD_API_URL=`wsk api list | tail -1 | awk '{print $1}'`

curl ${PCLOUD_API_URL}?id=${1}
