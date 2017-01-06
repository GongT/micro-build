#!/usr/bin/env bash

set -e

cd "@{PWD}/.."

source "@{PWD}/arg-parse.sh"
source "@{PWD}/functions.sh"

export PROJECT_NAME="@{PROJECT_NAME}"

#{DETECT_CURRENT}
#{START_DEPENDENCY}
#{BUILD_DEPEND_SERVICE}

export CONFIG_FILE="@{PWD}/json-env-data.json"

SHELL="@{SHELL_COMMAND}"
COMMAND="@{DEBUG_COMMAND}"

declare -a BACKGROUND_WORKERS
BACKGROUND_WORKERS_NAMES=
BACKGROUND_PID=""
function background_task { # name cmd...
	BACKGROUND_WORKERS_NAMES="${BACKGROUND_WORKERS_NAMES}$1,"
	shift
	BACKGROUND_WORKERS=("${BACKGROUND_WORKERS[@]}" "$*")
}
#{DEBUG_PLUGIN_WATCHES}
if [ -n "${BACKGROUND_WORKERS}" ]; then
	for i in "${BACKGROUND_WORKERS[@]}"; do
		echo ${i}
	done
	
	SELF_PID=$$
	
	echo "@{CONCURRENTLY_BIN}" \
		--names "${BACKGROUND_WORKERS_NAMES}" -p "name" \
		"${BACKGROUND_WORKERS[@]}"
	
	{
	export SHELL="/bin/sh"
	"@{CONCURRENTLY_BIN}" \
		--names "${BACKGROUND_WORKERS_NAMES}" -p "name" \
		"${BACKGROUND_WORKERS[@]}"
	echo "background process died..."
	kill -${SELF_PID}
	} &
	BACKGROUND_PID=$!
fi

function onQuit {
  trap - SIGINT;
	if [ -n "${BACKGROUND_PID}" ]; then
		if ps | grep -q " ${BACKGROUND_PID} " ; then
			wait ${BACKGROUND_PID} || true
		fi
	fi
	echo ""
	exit
}
trap "onQuit" SIGINT

jenv --hint &> /dev/null

#{ENVIRONMENT_VARS}

RUN_ARGUMENTS=
get_run_arguments "$@"

[ -n "${BACKGROUND_PID}" ] && sleep 3

echo "[microbuild] run script:"
if [ "${WATCH}" == "no" ]; then
	echo "    ${SHELL} ${COMMAND} ${RUN_ARGUMENTS}" >&2
	echo " ::: start :::"
	eval ${SHELL} "${COMMAND}" ${RUN_ARGUMENTS} || true
	RET=${PIPESTATUS[0]}
else
	echo "    @{NODEMON_BIN} \\"
	echo "         -d 2 --config \"@{PWD}/nodemon.json\" -x \"${SHELL}\" -- ${COMMAND}" >&2
	echo " ::: start :::"
#{NODEMON_BIN} \
		-d 2 --config "@{PWD}/nodemon.json" -x "${SHELL}" -- \
		${COMMAND} ${RUN_ARGUMENTS} || true
	RET=${PIPESTATUS[0]}
fi

if [ -n "$(jobs -p)" ]; then
	kill $(jobs -p) || true
fi

exit ${RET}
