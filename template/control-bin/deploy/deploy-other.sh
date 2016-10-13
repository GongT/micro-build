#!/bin/bash

set -e
GIT_URL="${1}"
SAVE_PATH="${2}"
START="${3}"
DIR=$(basename "${GIT_URL}" .git)

function die {
		echo "$@" >&2
		exit 1
}

function download {
	mkdir -p /tmp/installing
	
	local TEMP=/tmp/installing/${DIR}
	
	if [ -e "${TEMP}" ]; then
		if ensure_dir_ok "${TEMP}"; then
			echo "no need to download."
			mv "${TEMP}" "${SAVE_PATH}"
			return
		else
			echo "remove cached files: ${TEMP}"
			rm -rf "${TEMP}"
		fi
	fi
	
	git clone "${GIT_URL}" "${TEMP}" || die "can't clone ${GIT_URL}"
	
	if [ -e "${TEMP}/.micro-build/config.ts" ]; then
		die "the source git-url is not a service: ${GIT_URL}"
	fi
	
	mv "${TEMP}" "${SAVE_PATH}"
}

function ensure_dir_ok {
	local TARGET=$1
	cd "${TARGET}" || die "bad file: ${TARGET}"
	if ! ( cat .git/config | grep -q "${GIT_URL}" 2>/dev/null ) ;then
		echo "can't install service to ${TARGET}. this path is already exists" >&2
		return 1
	fi
}

cd "${SAVE_PATH}"
echo "current dir: `pwd`"
if [ -e "${DIR}" ]; then
	echo "exists: ${DIR}"
	ensure_dir_ok "${SAVE_PATH}/${DIR}"
else
	echo "not exists: ${DIR}"
	download
fi


cd "${SAVE_PATH}/${DIR}"
echo -e "\e[38;5;14mstart 'microbuild build' at $(pwd) !\e[0m"
microbuild build
microbuild install
if [ -n "${START}" ]; then
	microbuild start | tee
fi

echo "deploy complete"
