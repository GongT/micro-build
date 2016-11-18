#!/bin/bash
# name jsonPath target
set -e

#{PREPEND_NPM_SCRIPT}

echo "PWD=`pwd` ${NPM_INSTALL} --color=false $@"
printf "\033[0;2m" >&2
${NPM_INSTALL} --color=false "$@"

if [ $? -ne 0 ]; then
	printf "\033[38;5;9m" >&2
	echo "install failed..." >&2
	printf "\033[0m" >&2
	exit 1
fi

printf "\033[38;5;10m" >&2
echo "install success..."
printf "\033[0m" >&2
