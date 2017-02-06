#!/bin/sh
# name jsonPath target

#{PREPEND_NPM_SCRIPT}

NAME="$1"
SOURCE_JSON="/npm-install/package-json/${2}"
TARGET="/data/${3}"
LOG_FILE="${NAME}.log"

cd /npm-install

mkdir -p ${TARGET}node_modules

mkdir -p .inst
cd .inst

if [ -e "node_modules" ]; then
	unlink node_modules
fi
ln -s ${TARGET}node_modules ./node_modules
if [ -e "package.json" ]; then
	unlink package.json
fi
ln -s ${SOURCE_JSON} ./package.json

echo "PWD=`pwd` ${NPM_INSTALL} --color=true --progress=true"
ls -l
cat ./package.json
${NPM_INSTALL} --color=true --progress=true
RET=$?

if [ ${RET} -ne 0 ]; then
	echo -e "\e[38;5;9m install failed... \e[0m" >&2
	
	echo "==================== LOG LAST 100 LINES =======================" >&2
	tail -n 100 npm-debug.log >&2
	echo "==================== LOG LAST 100 LINES =======================" >&2
	
	echo -e "\e[38;5;9m install failed... \e[0m" >&2
	exit ${RET}
fi
echo -e "\e[38;5;10m install success... \e[0m" >&2

unlink package.json
unlink node_modules

cd /npm-install
rm -rf .inst

#{REMOVE_CACHES}
