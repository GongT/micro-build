#!/bin/sh
# name jsonPath target

set -x

#{PREPEND_NPM_SCRIPT}

NAME="$1"
SOURCE_JSON="/install/package-json/${2}"
TARGET="/data/${3}"
LOG_FILE="${NAME}.log"

cd /install/npm

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

echo "PWD=`pwd` ${NPM_INSTALL}"
ls -l
cat ./package.json
echo ""
echo " => npm install logs:"
echo "npm install is running..."
${NPM_INSTALL}
RET=$?

if [ ${RET} -ne 0 ]; then
	echo -e "\e[38;5;9m install failed... \e[0m" >&2
	
	echo "==================== LOG LAST 100 LINES =======================" >&2
	tail -n 100 npm-debug.log >&2
	echo "==================== LOG LAST 100 LINES =======================" >&2
	
	echo -e "\e[38;5;9minstall failed... \e[0m" >&2
	exit ${RET}
fi
echo -e "\e[38;5;10minstall success... \e[0m" >&2

unlink package.json
unlink node_modules

cd /install/npm
rm -rf .inst

#{REMOVE_CACHES}
