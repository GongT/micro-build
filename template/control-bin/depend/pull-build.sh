echo "checking service @{CONTAINER_NAME}...."

if sys_exists "@{CONTAINER_NAME}" ; then
	echo "tried sys_exists @{CONTAINER_NAME}..."
	echo " >>> dependence service @{CONTAINER_NAME} exists"
	sys_start "@{CONTAINER_NAME}"
elif [ "x@{GIT_URL}" == "x" ]; then
	echo " >>> required dependence service @{CONTAINER_NAME}, but not installed"
	exit 1
else
	echo " >>> deploying dependence service @{CONTAINER_NAME}"
	microbuild deploy "@{GIT_URL}" "@{SAVE_PATH}"
fi
