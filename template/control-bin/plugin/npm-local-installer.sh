#!/bin/sh
# name jsonPath target

#{PREPEND_NPM_SCRIPT}

echo "PWD=`pwd`"
echo "PACKAGE LIST: $@"

printf "\033[0;2m" >&2
${NPM_INSTALL} "$@"
handle_npm_error $?

#{REMOVE_CACHES}
