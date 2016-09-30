#!/usr/bin/env bash

cd "@{PWD}/.."

trap '[ -n "$(jobs -p)" ] && kill $(jobs -p)' EXIT
export CONFIG_FILE="@{PWD}/json-env-data.json"

SHELL="@{SHELL}"
COMMAND="@{COMMAND}"

#{SCSS_PLUGIN}

jenv --show &> /dev/null

#{NODEMON_BIN} \
 -d 2 --config "@{PWD}/nodemon.json" -x "${SHELL}" -- ${COMMAND}

