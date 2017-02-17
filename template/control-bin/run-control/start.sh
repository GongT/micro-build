#!/usr/bin/env bash

source "@{PWD}/functions.sh"

if is_container_exists "@{SERVICE_NAME}" ; then
	source "@{PWD}/stop.sh"
fi

FOREGROUND_DOCKER_PARAMS=()
BACKGROUND_DOCKER_PARAMS=()


#{DETECT_CURRENT}



#{NETWORKING_ENVIRONMENTS_VARS}

if [ -t 0 ] ; then
	# this shell has a std-input
	t_arg='-t'
fi
echo "commandline arguments: $@"

if [ -z "${START_DOCKER_IMAGE_NAME}" ]; then
	export START_DOCKER_IMAGE_NAME="@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}"
fi

echo ""
echo "docker run '@{SERVICE_NAME}' from '@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}'"
cat <<DOCKER_RUN_COMMAND
docker run \\
	@{DOCKER_ARGS} \\
	@{NETWORKING_ENVIRONMENTS_ARGS} \\
	${DOCKER_START_ARGS} \\
	-i ${t_arg} \\
	-e HAS_RUN=yes \\
	@{EXTERNAL_PORTS} \\
	@{RUN_MOUNT_VOLUMES} \\
	@{DEPEND_LINKS} \\
	--name "@{SERVICE_NAME}" \\
	${FOREGROUND_DOCKER_PARAMS[@]} \\
	${BACKGROUND_DOCKER_PARAMS[@]} \\
	"${START_DOCKER_IMAGE_NAME}" \\
	${FOREGROUND_RUN_ARGUMENT[@]} \\
	${BACKGROUND_RUN_ARGUMENT[@]} \\
	"$@"
DOCKER_RUN_COMMAND
