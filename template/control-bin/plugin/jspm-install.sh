#!/bin/sh

set -e
set -x

PACKAGE_FILE=$1

if [ "finish" = "${PACKAGE_FILE}" ]; then
	jspm cache-clear
#{REMOVE_CACHES}
	rm -rfv /tmp/*
	exit 0
fi

# jspm-install.sh jspm-a/ ./public/jspm.js /data ./jspm_packages
PACKAGE_FOLDER=$(dirname "${PACKAGE_FILE}")
CONFIG_FILE=$2
CONFIG_FOLDER=$(dirname "${CONFIG_FILE}")
TARGET=$3
BASE_DIR=$4

IS_CONTINUE=$5

INSTALL_ROOT="/install/package-json/${PACKAGE_FOLDER}"

update-resolve

cd "${TARGET}"

mkdir -p "${BASE_DIR}"
mkdir -p "${CONFIG_FOLDER}"

if [ -f package.json ]; then
	mv package.json package.json.jspm_install_bak
fi
cp "${INSTALL_ROOT}/package.json" ./package.json

if [ ! -f "./${CONFIG_FILE}" ]; then
	cp "${INSTALL_ROOT}/${CONFIG_FILE}" ./${CONFIG_FILE}
fi

if [ -n "${NPM_REGISTRY}" ]; then
	jspm config registries.npm.registry ${NPM_REGISTRY}
fi
if [ -n "${HTTP_PROXY}" ]; then
	git config --system --replace-all http.proxy "${HTTP_PROXY}"
	git config --system --replace-all https.proxy "${HTTP_PROXY}"
	cat /etc/gitconfig
fi
#{JSPM_GITHUB_CONFIG}
#jspm config strictSSL false

# ls -al --color=always

echo "HTTP_PROXY=${HTTP_PROXY}"
echo "HTTPS_PROXY=${HTTPS_PROXY}"

jspm install -y
jspm update

if [ -z "${IS_CONTINUE}" ]; then
	jspm cache-clear
#{REMOVE_CACHES}
	rm -rfv /tmp/*
fi

if [ -n "${HTTP_PROXY}" ]; then
	git config --system --unset-all http.proxy
	git config --system --unset-all https.proxy
fi

if [ -f package.json.jspm_install_bak ]; then
	unlink ./package.json
	mv package.json.jspm_install_bak package.json
fi
