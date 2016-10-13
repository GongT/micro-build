if is_container_running "@{CONTAINER_NAME}" ; then
	echo " >>> dependence @{CONTAINER_NAME} running"
else
	if ! is_container_exists "@{CONTAINER_NAME}" ; then
		echo "Fatal: dependence container @{CONTAINER_NAME} not exists" >&2
		exit 201
	fi
	
	echo " >>> starting dependence @{CONTAINER_NAME}"
	sys_start "@{CONTAINER_NAME}"
	
	sleep 2
	
	if ! is_container_running "@{CONTAINER_NAME}" ; then
		echo "Fatal: dependence container @{CONTAINER_NAME} can't start" >&2
		exit 200
	fi
fi
