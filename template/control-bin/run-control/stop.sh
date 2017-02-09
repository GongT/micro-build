#!/usr/bin/env bash

cd "@{PWD}/.."

source "@{PWD}/functions.sh"

STOP_COMMAND="@{STOP_COMMAND}"

if is_container_running "@{SERVICE_NAME}" ; then
	if [ "${STOP_COMMAND}" == "yes" ]; then
		echo "executing stop command"
		microbuild stop-command
		sleep 2
		if is_container_running "@{SERVICE_NAME}" ; then
			echo "stop command failed (container not stopped)"
			docker stop --time=2 "@{SERVICE_NAME}"
		fi
	else
		echo "try to stop (or kill) running service"
		docker stop --time=5 "@{SERVICE_NAME}"
	fi
else
	echo "stop: container @{SERVICE_NAME} already stopped"
fi

if is_container_exists "@{SERVICE_NAME}" ; then
	echo "try remove container"
	docker rm -f "@{SERVICE_NAME}"
else
	echo "stop: container @{SERVICE_NAME} already removed"
fi
