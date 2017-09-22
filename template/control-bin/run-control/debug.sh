#!/usr/bin/env bash

export CURRENT_ENV="@{CURRENT_ENV}"
source "@{PWD}/functions.sh"

#{START_DEPENDENCY}
#{BUILD_DEPEND_SERVICE}

function list_all {
	local CHILDREN=($(pgrep -P "$1"))
	if [ -z "$CHILDREN" ]; then
		return
	fi
	local i
	for i in "${CHILDREN[@]}"; do
		list_all "$i"
		echo "$i"
	done
}
function kill_all {
	echo "killing job commands: $$"
	local LIST=($(list_all $$))
	if [ -z "${LIST}" ]; then
		echo "    no children"
		return
	fi
	echo "    children: ${LIST[@]}"
	kill -s 2 "${LIST[@]}" 2>&1 | grep -v 'No such process'
	echo "  waitting..."
	echo -en "\e]0;MICRO-BUILD: quitting ... (press Ctrl-C if no response) \007"
	wait -- ${LIST[ $(( ${#LIST}-1 )) ]} 2>/dev/null
	echo "  killed."
}

export -f list_all kill_all

export CONFIG_FILE="@{PWD}/json-env-data.json"

SHELL=(@{SHELL_COMMAND})
COMMAND=(@{DEBUG_COMMAND})

echo -e "\e[38;5;14m[micro-build]\e[0m debug: SHELL=${SHELL}"
echo -e "\e[38;5;14m[micro-build]\e[0m debug: COMMAND=${COMMAND}"

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
		echo -e 'background run :\n' -- "@{CONCURRENTLY_BIN}" \
			--names "${BACKGROUND_WORKERS_NAMES}" -p "name" \
			"${BACKGROUND_WORKERS[@]}" \</dev/null
		"@{CONCURRENTLY_BIN}" \
			--names "${BACKGROUND_WORKERS_NAMES}" -p "name" \
			"${BACKGROUND_WORKERS[@]}" </dev/null
		echo -e "\e[38;5;9m    background process quited...\e[0m"
	} &
	BACKGROUND_PID=$!
fi

echo -e "\e[38;5;14m[micro-build]\e[0m debug: SELF_PID=${SELF_PID}"

trap '
if [ "${RET}" = "" ]; then
	RET=1
fi
echo -e "\n\e[38;5;14m[micro-build]\e[0m exit..."
trap - SIGTERM EXIT
kill_all $$
echo -e "\e[38;5;14m[micro-build]\e[0m finished."
echo -e "\e[38;5;14m[micro-build]\e[0m exit code ${RET}.\n"
exit ${RET}
' SIGINT SIGTERM EXIT

jenv --hint &> /dev/null

# todo arguments ?
DEBUG_RUN_ARGUMENTS=

#{DEBUG_LISTEN_PORT}
#{ENVIRONMENT_VARS}

# [ -n "${BACKGROUND_PID}" ] && sleep $(( ${#BACKGROUND_WORKERS[@]} * 2 ))

if [ -n "${BACKGROUND_PID}" ]; then
	WAIT_COMPILE='-C'
fi

echo -e "\e[38;5;14m[micro-build]\e[0m run script:"
echo "PWD=$(pwd)"
if [ "${WATCH}" = "no" ]; then
	echo "${SHELL} ${COMMAND} ${@}"
	echo " ::: start :::"
	"${SHELL[@]}" "${COMMAND[@]}" "${@}"
	RET=$?
else
	echo "@{NODEMON_BIN} \\
		${WAIT_COMPILE} -d 2 --config \"${TEMP_ENV}/nodemon.json\" -x \"${SHELL}\" -- \\
		${COMMAND}"
"@{NODEMON_BIN}" \
		${WAIT_COMPILE} -d 2 --config "${TEMP_ENV}/nodemon.json" -x "${SHELL[@]}" -- \
		"${COMMAND[@]}" "${DEBUG_RUN_ARGUMENTS[@]}" "${@}"
	RET=$?
	echo "nodemon return with ${RET}">&2
fi

kill_all $$

echo -e "\e[38;5;14m[micro-build]\e[0m finished."
echo -e "\e[38;5;14m[micro-build]\e[0m exit code ${RET}.\n"

echo -en "\e]0;\007"

exit ${RET}
