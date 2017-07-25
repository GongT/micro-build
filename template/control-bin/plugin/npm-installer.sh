#!/bin/sh
# name jsonPath target

#{PREPEND_NPM_SCRIPT}

NAME="$1"
SOURCE_JSON="/install/package-json/${2}"
TARGET="/data/${3}"
LOG_FILE="/install/logs/npm-${NAME}.log"

mkdir -p /install/logs/

cd ${TARGET}

echo "PWD=`pwd`"

if [ -e "package-lock.json" ]; then
	echo "Warn: package-lock.json exists - remove it" >&2
	unlink package-lock.json
fi

# package.json
if [ -e "package.json" ]; then
	mv package.json /tmp/hide_package.json
fi
echo "+ ln -s ${SOURCE_JSON} ./package.json"
ln -s ${SOURCE_JSON} ./package.json

# REAL INSTALL
echo ""
${NPM_INSTALL}
RET=$?
echo "npm exit: $RET"
handle_npm_error ${RET}

# package.json
unlink package.json
if [ -e "/tmp/hide_package.json" ]; then
	mv /tmp/hide_package.json ./package.json
fi

echo "running npm prune..."
${NPM_EXEC} ${NPM_ARGUMENTS} prune &>/dev/null
echo "running npm prune..."
${NPM_EXEC} ${NPM_ARGUMENTS} dedupe &>/dev/null

#{REMOVE_CACHES}
