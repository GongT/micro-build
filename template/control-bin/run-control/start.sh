#!/usr/bin/env bash

export CURRENT_ENV=docker
source "@{PWD}/functions.sh"

if [ -t 0 ] ; then
	# this shell has a std-input
	t_arg='t'
fi

set +x
cat <<XXX
exec ${DOCKER_CLIENT} \\
	${DOCKER_RUN_ARGUMENTS}"
XXX

exec ${DOCKER_CLIENT} \
	${DOCKER_RUN_ARGUMENTS}"
