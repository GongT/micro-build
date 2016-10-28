#!/bin/sh
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

printf "\033[0;2m" >&2

${NPM_INSTALL} --color=false 2>&1 | tee ${LOG_FILE} >&2
if [ $? -ne 0 ]; then
	printf "\033[38;5;9m" >&2
	echo "install failed..." >&2
	printf "\033[0m" >&2
	exit 1
fi
printf "\033[38;5;10m" >&2
echo "install success..."
printf "\033[0m" >&2

unlink package.json
unlink node_modules

cd /npm-install
rm -rf .inst
