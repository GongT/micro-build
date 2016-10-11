if is_container_exists "@{CONTAINER_NAME}" ; then
	echo " >>> dependence @{CONTAINER_NAME} exists"
else
	echo " >>> deploying dependence @{CONTAINER_NAME}"
	microbuild deploy "@{GIT_URL}" "@{SAVE_PATH}"
fi
