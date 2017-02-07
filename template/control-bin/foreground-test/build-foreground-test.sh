#!/bin/bash

set -e

export PROJECT_NAME="@{PROJECT_NAME}"
echo -en "\e]0;${PROJECT_NAME} - MICRO-BUILD: building foreground test ...\007"

cd "@{PWD}/.."

echo -e "start build \e[38;5;14m@{SERVICE_NAME}... (foreground test)\e[0m"

# todo arguments
BUILD_DOCKER_ARGUMENTS=

#{JSON_ENV_HASH}

source "@{PWD}/functions.sh"
#{DETECT_CURRENT}
#{PULL_DEPEND_IMAGES}
#{BUILD_DEPEND_SERVICE}

echo -en "\e]0;${PROJECT_NAME} - MICRO-BUILD: building foreground test image...\007"

echo -e "-- RUN BUILD -
docker build \\
	${BUILD_DOCKER_ARGUMENTS} \\
	$@ \\
	-f=\"@{PWD}/foreground-test/Dockerfile\" \\
	-t=\"${START_DOCKER_IMAGE_NAME}\" \\
	\"@{PWD}/foreground-test\""

docker build \
	${BUILD_DOCKER_ARGUMENTS} \
	"$@" \
	-f="@{PWD}/foreground-test/Dockerfile" \
	-t="${START_DOCKER_IMAGE_NAME}" \
	"@{PWD}/foreground-test"

echo -e "\e[38;5;14m@{SERVICE_NAME}\e[0m build complete..."

exit 0
