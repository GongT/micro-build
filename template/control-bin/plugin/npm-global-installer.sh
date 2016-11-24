#!/bin/bash
# name jsonPath target
set -e

#{PREPEND_NPM_SCRIPT}

echo "PWD=`pwd` ${NPM_INSTALL} --color=true --progress=true -g $@"
printf "\033[0;2m" >&2
${NPM_INSTALL} --color=true --progress=true -g "$@"

if [ $? -ne 0 ]; then
	echo -e "\e[38;5;9m install failed... \e[0m" >&2
	exit $?
fi
echo -e "\e[38;5;10m install success... \e[0m" >&2
