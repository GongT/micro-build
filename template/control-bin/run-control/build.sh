#!/bin/bash

set -e

set -o allexport
source "@{PWD}/EnvironmentFile.docker.sh"
set +o allexport

echo -en "\e]0;${PREPEND_TITLE_STRING}${PROJECT_NAME} - MICRO-BUILD: building ...\007"

cd "@{PWD}/.."

echo -e "start build \e[38;5;14m@{SERVICE_NAME}...\e[0m"

# todo arguments
BUILD_DOCKER_ARGUMENTS=

#{JSON_ENV_HASH}

source "@{PWD}/functions.sh"
#{DETECT_CURRENT}
#{PULL_DEPEND_IMAGES}
#{BUILD_DEPEND_SERVICE}

echo -en "\e]0;${PREPEND_TITLE_STRING}${PROJECT_NAME} - MICRO-BUILD: building ...\007"
export PREPEND_TITLE_STRING+="${PROJECT_NAME} -> "

echo -e "-- RUN BUILD -
docker build \\
	${BUILD_DOCKER_ARGUMENTS} \\
	$@ \\
	-f=\"@{PWD}/Dockerfile\" \\
	-t=\"@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}\" \\
	."

docker build \
	${BUILD_DOCKER_ARGUMENTS} \
	"$@" \
	-f="@{PWD}/Dockerfile" \
	-t="@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}" \
	.

echo -e "\e[38;5;14m@{SERVICE_NAME}\e[0m build complete..."

exit 0
