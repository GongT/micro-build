#!/bin/sh
set -e
set -x

TYPE=$1 # dep or src
shift
TARGET_FOLDER=$1 # save folder
shift

if [ "${TYPE}" = 'src' ]; then
	MAIN_FILE=$1 # app main file
	jspm bundle "$@" ${TARGET_FOLDER}/client.js --no-mangle --minify --inject
	jspm bundle-sfx "$MAIN_FILE" - babel-runtime ${TARGET_FOLDER}/full.js --minify
else
	jspm bundle "$@" ${TARGET_FOLDER}/dependencies.js --no-mangle --minify --inject
fi
