#!/bin/bash

cd "@{PWD}"

echo "build with config file @{JENV_FILE_NAME_REL}"

CONFIG_FILE_HASH=`md5sum "@{JENV_FILE_NAME}" | awk '{ print $1; }'`
echo "config file hash: ${CONFIG_FILE_HASH}"

docker build \
	--build-arg=CONFIG_FILE_HASH="${CONFIG_FILE_HASH}" \
	-f="@{PWD}/Dockerfile" \
	-t="@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}" \
	.
