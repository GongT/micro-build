#!/bin/sh
set -e
set -x

TYPE=$1 # dep or src
shift
TARGET_FOLDER="$1/bundle" # save folder
shift

if [ "${TYPE}" = 'src' ]; then
	MAIN_FILE=$1 # app main file
	jspm bundle "$@" ${TARGET_FOLDER}/client.js --inject # --minify --no-mangle
	jspm build "$MAIN_FILE" ${TARGET_FOLDER}/full.js --format umd # --minify
else
	jspm bundle "$@" ${TARGET_FOLDER}/dependencies.js --inject # --minify --no-mangle
	
	for LIB in "$@"; do
		[ "${LIB}" = "+" ] && continue
		jspm bundle "${LIB}" "${TARGET_FOLDER}/${LIB}.js" --inject # --minify --no-mangle
	done
fi

echo -e "\e[38;5;10minstall success... \e[0m" >&2
