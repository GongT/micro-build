#!/bin/sh

#{PREPEND_NPM_SCRIPT}

/npm-install/global-installer "@gongt/make-next-private-version"

set +e
make-private-version ${NPM_ARGUMENTS} .
STATE=$?
set -e

if [ ${STATE} -eq 0 ]; then
	# start publish new package
	npm ${NPM_ARGUMENTS} publish
	echo -e "\e[38;5;10mpublish ok...\e[0m"
elif [ ${STATE} -eq 100 ]; then
	echo -e "\e[38;5;10mnot changed, skip publish...\e[0m"
else
	exit ${STATE}
fi

rm -f *.tgz

/npm-install/global-installer uninstall "@gongt/make-next-private-version"
