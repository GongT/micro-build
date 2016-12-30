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

if [ -n "${NPM_REGISTRY}" ]; then
	jspm config registries.npm.registry ${NPM_REGISTRY}
fi
if [ -n "${HTTP_PROXY}" ]; then
	git config --system --replace-all global.proxy "${HTTP_PROXY}"
	git config --system --replace-all http.proxy "${HTTP_PROXY}"
	git config --system --replace-all https.proxy "${HTTP_PROXY}"
	cat /etc/gitconfig
fi
#{JSPM_GITHUB_CONFIG}
#jspm config strictSSL false

jspm install -y

rm -rf ~/.npm ~/.node-gyp /npm-install/npm-cache

if [ -n "${HTTP_PROXY}" ]; then
	git config --system --unset-all global.proxy
	git config --system --unset-all http.proxy
	git config --system --unset-all https.proxy
fi

#{APPEND}
