#!/usr/bin/env bash

cd "@{PWD}/.."

source "@{PWD}/functions.sh"

STOP_COMMAND="@{STOP_COMMAND}"

if is_container_running "@{SERVICE_NAME}" ; then
	echo "stop: try to stop running service"
	#{STOP_DOCKER_COMMAND}
else
	echo "stop: container @{SERVICE_NAME} already stopped"
fi

if is_container_exists "@{SERVICE_NAME}" ; then
	echo "stop: try kill and remove container"
	docker rm -f "@{SERVICE_NAME}"
else
	echo "stop: container @{SERVICE_NAME} removed"
fi
