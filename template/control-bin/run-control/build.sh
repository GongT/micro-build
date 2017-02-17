#!/bin/bash

export CURRENT_ENV="@{CURRENT_ENV}"
source "@{PWD}/functions.sh"

set -e

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
docker build \\
	${BUILD_DOCKER_ARGUMENTS} \\
	$@ \\
	-f=\"@{PWD}/Dockerfile\" \\
	-t=\"@{DOCKER_IMAGE_TAG_NAME}\" \\
	."

docker build \
	${BUILD_DOCKER_ARGUMENTS} \
	"$@" \
	-f="${TEMP_ENV}/Dockerfile" \
	-t="@{DOCKER_IMAGE_TAG_NAME}" \
	.

echo -e "\e[38;5;14m@{SERVICE_NAME}\e[0m build complete..."

exit 0
