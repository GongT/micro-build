#!/bin/bash

if is_container_running "@{CONTAINER_NAME}" ; then
	return 0
fi

if ! is_container_exists "@{CONTAINER_NAME}" ; then
	echo "Fatal: dependence container @{CONTAINER_NAME} not exists" >&2
	return 201
fi

docker start "@{CONTAINER_NAME}"

sleep 2

if ! is_container_running "@{CONTAINER_NAME}" ; then
	echo "Fatal: dependence container @{CONTAINER_NAME} can't start" >&2
	return 200
fi
