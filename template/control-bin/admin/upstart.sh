#!/bin/sh

function s_enable {
	echo "enabling service @{SERVICE_NAME} by override file"
	if [ -e "/etc/init/@{SERVICE_NAME}.override" ]; then
		sudo rm "/etc/init/@{SERVICE_NAME}.override"
	fi
}
function s_disable {
	echo "disabling service @{SERVICE_NAME} by override file"
	echo manual | sudo tee "/etc/init/@{SERVICE_NAME}.override"
}
function s_start {
	sudo service "@{SERVICE_NAME}" start
}
function sys_status_started {
	service $1 status -q
}
function sys_start {
	echo "sudo service $1 start"
	sudo service $1 start
}
function sys_exists {
	echo "/etc/init/${1}.conf" >&2
	[ -e "/etc/init/${1}.conf" ]
}
function s_stop {
	sudo service "@{SERVICE_NAME}" stop
}
function s_status {
	service "@{SERVICE_NAME}" status
}
function s_install {
	echo "installing service @{SERVICE_NAME} to /etc/init"
	cat "@{PWD}/upstart.conf" | sudo tee "/etc/init/@{SERVICE_NAME}.conf" >/dev/null
}
function s_uninstall {
	s_enable 2>/dev/null
	s_stop 2>/dev/null
	
	echo "uninstalling service @{SERVICE_NAME} from /etc/init"
	if [ -e "/etc/init/@{SERVICE_NAME}.conf" ]; then
		sudo rm "/etc/init/@{SERVICE_NAME}.conf"
	fi
	if [ -e "/etc/init/@{SERVICE_NAME}.override" ]; then
		sudo rm "/etc/init/@{SERVICE_NAME}.override"
	fi
}
