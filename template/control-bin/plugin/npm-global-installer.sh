#!/bin/bash
# name jsonPath target
set -e

NPM_INSTALL="@{NPM_INSTALL}"

echo "${NPM_INSTALL}"

echo -e "\e[0;2m" >&2

${NPM_INSTALL} --color=false -g "$@" 2>&1 | tee -a global.log

if [ $? -ne 0 ]; then
	echo -e "\e[38;5;9m" >&2
	echo "install failed..." >&2
	echo -e "\e[0m" >&2
	exit 1
fi

echo -e "\e[38;5;10m" >&2
echo "install success..."
echo -e "\e[0m" >&2
