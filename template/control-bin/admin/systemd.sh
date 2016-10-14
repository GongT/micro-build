#!/bin/sh

function s_enable {
	echo "enabling service @{SERVICE_NAME} thru systemctl"
	sudo systemctl enable "@{SERVICE_NAME}"
}
function s_disable {
	echo "disabling service @{SERVICE_NAME} thru systemctl"
	sudo systemctl disable "@{SERVICE_NAME}"
}
function s_start {
	sudo systemctl start "@{SERVICE_NAME}"
}
function sys_start {
	echo "sudo systemctl start $1"
	sudo systemctl start $1
}
function sys_exists {
	echo "/usr/lib/systemd/system/${1}.service" >&2
	[ -e "/usr/lib/systemd/system/${1}.service" ]
}
function s_stop {
	sudo systemctl stop "@{SERVICE_NAME}"
}
function s_status {
	systemctl status "@{SERVICE_NAME}"
}
function s_install {
	echo "installing service @{SERVICE_NAME} to systemd"
	cat "@{PWD}/systemd.service" | sudo tee "/usr/lib/systemd/system/@{SERVICE_NAME}.service" >/dev/null
	systemctl daemon-reload
	s_enable
}
function s_uninstall {
	s_stop 2>/dev/null
	s_disable 2>/dev/null
	
	echo "uninstalling service @{SERVICE_NAME} from systemd"
	if [ -e "/usr/lib/systemd/system/@{SERVICE_NAME}.service" ]; then
		sudo rm "/usr/lib/systemd/system/@{SERVICE_NAME}.service"
		systemctl daemon-reload
	fi
}
