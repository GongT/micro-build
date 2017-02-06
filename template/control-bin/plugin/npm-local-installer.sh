#!/bin/sh
# name jsonPath target

#{PREPEND_NPM_SCRIPT}

echo "PWD=`pwd` ${NPM_INSTALL} --color=true --progress=true $@"
printf "\033[0;2m" >&2
${NPM_INSTALL} --color=true --progress=true "$@"
RET=$?

if [ ${RET} -ne 0 ]; then
	echo -e "\e[38;5;9m install failed... \e[0m" >&2
	
	echo "==========================================="
	cat npm-debug.log
	echo "==========================================="
	
	echo -e "\e[38;5;9m install failed... \e[0m" >&2
	exit ${RET}
fi
echo -e "\e[38;5;10m install success... \e[0m" >&2

#{REMOVE_CACHES}
