#!/usr/bin/env bash

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

echo -e "\e[38;5;14m[micro-build]\e[0m debug: SHELL=${SHELL}"
echo -e "\e[38;5;14m[micro-build]\e[0m debug: SHELL=${COMMAND}"

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
		echo -e "\e[38;5;14m[micro-build]\e[0m background worker: ${i}"
	done
	
	SELF_PID=$$
	
	echo -e "\e[38;5;14m[micro-build]\e[0m concurrently:
@{CONCURRENTLY_BIN} \\
	--names "${BACKGROUND_WORKERS_NAMES}" -p "name" \\
	${BACKGROUND_WORKERS[@]}
	"
	
	{
	export SHELL="/bin/sh"
	"@{CONCURRENTLY_BIN}" \
		--names "${BACKGROUND_WORKERS_NAMES}" -p "name" \
		"${BACKGROUND_WORKERS[@]}" </dev/null
		echo -e "\e[38;5;9m    background process quited...\e[0m"
	} &
	BACKGROUND_PID=$!
fi

echo -e "\e[38;5;14m[micro-build]\e[0m debug: SELF_PID=${SELF_PID}"

trap 'RET=$?
echo -e "\n\e[38;5;14m[micro-build]\e[0m exit..."
trap - SIGTERM EXIT
JOBS=$(jobs -p)
if [ -n "${JOBS}" ]; then
	echo "killing job commands:"
	kill -2 -- ${JOBS} 2>/dev/null
	echo "  waitting..."
	wait -- ${JOBS} 2>/dev/null
	echo "  killed."
fi
echo -e "\e[38;5;14m[micro-build]\e[0m finished.\n"
exit ${RET}
' SIGINT SIGTERM EXIT

jenv --hint &> /dev/null

#{ENVIRONMENT_VARS}

RUN_ARGUMENTS=
get_run_arguments "$@"

[ -n "${BACKGROUND_PID}" ] && sleep 3

echo "[microbuild] run script:"
if [ "${WATCH}" == "no" ]; then
	echo "    ${SHELL} ${COMMAND} ${RUN_ARGUMENTS}"
	echo " ::: start :::"
	eval ${SHELL} "${COMMAND}" ${RUN_ARGUMENTS}
	RET=$?
else
	echo "    @{NODEMON_BIN} \\"
	echo "         -d 2 --config \"@{PWD}/nodemon.json\" -x \"${SHELL}\" -- ${COMMAND}"
	echo " ::: start :::"
#{NODEMON_BIN} \
		-d 2 --config "@{PWD}/nodemon.json" -x "${SHELL}" -- \
		${COMMAND} ${RUN_ARGUMENTS}
	RET=$?
fi

sleep .5
echo -e "\e[38;5;14m[micro-build]\e[0m finished.\n"
