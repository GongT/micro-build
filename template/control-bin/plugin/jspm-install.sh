#!/bin/sh

set -e
set -x

if [ "yes" = "${NPM_LAYER_ENABLED}" ]; then
	if [ -z "${HOST_LOOP_IP}" ]; then
		die "something worng... no HOST_LOOP_IP set."
	fi
	echo "npm layer enabled, rewrite /etc/resolv.conf"
	echo "nameserver ${HOST_LOOP_IP}" > /etc/resolv.conf
fi

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
