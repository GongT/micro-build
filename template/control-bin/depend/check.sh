echo "checking service @{CONTAINER_NAME}...."

if is_container_running "@{CONTAINER_NAME}" ; then
	echo " >>> dependence service @{CONTAINER_NAME} running"
else
	if ! sys_exists "@{CONTAINER_NAME}" ; then
		echo "Fatal: dependence service @{CONTAINER_NAME} not exists" >&2
		exit 201
	fi
	
	echo " >>> starting dependence service @{CONTAINER_NAME}"
	if sys_status_started "@{CONTAINER_NAME}" ; then
		echo "    this service already started!"
	else
		echo "    try start this service:"
		sys_start "@{CONTAINER_NAME}"
	fi
	
	sleep 2
	
	if ! is_container_running "@{CONTAINER_NAME}" ; then
		echo "Fatal: dependence service @{CONTAINER_NAME} can't start, container \"@{CONTAINER_NAME}\" not running." >&2
		exit 200
	fi
fi
