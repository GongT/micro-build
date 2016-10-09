#!/bin/bash

if is_container_running "@{CONTAINER_NAME}" ; then
	return 0
fi

if ! is_image_exists "@{IMAGE_NAME}" ; then
	docker pull "@{IMAGE_NAME}"
fi

docker run -dit --name "@{CONTAINER_NAME}" @{COMMAND_LINE} "@{IMAGE_NAME}"

sleep 2

if ! is_container_running "@{CONTAINER_NAME}" ; then
	echo "Fatal: dependence container @{CONTAINER_NAME} can't start" >&2
	return 200
fi
