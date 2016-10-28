if [ -z "@{IMAGE_NAME}" ]; then
	echo "Fatal: dependence container @{CONTAINER_NAME} can't start.
	image name not configured, you must start it manually." >&2
	exit 200
else
	echo "checking image @{IMAGE_NAME}...."
	
	if is_image_exists "@{IMAGE_NAME}" ; then
		echo " >>> dependence @{IMAGE_NAME} exists"
	else
		docker pull "@{IMAGE_NAME}"
	fi
fi
