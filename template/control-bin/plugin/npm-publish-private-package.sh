#!/bin/sh

#{PREPEND_NPM_SCRIPT}

if [ -n "${RUN_IN_DOCKER}" ]; then
	/npm-install/global-installer "@gongt/make-next-private-version"
fi

set +e
set -x
make-private-version ${NPM_ARGUMENTS} .
STATE=$?
set -e

if [ ${STATE} -eq 0 ]; then
	# start publish new package
	npm ${NPM_ARGUMENTS} publish
	echo -e "\e[38;5;10mpublish ok...\e[0m"
elif [ ${STATE} -eq 100 ]; then
	echo -e "\e[38;5;10mnot changed, skip publish...\e[0m"
	STATE=0
else
	echo -e "\e[38;5;9mpublish failed...\e[0m"
	exit ${STATE}
fi

if [ -n "${RUN_IN_DOCKER}" ]; then
	rm -f *.tgz
	/npm-install/global-installer uninstall "@gongt/make-next-private-version"
else
	make-private-version-restore .
fi
