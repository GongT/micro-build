#!/bin/sh

function s_enable {
	echo "enabling service @{SERVICE_NAME} by override file"
	if [ -e "/etc/init/@{SERVICE_NAME}.override" ]; then
		rm "/etc/init/@{SERVICE_NAME}.override"
	fi
}
function s_disable {
	echo "disabling service @{SERVICE_NAME} by override file"
	echo manual > "/etc/init/@{SERVICE_NAME}.override"
}
function s_start {
	service "@{SERVICE_NAME}" start
}
function s_stop {
	service "@{SERVICE_NAME}" stop
}
function s_status {
	service "@{SERVICE_NAME}" status
}
function s_install {
	echo "installing service @{SERVICE_NAME} to /etc/init"
	cat "@{PWD}/upstart.conf" > "/etc/init/@{SERVICE_NAME}.conf"
}
function s_uninstall {
	s_enable 2>/dev/null
	s_stop 2>/dev/null
	
	echo "uninstalling service @{SERVICE_NAME} from /etc/init"
	if [ -e "/etc/init/@{SERVICE_NAME}.conf" ]; then
		rm "/etc/init/@{SERVICE_NAME}.conf"
	fi
	if [ -e "/etc/init/@{SERVICE_NAME}.override" ]; then
		rm "/etc/init/@{SERVICE_NAME}.override"
	fi
}
