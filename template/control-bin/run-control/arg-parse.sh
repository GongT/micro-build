#!/bin/bash

function get_run_build_arguments { # args...
	GOTTEN_BUILD_ARGUMENT=
	GOTTEN_RUN_ARGUMENT=
	
	while [ $# -gt 0 ]; do
		local ARG=$1
		shift
		case ${ARG} in
		@{RUN_ARGUMENTS_ONE_ITEM})
			push_run_argument ${ARG%%=*} ${ARG#*=}
		;;
		@{RUN_ARGUMENTS})
			ensure_is_value ${ARG} $1
			push_run_argument ${ARG} $1
			shift
		;;
		@{BUILD_ARGUMENTS_ONE_ITEM})
			push_build_argument ${ARG%%=*} ${ARG#*=}
		;;
		@{BUILD_ARGUMENTS})
			ensure_is_value ${ARG} $1
			push_build_argument ${ARG} $1
			shift
		;;
		-v=*)
			push_build_process_argument 'volume' ${ARG#*=}
		;;
		-v)
			push_build_process_argument 'volume' $1
			shift
		;;
		*)
			help_message "Unknown argument: ${ARG}"
		esac
	done
	
	test_all_finished_build @{BUILD_ARGUMENT_CHECK}
	test_all_finished_run @{RUN_ARGUMENT_CHECK}
}
function get_run_arguments { # args...
	GOTTEN_RUN_ARGUMENT=
	
	while [ $# -gt 0 ]; do
		local ARG=$1
		shift
		case ${ARG} in
		@{RUN_ARGUMENTS_ONE_ITEM})
			push_run_argument ${ARG%%=} ${ARG#=}
		;;
		@{RUN_ARGUMENTS})
			push_run_argument ${ARG} $1
			shift
		;;
		*)
			help_message "Unknown argument: ${ARG}"
		esac
	done
	
	test_all_finished_run @{RUN_ARGUMENT_CHECK}
}

function push_build_process_argument {
	local NAME=$1
	local VALUE=$2
	
	NAME=`echo ${NAME} | sed 's/^-*//g'`
	
	echo "build docker argument: ${NAME} -> ${VALUE}" >&2
	
	BUILD_DOCKER_ARGUMENTS="${BUILD_DOCKER_ARGUMENTS} --${NAME}=${VALUE}"
}

function push_build_argument { # name value
	local NAME=$1
	local VALUE=$2
	
	NAME=`echo ${NAME} | sed 's/^-*//g'`
	GOTTEN_BUILD_ARGUMENT="${GOTTEN_BUILD_ARGUMENT}:${NAME}"
	
	echo "build argument: ${NAME} -> ${VALUE}" >&2
	
	BUILD_ARGUMENTS="${BUILD_ARGUMENTS} --build-arg=${NAME}=${VALUE}"
}
function push_run_argument { # name value
	local NAME=$1
	local VALUE=$2
	
	NAME=`echo ${NAME} | sed 's/^-*//g'`
	GOTTEN_RUN_ARGUMENT="${GOTTEN_RUN_ARGUMENT}:${NAME}:"
	
	echo "run argument: ${NAME} -> ${VALUE}" >&2
	
	RUN_ARGUMENTS="${RUN_ARGUMENTS}${ARGUMENT_DELIMITER- }\"--${NAME}=${VALUE}\""
}

function test_all_finished_run {
	for i in "$@"
	do
		if has_default_value "${i}" ; then
			push_run_argument "${i}" `default_value "${i}"`
		else
			if ! echo "${GOTTEN_RUN_ARGUMENT}" | grep -q ":${i}:" ; then
				help_message "missing required run argument: ${i}";
			fi
		fi
	done
}
function test_all_finished_build {
	for i in "$@"
	do
		if has_default_value "${i}" ; then
			push_build_argument "${i}" `default_value "${i}"`
		else
			if ! echo "${GOTTEN_BUILD_ARGUMENT}:" | grep -q ":${i}:" ; then
				help_message -e "missing required build argument: ${i}\n   gotten: ${GOTTEN_BUILD_ARGUMENT}";
			fi
		fi
	done
}

function has_default_value {
	case "${1}" in
		@{OPTIONAL_ARGUMENTS})
			return 0
		;;
		*)
			return 1
		;;
	esac
}

function default_value {
	echo "missing argument: ${1}" >&2
	case "${1}" in
#{OPTIONAL_ARGUMENTS_VALUE_MAP}
		*)
			return 1
		;;
	esac
}
function ensure_is_value {
	local NAME=$1
	local VALUE=$2
	if [ -z "${VALUE}" -o "${VALUE:0:1}" == "-" ]; then
		help_message "invalid value of ${NAME}"
	fi
}
function help_message {
	cat << 'HELP_DATA' >&2
@{ARGUMENT_HELP_MESSAGE}
HELP_DATA
	echo "$@" >&2
	return 1
}
