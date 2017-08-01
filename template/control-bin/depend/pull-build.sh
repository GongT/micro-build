echo "checking service @{CONTAINER_NAME}...."

if sys_exists "@{CONTAINER_NAME}" ; then
	echo "tried sys_exists @{CONTAINER_NAME}..."
	echo " >>> dependence service @{CONTAINER_NAME} exists"
	# if sys_status_started "@{CONTAINER_NAME}" ; then
	# 	echo "    this service already started!"
	# else
	# 	echo "    try start this service:"
	# 	sys_start "@{CONTAINER_NAME}"
	# 	echo " >>> service @{CONTAINER_NAME} started"
	# 	echo ""
	# fi
elif [ "x@{GIT_URL}" = "x" ]; then
	echo " >>> required dependence service @{CONTAINER_NAME}, but not installed"
	echo ""
	exit 1
else
	if [ -t 0 ] && [ -t 1 ]; then
		echo ""
		echo -e "\e[38;5;14m !!! dependency service '@{CONTAINER_NAME}' not installed\e[0m"
		echo -e "\tSource: @{GIT_URL}"
		echo -e "\tTarget: @{SAVE_PATH}"
		echo "Auto install? Press Enter to continue. Ctrl^C to interrupt."
		read ""
	fi
	
	echo " >>> deploying dependence service @{CONTAINER_NAME}"
	microbuild deploy "@{GIT_URL}" "@{SAVE_PATH}"
	echo " >>> dependence service @{CONTAINER_NAME} deployed"
	# echo "    try start this service:"
	# sys_start "@{CONTAINER_NAME}"
	# echo " >>> service @{CONTAINER_NAME} started"
	# echo ""
fi
