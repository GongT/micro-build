#!/usr/bin/env bash

cd "@{PWD}/.."

source "@{PWD}/functions.sh"

if is_container_running "@{SERVICE_NAME}" ; then
	echo "service is already started"
	exit 2
fi
if is_container_exists "@{SERVICE_NAME}" ; then
	source "@{PWD}/stop.sh"
fi

#{START_DEPENDENCY}
#{DEPENDENCY_CHECK_EXTERNAL}

echo ""
echo "docker run '@{SERVICE_NAME}' from '@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}'"
echo docker run \
	@{DOCKER_ARGS} \
	${DOCKER_START_ARGS} \
	-t \
	@{EXTERNAL_PORTS} \
	@{RUN_MOUNT_VOLUMES} \
	@{DEPEND_LINKS} \
	--name "@{SERVICE_NAME}" \
	"@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}"
docker run \
	@{DOCKER_ARGS} \
	${DOCKER_START_ARGS} \
	-t \
	@{EXTERNAL_PORTS} \
	@{RUN_MOUNT_VOLUMES} \
	@{DEPEND_LINKS} \
	--name "@{SERVICE_NAME}" \
	"@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}"
