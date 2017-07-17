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
	systemctl reset-failed "@{SERVICE_NAME}"
	systemctl start "@{SERVICE_NAME}"
}
function sys_status_started {
	systemctl is-active $1
}
function sys_start {
	systemctl reset-failed "$1"
	echo "systemctl start $1"
	systemctl start $1
}
function sys_restart {
	systemctl reset-failed "$1"
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
	systemctl status "@{SERVICE_NAME}" --no-pager -l -n 0
}
function s_status_started {
	systemctl is-active "@{SERVICE_NAME}"
}
function s_restart {
	systemctl reset-failed "@{SERVICE_NAME}"
	systemctl restart "@{SERVICE_NAME}"
}
function s_install {
	set -e
	echo "installing service @{SERVICE_NAME} to systemd"
	echo "    file: /usr/lib/systemd/system/@{SERVICE_NAME}.service"
	echo "   ================"
	cat "@{PWD}/system-service.service" | tee "/usr/lib/systemd/system/@{SERVICE_NAME}.service"
	echo "   ================"
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
