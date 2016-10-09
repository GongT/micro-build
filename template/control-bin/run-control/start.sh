#!/usr/bin/env bash

cd "@{PWD}/.."

source "@{PWD}/functions.sh"
source "@{PWD}/stop.sh"

#{START_DEPENDENCY}
#{DEPENDENCY_CHECK_EXTERNAL}

echo ""
echo "docker run '@{SERVICE_NAME}' from '@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}'"
echo docker run \
	${DOCKER_START_ARGS} \
	-t \
	@{EXTERNAL_PORTS} \
	@{RUN_MOUNT_VOLUMES} \
	@{DEPEND_LINKS} \
	--name "@{SERVICE_NAME}" \
	"@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}"
docker run \
	${DOCKER_START_ARGS} \
	-t \
	@{EXTERNAL_PORTS} \
	@{RUN_MOUNT_VOLUMES} \
	@{DEPEND_LINKS} \
	--name "@{SERVICE_NAME}" \
	"@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}"
