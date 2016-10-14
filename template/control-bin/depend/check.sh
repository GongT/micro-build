if is_container_running "@{CONTAINER_NAME}" ; then
	echo " >>> dependence service @{CONTAINER_NAME} running"
else
	if ! sys_exists "@{CONTAINER_NAME}" ; then
		echo "Fatal: dependence service @{CONTAINER_NAME} not exists" >&2
		exit 201
	fi
	
	echo " >>> starting dependence service @{CONTAINER_NAME}"
	sys_start "@{CONTAINER_NAME}"
	
	sleep 2
	
	if ! is_container_running "@{CONTAINER_NAME}" ; then
		echo "Fatal: dependence service @{CONTAINER_NAME} can't start" >&2
		exit 200
	fi
fi
