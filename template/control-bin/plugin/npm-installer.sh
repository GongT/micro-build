#!/bin/bash
# name jsonPath target
set -e

#{PREPEND_NPM_SCRIPT}

NAME="$1"
SOURCE_JSON="/npm-install/${2}"
TARGET="/data/${3}"
LOG_FILE="${NAME}.log"

cd /npm-install

mkdir -p ${TARGET}/node_modules

mkdir -p .inst
cd .inst

if [ -e "node_modules" ]; then
	unlink node_modules
fi
ln -s ${TARGET}/node_modules ./node_modules
if [ -e "package.json" ]; then
	unlink package.json
fi
ln -s ${SOURCE_JSON} ./package.json

echo "PWD=`pwd` ${NPM_INSTALL} --color=true --progress=true"
${NPM_INSTALL} --color=true --progress=true

if [ $? -ne 0 ]; then
	echo -e "\e[38;5;9m install failed... \e[0m" >&2
	exit $?
fi
echo -e "\e[38;5;10m install success... \e[0m" >&2

unlink package.json
unlink node_modules

cd /npm-install
rm -rf .inst
