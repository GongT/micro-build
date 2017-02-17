#!/usr/bin/env bash

export CURRENT_ENV="@{CURRENT_ENV}"
source "@{PWD}/functions.sh"

set -e

if ! is_container_running "@{SERVICE_NAME}" ; then
	echo "container not running."
	exit 2
fi

if [ -t 1 ] ; then
	docker exec -it "@{SERVICE_NAME}" "$@"
else
	docker exec "@{SERVICE_NAME}" "$@"
fi
