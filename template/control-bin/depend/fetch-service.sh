if [ -z "@{IMAGE_NAME}" ]; then
	echo "Fatal: dependence container @{CONTAINER_NAME} can't start.
	image name not configured, you must start it manually." >&2
	exit 200
else
	echo "checking image @{IMAGE_NAME}...."
	
	if is_image_exists "@{IMAGE_NAME}" ; then
		echo " >>> dependence @{IMAGE_NAME} exists"
		echo ""
	else
		echo " >>> run docker pull @{IMAGE_NAME}"
		nohup docker pull "@{IMAGE_NAME}" >/dev/null &
		if [ "${MICRO_BUILD_RUN_MODE}" == 'docker' ]; then
			exit 101
		fi
		echo " >>> docker pull complete: @{IMAGE_NAME}"
		echo ""
		sleep 1
	fi
fi
