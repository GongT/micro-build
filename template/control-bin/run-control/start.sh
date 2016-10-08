#!/usr/bin/env bash

cd "@{PWD}/.."

source "@{PWD}/stop.sh"

#{START_DEPENDENCY}

echo ""
echo "docker run '@{SERVICE_NAME}' from '@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}'"
docker run \
	--rm \
	--restart=no \
	@{DEPEND_LINKS} \
	--name "@{SERVICE_NAME}" \
	"@{BASE_DOMAIN_NAME}/@{SERVICE_NAME}"
