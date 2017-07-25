#!/bin/sh
# name jsonPath target

#{PREPEND_NPM_SCRIPT}

NAME="$1"
SOURCE_JSON="/install/package-json/${2}"
TARGET="/data/${3}"
LOG_FILE="/install/logs/npm-${NAME}.log"

mkdir -p /install/logs/

cd /install/npm

echo "PWD=`pwd`"

mkdir -p ${TARGET}node_modules

mkdir -p .inst
cd .inst
echo "CWD=`pwd`"

if [ -e "node_modules" ]; then
	unlink node_modules
fi
echo "+ ln -s ${TARGET}node_modules ./node_modules"
ln -s ${TARGET}node_modules ./node_modules
if [ -e "package.json" ]; then
	echo "+ unlink package.json"
	unlink package.json
fi
echo "+ ln -s ${SOURCE_JSON} ./package.json"
ln -s ${SOURCE_JSON} ./package.json

echo ""
${NPM_INSTALL}
RET=$?
echo "npm exit: $RET"
handle_npm_error ${RET}

echo "npm prune"
${NPM_EXEC} ${NPM_ARGUMENTS} prune
echo "npm dedupe"
${NPM_EXEC} ${NPM_ARGUMENTS} dedupe

unlink package.json
unlink node_modules

cd /install/npm
rm -rf .inst

#{REMOVE_CACHES}
