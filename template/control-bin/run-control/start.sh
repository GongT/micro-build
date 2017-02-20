#!/usr/bin/env bash

echo "starting........"

export CURRENT_ENV=docker
source "@{PWD}/functions.sh"

if [ -t 0 -a -t 1 ] ; then
	# this shell has a std-input
	t_arg='t'
fi

set +x
cat <<XXX
will run docker:
exec @{DOCKER_CLIENT_HINT} \\
	@{DOCKER_RUN_ARGUMENTS_HINT_STRING}
XXX

exec @{DOCKER_CLIENT} \
	@{DOCKER_RUN_ARGUMENTS}
