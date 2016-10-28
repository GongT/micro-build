#!/bin/sh
# name jsonPath target
set -e

NPM_INSTALL="@{NPM_INSTALL}"

echo "${NPM_INSTALL}"

printf "\033[0;2m" >&2

${NPM_INSTALL} --color=false -g "$@" 2>&1 | tee -a global.log >&2

if [ $? -ne 0 ]; then
	printf "\033[38;5;9m" >&2
	echo "install failed..." >&2
	printf "\033[0m" >&2
	exit 1
fi

printf "\033[38;5;10m" >&2
echo "install success..."
printf "\033[0m" >&2
