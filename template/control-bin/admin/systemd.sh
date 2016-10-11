#!/bin/sh

function s_enable {
	echo "enabling service @{SERVICE_NAME} thru systemctl"
	systemctl enable "@{SERVICE_NAME}"
}
function s_disable {
	echo "disabling service @{SERVICE_NAME} thru systemctl"
	systemctl disable "@{SERVICE_NAME}"
}
function s_start {
	systemctl start "@{SERVICE_NAME}"
}
function sys_start {
	systemctl start $1
}
function s_stop {
	systemctl stop "@{SERVICE_NAME}"
}
function s_status {
	systemctl status "@{SERVICE_NAME}"
}
function s_install {
	echo "installing service @{SERVICE_NAME} to systemd"
	if [ -e /lib/systemd/system ]; then
		TARGET="/lib/systemd/system/@{SERVICE_NAME}.service"
	elif [ -e /usr/lib/systemd/system ]; then
		TARGET="/usr/lib/systemd/system/@{SERVICE_NAME}.service"
	else
		echo "no systemd config folder."
		exit 2
	fi
	cat "@{PWD}/systemd.service" > "${TARGET}"
	systemctl daemon-reload
	s_enable
}
function s_uninstall {
	s_stop 2>/dev/null
	s_disable 2>/dev/null
	
	echo "uninstalling service @{SERVICE_NAME} from systemd"
	if [ -e "/lib/systemd/system/@{SERVICE_NAME}.service" ]; then
		rm "/lib/systemd/system/@{SERVICE_NAME}.service"
	fi
	if [ -e "/usr/lib/systemd/system/@{SERVICE_NAME}.service" ]; then
		rm "/usr/lib/systemd/system/@{SERVICE_NAME}.service"
	fi
	systemctl daemon-reload
}
