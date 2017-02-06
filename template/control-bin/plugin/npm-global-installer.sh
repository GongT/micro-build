#!/bin/sh
# name jsonPath target

#{PREPEND_NPM_SCRIPT}

echo "PWD=`pwd` ${NPM_INSTALL} --color=true --progress=true -g $@"
printf "\033[0;2m" >&2
${NPM_INSTALL} --color=true --progress=true -g "$@"
RET=$?

if [ ${RET} -ne 0 ]; then
	echo -e "\e[38;5;9m install failed... \e[0m" >&2
	
	echo "===========================================" >&2
	cat npm-debug.log >&2
	echo "===========================================" >&2
	
	echo -e "\e[38;5;9m install failed... \e[0m" >&2
	exit ${RET}
fi
echo -e "\e[38;5;10m install success... \e[0m" >&2

#{REMOVE_CACHES}
