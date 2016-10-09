#!/usr/bin/env bash

set -e

cd "@{PWD}"
source "./arg-parse.sh"
cd ..

source "@{PWD}/functions.sh"
#{START_DEPENDENCY}
#{DEPENDENCY_CHECK_EXTERNAL}

trap '[ -n "$(jobs -p)" ] && kill $(jobs -p)' EXIT
export CONFIG_FILE="@{PWD}/json-env-data.json"

SHELL="@{SHELL}"
COMMAND="@{COMMAND}"

#{SCSS_PLUGIN}

jenv --hint &> /dev/null

echo "[microbuild] run script:"
echo "    @{NODEMON_BIN} \\"
echo "         -d 2 --config \"@{PWD}/nodemon.json\" -x \"${SHELL}\" -- ${COMMAND}" >&2
echo ""

RUN_ARGUMENTS=
get_run_arguments "$@"

#{NODEMON_BIN} \
 -d 2 --config "@{PWD}/nodemon.json" -x "${SHELL}" -- ${COMMAND} ${RUN_ARGUMENTS}

