#!/usr/bin/env bash

cleanup() {
    rv=$?
    echo "start.sh EXIT WITH ${rv}"
    trap - INT TERM EXIT
    exit ${rv}
}

trap "cleanup" INT TERM EXIT

cd "@{PWD}/.."

source "@{PWD}/functions.sh"

if is_container_running "@{SERVICE_NAME}" ; then
	echo "service is already started.

stop it with:
	docker rm -f @{SERVICE_NAME}
"
	exit 2
fi
if is_container_exists "@{SERVICE_NAME}" ; then
	source "@{PWD}/stop.sh"
fi

#{DETECT_CURRENT}
#{START_DEPENDENCY}
#{DEPENDENCY_CHECK_EXTERNAL}

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
	${FOREGROUND_DOCKER_PARAMS} \\
	${BACKGROUND_DOCKER_PARAMS} \\
	"${START_DOCKER_IMAGE_NAME}" \\
	${FOREGROUND_RUN_ARGUMENT} \\
	${BACKGROUND_RUN_ARGUMENT} \\
	"$@"
DOCKER_RUN_COMMAND

docker run \
	@{DOCKER_ARGS} \
	${DOCKER_START_ARGS} \
	@{NETWORKING_ENVIRONMENTS_ARGS} \
	-i ${t_arg} \
	-e HAS_RUN=yes \
	@{EXTERNAL_PORTS} \
	@{RUN_MOUNT_VOLUMES} \
	@{DEPEND_LINKS} \
	--name "@{SERVICE_NAME}" \
	${FOREGROUND_DOCKER_PARAMS} \
	${BACKGROUND_DOCKER_PARAMS} \
	"${START_DOCKER_IMAGE_NAME}" \
	${FOREGROUND_RUN_ARGUMENT} \
	${BACKGROUND_RUN_ARGUMENT} \
	"$@"
