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

echo -e "\e[0;2m" >&2

${NPM_INSTALL} 2>&1 | tee ${LOG_FILE}
if [ $? -ne 0 ]; then
	echo -e "\e[38;5;9m" >&2
	echo "install failed..." >&2
	echo -e "\e[0m" >&2
	exit 1
fi
echo -e "\e[38;5;10m" >&2
echo "install success..."
echo -e "\e[0m" >&2

unlink package.json
unlink node_modules

cd /npm-install
rm -rf .inst
