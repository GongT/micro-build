#!/bin/sh

function s_enable {
	s_masked "@{SERVICE_NAME}" && return
	echo "enabling service @{SERVICE_NAME} thru systemctl"
	systemctl enable "@{SERVICE_NAME}"
}
function s_disable {
	s_masked "@{SERVICE_NAME}" && return
	echo "disabling service @{SERVICE_NAME} thru systemctl"
	systemctl disable "@{SERVICE_NAME}"
}
function s_start {
	s_masked "@{SERVICE_NAME}" && return
	systemctl reset-failed "@{SERVICE_NAME}"
	sys_action start "@{SERVICE_NAME}"
}
function sys_status_started {
	s_masked $1 && return
	systemctl is-active $1
}
function sys_action {
	local ACTION=$1
	local SERVICE=$2
	echo "systemctl ${ACTION} $SERVICE"
	local TMP_FILE="/tmp/detect-start-status.${RANDOM}"
	systemctl ${ACTION} ${SERVICE}
	RET=$?
	if [ ${RET} -eq 0 ]; then
		return 0
	fi
	if systemctl ${ACTION} ${SERVICE} 2>&1 | grep -q "service is masked" &>/dev/null ; then
		return 0
	fi
	return ${RET}
}
function s_masked {
	systemctl status $1 | grep -q 'masked (/dev/null'
}
function sys_start {
	s_masked "$1" && return
	systemctl reset-failed "$1"
	sys_action start "$1"
}
function sys_restart {
	s_masked "$1" && return
	systemctl reset-failed "$1"
	sys_action restart "$1"
}
function sys_exists {
	echo -e "\t/usr/lib/systemd/system/${1}.service"
	[ -e "/usr/lib/systemd/system/${1}.service" ]
}
function s_stop {
	s_masked "@{SERVICE_NAME}" && return
	systemctl stop "@{SERVICE_NAME}"
}
function s_status {
	s_masked "@{SERVICE_NAME}" && return
	systemctl status "@{SERVICE_NAME}" --no-pager -l -n 0
}
function s_status_started {
	s_masked "@{SERVICE_NAME}" && return
	systemctl is-active "@{SERVICE_NAME}"
}
function s_restart {
	s_masked "@{SERVICE_NAME}" && return
	systemctl reset-failed "@{SERVICE_NAME}"
	sys_action restart "@{SERVICE_NAME}"
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
