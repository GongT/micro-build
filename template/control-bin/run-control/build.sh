#!/bin/bash

export CURRENT_ENV="@{CURRENT_ENV}"
source "@{PWD}/functions.sh"

set -e

export PROJECT_NAME="@{PROJECT_NAME}"
echo -en "\e]0;${PREPEND_TITLE_STRING}${PROJECT_NAME} - MICRO-BUILD: building ...\007"
export PREPEND_TITLE_STRING+="${PROJECT_NAME} -> "

echo -e "start build \e[38;5;14m@{DOCKER_IMAGE_TAG_NAME}...\e[0m"

# todo arguments
BUILD_DOCKER_ARGUMENTS=()
#{JSON_ENV_HASH}

#{PULL_DEPEND_IMAGES}
#{BUILD_DEPEND_SERVICE}


echo -e "-- RUN BUILD -
WD=$(pwd)
\e[38;5;14mdocker build \\
	${BUILD_DOCKER_ARGUMENTS} \\
	$@ \\
	--build-arg HOST_LOOP_IP=${HOST_LOOP_IP} \\
	-f=\"@{PWD}/Dockerfile\" \\
	-t=\"@{DOCKER_IMAGE_TAG_NAME}\" \\
	.
\e[0m"

sleep 2

docker build \
	${BUILD_DOCKER_ARGUMENTS} \
	"$@" \
	--build-arg "HOST_LOOP_IP=${HOST_LOOP_IP}" \
	-f="${TEMP_ENV}/Dockerfile" \
	-t="@{DOCKER_IMAGE_TAG_NAME}" \
	.
	
# wait docker update: --squash

echo -e "\e[38;5;14m@{SERVICE_NAME}\e[0m build complete..."

exit 0
