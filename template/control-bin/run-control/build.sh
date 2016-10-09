#!/bin/bash

set -e

cd "@{PWD}/.."

ARGUMENT_DELIMITER=", "
source "@{PWD}/arg-parse.sh"
RUN_ARGUMENTS=
BUILD_ARGUMENTS=
BUILD_DOCKER_ARGUMENTS=

#{JSON_ENV_HASH}

get_run_build_arguments "$@"

source "@{PWD}/functions.sh"
#{BUILD_DEPEND_SERVICE}
#{PULL_DEPEND_IMAGES}

echo "start build..."

cat "@{PWD}/Dockerfile"| \
	sed "s/\${COMMAND_LINE_ARGS}/${RUN_ARGUMENTS}/g" > "@{PWD}/Dockerfile.args"

docker build \
	${BUILD_DOCKER_ARGUMENTS} \
	${BUILD_ARGUMENTS} \
	-f="@{PWD}/Dockerfile.args" \
	-t="@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}" \
	.

echo "build complete..."

exit 0
