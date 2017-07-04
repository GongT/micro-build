#!/bin/sh
set -e
E=`printf '\033'`

TYPE=$1 # dep or src
shift
TARGET_FOLDER=$1 # save folder
shift

if [ "${TYPE}" = 'src' ]; then
	OPTIONS=${1-"--format umd"}
	shift
	
	MAIN_FILE=$1 # app main file
	
	echo "${E}[38;5;14mjspm bundle $@ ${TARGET_FOLDER}/client.js --inject${E}[0m" >&2
	jspm bundle "$@" ${TARGET_FOLDER}/client.js --inject # --minify --no-mangle
	echo "${E}[38;5;14mjspm build $MAIN_FILE ${TARGET_FOLDER}/full.js ${OPTIONS}${E}[0m" >&2
	jspm build "$MAIN_FILE" ${TARGET_FOLDER}/full.js ${OPTIONS} # --minify
else
	echo "${E}[38;5;14mjspm bundle $@ ${TARGET_FOLDER}/dependencies.js --inject${E}[0m" >&2
	jspm bundle "$@" ${TARGET_FOLDER}/dependencies.js --inject # --minify --no-mangle
	
	# for LIB in "$@"; do
	# 	[ "${LIB}" = "+" ] && continue
	# 	jspm bundle "${LIB}" "${TARGET_FOLDER}/${LIB}.js" --inject # --minify --no-mangle
	# done
fi

echo -e "\e[38;5;10minstall success... \e[0m" >&2
