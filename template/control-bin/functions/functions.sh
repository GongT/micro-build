#!/usr/bin/env bash

cleanup() {
    rv=$?
    echo "$0 EXIT WITH ${rv}"
    trap - INT TERM EXIT
    exit ${rv}
}

trap "cleanup" INT TERM EXIT

die () {
	echo -e "\e[38;5;9m""$@""\e[0m" >&2
	exit 100
}

if [ -z "${CURRENT_ENV}" ]; then
	die "environment CURRENT_ENV not set, re-run with microbuild."
fi

cd $(dirname "${BASH_SOURCE[0]}") || die "can't detect current directory."
export TEMP_ROOT="$(pwd)"
export PROJECT_PATH="$(dirname "${TEMP_ROOT}")";
export TEMP_DIR_NAME="${CURRENT_ENV}"
export TEMP_ENV="${TEMP_ROOT}/${CURRENT_ENV}"

cd "${PROJECT_PATH}" || die "can't change dir to project path."

function is_image_exists {
	docker inspect --type image $1 &>/dev/null
}
function is_container_exists {
	docker inspect --type container $1 &>/dev/null
}
function is_container_running {
	docker inspect --type container $1 2>/dev/null | grep -q '"Status": "running"'
}
function is_image_has_hash { # image_name hash_string
	docker inspect --type image $1 2>/dev/null | grep -q "$2"
}
function remove_container {
	if is_container_exists "$@" ; then
		docker rm -f "$@" >/dev/null
	fi
}

function require_loop_ip() {
	IP="@{DEFINED_IP_ADDRESS}"
	if [ -n "${IP}" ]; then
		echo $IP
		return 0
	fi
	echo "detecting server ip." >&2
	IP=$(ifconfig "@{DEFINED_INTERFACE}" | grep 'inet ' | head -1 | awk '{ print $2 }' | grep -oE '[0-9.]+' )
	echo "    IP=${IP}" >&2
	if [ -z "${IP}" ]; then
		echo "Fatal Error: can't detect host ip address." >&2
		exit 101
	fi
	echo ${IP}
}

export HOST_LOOP_IP=$(require_loop_ip)

source "${TEMP_ROOT}/control-script.sh"
