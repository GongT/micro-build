#!/bin/sh

set -e
set -x

update-resolve

#{PREPEND}

# jspm-install.sh $PACKAGE_JSON $TARGET $BASE_DIR

PACKAGE_JSON=$1
TARGET=$2
BASE_DIR=$3

mkdir -p /tmp/${PACKAGE_JSON}
cd /tmp/${PACKAGE_JSON}


cp /package-json/${PACKAGE_JSON} ./package.json

mkdir -p `dirname ${BASE_DIR}`
mkdir -p "${TARGET}/${BASE_DIR}"
ln -s "${TARGET}/${BASE_DIR}" ./${BASE_DIR}
ln -s "${TARGET}/node_modules" ./node_modules

jspm config registries.npm.registry ${NPM_REGISTRY}
#jspm config strictSSL false
#cat ~/.jspm/config
jspm install -y

rm -rf ~/.npm ~/.node-gyp /npm-install/npm-cache

#{APPEND}
