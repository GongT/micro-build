#!/bin/bash

set -e

cd "@{PWD}/.."

echo "build with config file @{JENV_FILE_NAME}"

jenv --hint

CONFIG_FILE_HASH=`md5sum "@{JENV_FILE_NAME}" | awk '{ print $1; }'`
echo "config file hash: ${CONFIG_FILE_HASH}"

source "@{PWD}/arg-parse.sh"
RUN_ARGUMENTS=
BUILD_ARGUMENTS=
BUILD_DOCKER_ARGUMENTS=
get_run_build_arguments "$@"

echo "start build..."

docker build \
	--build-arg=CONFIG_FILE_HASH="${CONFIG_FILE_HASH}" \
	--build-arg=COMMAND_LINE_ARGS="${RUN_ARGUMENTS}" \
	${BUILD_DOCKER_ARGUMENTS} \
	${BUILD_ARGUMENTS} \
	-f="@{PWD}/Dockerfile" \
	-t="@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}" \
	.

echo "build complete..."

exit 0
