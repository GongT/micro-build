if [ -z "${INITD_TYPE}" ]; then
	echo "Error: no INITD_TYPE." > /dev/stderr
	exit 1
fi
source "@{PWD}/service-control.sh"
