#!/usr/bin/env bash

set -e

echo "run service in debug mode: ${CONFIG_FILE-no}"

source ./bin/control/set_env

source ./bin/stop


	echo ""
if docker inspect usercenter-memcached > /dev/null ; then
	echo "docker start usercenter-memcached"
	docker start "usercenter-memcached"
else
	echo "docker run usercenter-memcached"
	docker run \
		--name "usercenter-memcached" \
		"memcached:alpine"
		-m 64
fi


echo ""
echo "docker run '${ServiceName}' from '${BASE_DOMAIN_NAME}/${ServiceName}'"
docker run \
	$* \
	--rm \
	--restart=no \
	--link usercenter-memcached:usercenter-memcached \
	--name "${ServiceName}" \
	"${BASE_DOMAIN_NAME}/${ServiceName}"
