#!/usr/bin/env bash

cd "@{PWD}/.."

source "@{PWD}/functions.sh"

if is_container_running "@{SERVICE_NAME}" ; then
	echo "try to stop (or kill) running service"
	docker stop --time=5 "@{SERVICE_NAME}"
fi

if is_container_exists "@{SERVICE_NAME}" ; then
	echo "try remove container"
	docker rm -f "@{SERVICE_NAME}"
fi
