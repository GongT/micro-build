echo "checking image @{IMAGE_NAME}...."

if is_image_exists "@{IMAGE_NAME}" ; then
	echo " >>> dependence @{IMAGE_NAME} exists"
else
	docker pull "@{IMAGE_NAME}"
fi
