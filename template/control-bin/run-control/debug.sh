#!/usr/bin/env bash

set -e

cd "@{PWD}/.."

source "@{PWD}/arg-parse.sh"
source "@{PWD}/functions.sh"

#{DETECT_CURRENT}
#{START_DEPENDENCY}
#{BUILD_DEPEND_SERVICE}
#{DEPENDENCY_CHECK_EXTERNAL}

trap '[ -n "$(jobs -p)" ] && kill $(jobs -p)' EXIT
export CONFIG_FILE="@{PWD}/json-env-data.json"

SHELL="@{SHELL_COMMAND}"
COMMAND="@{DEBUG_COMMAND}"

#{DEBUG_PLUGIN_WATCHES}

jenv --hint &> /dev/null

#{ENVIRONMENT_VARS}

RUN_ARGUMENTS=
get_run_arguments "$@"

echo "[microbuild] run script:"
if [ "${WATCH}" == "no" ]; then
	echo "    ${SHELL} ${COMMAND} ${RUN_ARGUMENTS}" >&2
	echo " ::: start :::"
	eval ${SHELL} "${COMMAND}" ${RUN_ARGUMENTS}
else
	echo "    @{NODEMON_BIN} \\"
	echo "         -d 2 --config \"@{PWD}/nodemon.json\" -x \"${SHELL}\" -- ${COMMAND}" >&2
	echo " ::: start :::"
#{NODEMON_BIN} \
	 -d 2 --config "@{PWD}/nodemon.json" -x "${SHELL}" -- ${COMMAND} ${RUN_ARGUMENTS}
fi
