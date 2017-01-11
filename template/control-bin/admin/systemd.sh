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
function sys_status_started {
	systemctl is-active $1
}
function sys_start {
	echo "systemctl start $1"
	systemctl start $1
}
function sys_restart {
	echo "systemctl start $1"
	systemctl restart $1
}
function sys_exists {
	echo -e "\t/usr/lib/systemd/system/${1}.service"
	[ -e "/usr/lib/systemd/system/${1}.service" ]
}
function s_stop {
	systemctl stop "@{SERVICE_NAME}"
}
function s_status {
	systemctl status "@{SERVICE_NAME}"
}
function s_install {
	echo "installing service @{SERVICE_NAME} to systemd"
	echo "    file: /usr/lib/systemd/system/@{SERVICE_NAME}.service"
	cat "@{PWD}/systemd.service" | tee "/usr/lib/systemd/system/@{SERVICE_NAME}.service" >/dev/null
	systemctl daemon-reload
	s_enable
}
function s_uninstall {
	s_stop 2>/dev/null
	s_disable 2>/dev/null
	
	echo "uninstalling service @{SERVICE_NAME} from systemd"
	if [ -e "/usr/lib/systemd/system/@{SERVICE_NAME}.service" ]; then
		rm "/usr/lib/systemd/system/@{SERVICE_NAME}.service"
		systemctl daemon-reload
	fi
}
