#!/usr/bin/env bash

export CURRENT_ENV=docker
source "@{PWD}/functions.sh"

if [ -t 0 ] ; then
	# this shell has a std-input
	t_arg='t'
fi

set +x
cat <<XXX
exec ${SYSTEMD_DOCKER_RUNNER} run \\
	${DOCKER_START_ARGS} \\
	${NETWORKING_ENVIRONMENTS_ARGS} \\
	"-i${t_arg}" \\
	"--add-host=host-lo:$()" "-e HOST_LOOP_IP=${HOST_LOOP_IP}" \\
	"@{USE_LOCAL_DNS}" \\
	${EXTERNAL_PORTS} \\
	${RUN_MOUNT_VOLUMES} \\
	--name "${SERVICE_NAME}" \\
	${EXTRA_DOCKER_ARGUMENTS} \\
	"${START_DOCKER_IMAGE_NAME}"
XXX

exec ${SYSTEMD_DOCKER_RUNNER} run \
	${DOCKER_START_ARGS} \
	${NETWORKING_ENVIRONMENTS_ARGS} \
	"-i${t_arg}" \
	"--add-host=host-lo:$(require_loop_ip)" \
	@{USE_LOCAL_DNS} \
	${EXTERNAL_PORTS} \
	${RUN_MOUNT_VOLUMES} \
	--name "${SERVICE_NAME}" \
	"${START_DOCKER_IMAGE_NAME}"
