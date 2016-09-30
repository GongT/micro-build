#!/bin/sh

if  readlink /proc/1/exe | grep -q systemd ; then
	source ./systemd.sh
else
	source ./upstart.sh
fi
