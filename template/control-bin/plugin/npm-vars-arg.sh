#!/bin/sh

#{PREPEND_NPM_SCRIPT}

npm ${NPM_ARGUMENTS} "$@"

rm -rf ~/.npm ~/.node-gyp /npm-install/npm-cache
