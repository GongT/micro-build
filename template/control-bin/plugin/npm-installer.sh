#!/bin/bash
# name jsonPath target
set -e

NAME="$1"
SOURCE_JSON="/npm-install/${2}"
TARGET="/data/${3}"
LOG_FILE="${NAME}.log"
NPM_INSTALL="@{NPM_INSTALL}"

cd /npm-install

mkdir -p ${TARGET}/node_modules
ln -s ${TARGET}/node_modules ./${NAME}

mkdir -p .inst
cd .inst

if [ -e "node_modules" ]; then
	unlink node_modules
fi
if [ -e "package.json" ]; then
	unlink package.json
fi
ln -s ${SOURCE_JSON} ./package.json
ln -s ${TARGET}/node_modules ./node_modules

echo "${NPM_INSTALL}"

${NPM_INSTALL} 2>&1 | tee ${LOG_FILE}
if [ $? -ne 0 ]; then
	echo "install failed..." >&2
	exit 1
fi
echo "install success..."

unlink package.json
unlink node_modules

cd /npm-install
rm -rf .inst
