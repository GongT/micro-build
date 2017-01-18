#!/bin/bash

set -e

export PROJECT_NAME="@{PROJECT_NAME}"
echo -en "\e]0;${PROJECT_NAME} - MICRO-BUILD: building ...\007"

cd "@{PWD}/.."

echo -e "start build \e[38;5;14m@{SERVICE_NAME}...\e[0m"

ARGUMENT_DELIMITER=", "
source "@{PWD}/arg-parse.sh"
RUN_ARGUMENTS=
BUILD_ARGUMENTS=
BUILD_DOCKER_ARGUMENTS=

#{JSON_ENV_HASH}

get_run_build_arguments "$@"

source "@{PWD}/functions.sh"
#{DETECT_CURRENT}
#{PULL_DEPEND_IMAGES}
#{BUILD_DEPEND_SERVICE}

echo -en "\e]0;${PROJECT_NAME} - MICRO-BUILD: building ...\007"

cat "@{PWD}/Dockerfile"| \
	sed "s/\${COMMAND_LINE_ARGS}/${RUN_ARGUMENTS}/g" > "@{PWD}/Dockerfile.args"

echo -e "-- RUN BUILD -
docker build \\
	${BUILD_DOCKER_ARGUMENTS} \\
	${BUILD_ARGUMENTS} \\
	-f=\"@{PWD}/Dockerfile.args\" \\
	-t=\"@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}\" \\
	."

docker build \
	${BUILD_DOCKER_ARGUMENTS} \
	${BUILD_ARGUMENTS} \
	-f="@{PWD}/Dockerfile.args" \
	-t="@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}" \
	.

echo -e "\e[38;5;14m@{SERVICE_NAME}\e[0m build complete..."

exit 0
