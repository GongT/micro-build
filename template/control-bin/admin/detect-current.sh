
if  readlink /proc/1/exe | grep -q systemd ; then
	source "@{PWD}/systemd.sh"
else
	source "@{PWD}/upstart.sh"
fi

if [ `id -u` -ne "0" ]; then
	echo "Error: you must have root access" > /dev/stderr
	exit
fi
