echo "checking container @{CONTAINER_NAME}...."

if is_container_running "@{CONTAINER_NAME}" ; then
	echo " >>> dependence @{CONTAINER_NAME} running"
	echo ""
elif is_container_exists "@{CONTAINER_NAME}" ; then
	echo " >>> starting dependence @{CONTAINER_NAME}"
	docker start "@{CONTAINER_NAME}"
	echo " >>> container @{CONTAINER_NAME} started"
	echo ""
elif [ -z "@{IMAGE_NAME}" ]; then
		echo "Fatal: dependence container @{CONTAINER_NAME} can't start.
	don't know how to start it."
		exit 200
else
	if ! is_image_exists "@{IMAGE_NAME}" ; then
		echo " >>> run docker pull @{IMAGE_NAME}"
		docker pull "@{IMAGE_NAME}"
		if [ "${MICRO_BUILD_RUN_MODE}" == 'docker' ]; then
			exit 1
		fi
		sleep 1
		echo " >>> docker pull complete: @{IMAGE_NAME}"
		echo ""
	fi
	
	echo " >>> running dependence @{CONTAINER_NAME}"
	docker run -d --name "@{CONTAINER_NAME}" @{COMMAND_LINE} "@{IMAGE_NAME}"
	
	sleep 2
	
	if ! is_container_running "@{CONTAINER_NAME}" ; then
		echo "Fatal: dependence container @{CONTAINER_NAME} can't start"
		exit 1
	fi
	echo " >>> dependence @{CONTAINER_NAME} started"
	echo ""
fi
