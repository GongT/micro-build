#!/bin/bash

#{DETECT_CURRENT}
s_stop | tee

set -e
set -x

export START_DOCKER_IMAGE_NAME="@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}:fore-test"

"@{PWD}/foreground-test/build-foreground-test.sh"

"@{PWD}/foreground-test/start.sh"

docker rm "@{SERVICE_NAME}"
