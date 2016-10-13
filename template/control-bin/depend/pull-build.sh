if is_image_exists "@{CONTAINER_NAME}" ; then
	echo " >>> dependence image @{CONTAINER_NAME} exists"
elif [ "x@{GIT_URL}" == "x" ]; then
	echo " >>> required dependence @{CONTAINER_NAME}, but not installed"
	exit 1
else
	echo " >>> deploying dependence @{CONTAINER_NAME}"
	microbuild deploy "@{GIT_URL}" "@{SAVE_PATH}"
fi
