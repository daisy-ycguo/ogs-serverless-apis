#!/bin/bash
#
# Copyright 2017 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the “License”);
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#  https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an “AS IS” BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Load configuration variables
source local.env

function usage() {
  echo -e "Usage: $0 [--install,--uninstall,--env]"
}

function install() {

  # Exit if any command fails
  set -e

  echo -e "Installing OpenWhisk actions, triggers, and rules for openwhisk-serverless-apis..."

  echo -e "Setting ICP credentials and logging in to provision API Gateway"

  # Edit these to match your Bluemix credentials (needed to provision the API Gateway)
  wsk property set --apihost https://10.63.89.111:30427
  wsk property set --auth 789c46b1-71f6-4ed5-8c54-816aa4f8c502:abczO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP
  wsk property set --namespace whisk.system -i

  echo -e "\n"

  echo "creating a package pcloud ()"
  wsk package create pcloud -i \
    --param "MYSQL_HOSTNAME" $MYSQL_HOSTNAME \
    --param "MYSQL_USERNAME" $MYSQL_USERNAME \
    --param "MYSQL_PASSWORD" $MYSQL_PASSWORD \
    --param "MYSQL_DATABASE" $MYSQL_DATABASE

  echo "Installing GET PCLOUD Action"
  cd actions/pcloud-get-action
  npm install
  zip -rq action.zip *
  wsk action create pcloud/pcloud-get -i \
    --kind nodejs:6 action.zip \
    --web true
  wsk api create -i -n "pcloud API" /v1 /pcloud GET pcloud/pcloud-get
  cd ../..

  echo -e "Install Complete"
}

function uninstall() {
  echo -e "Uninstalling..."

  echo "Removing API actions..."
  wsk api delete /v1

  echo "Removing actions..."
  wsk action delete pcloud/pcloud-get

  echo "Removing package..."
  wsk package delete pcloud

  echo -e "Uninstall Complete"
}

function showenv() {
  echo -e MYSQL_HOSTNAME="$MYSQL_HOSTNAME"
  echo -e MYSQL_USERNAME="$MYSQL_USERNAME"
  echo -e MYSQL_PASSWORD="$MYSQL_PASSWORD"
  echo -e MYSQL_DATABASE="$MYSQL_DATABASE"
  echo -e BLUEMIX_USERNAME="$BLUEMIX_USERNAME"
  echo -e BLUEMIX_PASSWORD="$BLUEMIX_PASSWORD"
}

case "$1" in
"--install" )
install
;;
"--uninstall" )
uninstall
;;
"--env" )
showenv
;;
* )
usage
;;
esac
