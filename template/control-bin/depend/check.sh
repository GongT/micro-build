echo "checking service @{CONTAINER_NAME}...."

if is_container_running "@{CONTAINER_NAME}" ; then
	echo " >>> depending service @{CONTAINER_NAME} running"
	echo ""
else
	if ! sys_exists "@{CONTAINER_NAME}" ; then
		echo "Fatal: dependence service @{CONTAINER_NAME} not exists"
		exit 201
	fi
	
	echo " >>> starting dependence service @{CONTAINER_NAME}"
	if sys_status_started "@{CONTAINER_NAME}" ; then
		echo "    this service already started!"
	else
		echo "    try start this service:"
		sys_start "@{CONTAINER_NAME}"
	fi
	
	echo 'wait 2s...'
	sleep 2

	if ! is_container_running "@{CONTAINER_NAME}" ; then
		echo "!!! BUT CONTAINER NOT RUNNNING !!!"
		
		sys_restart "@{CONTAINER_NAME}"
		
		echo "wait 5s..."
		sleep 5
		
		if ! is_container_running "@{CONTAINER_NAME}" ; then
			echo "Fatal: dependence service @{CONTAINER_NAME} can't start, container \"@{CONTAINER_NAME}\" not running."
			exit 200
		fi
	fi
	echo " >>> depending service @{CONTAINER_NAME} start complete."
	echo ""
fi
