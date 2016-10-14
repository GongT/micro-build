echo "checking container @{CONTAINER_NAME}...."

if is_container_running "@{CONTAINER_NAME}" ; then
	echo " >>> dependence @{CONTAINER_NAME} running"
elif is_container_exists "@{CONTAINER_NAME}" ; then
	echo " >>> starting dependence @{CONTAINER_NAME}"
	docker start "@{CONTAINER_NAME}"
else
	if ! is_image_exists "@{IMAGE_NAME}" ; then
		docker pull "@{IMAGE_NAME}"
		sleep 1
	fi
	
	echo " >>> running dependence @{CONTAINER_NAME}"
	docker run -d --name "@{CONTAINER_NAME}" @{COMMAND_LINE} "@{IMAGE_NAME}"
	
	sleep 2
	
	if ! is_container_running "@{CONTAINER_NAME}" ; then
		echo "Fatal: dependence container @{CONTAINER_NAME} can't start" >&2
		exit 200
	fi
fi
