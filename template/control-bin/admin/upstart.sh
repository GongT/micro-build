#!/bin/sh

function s_enable {
	echo "enabling service @{SERVICE_NAME} by override file"
	if [ -e "/etc/init/@{SERVICE_NAME}.override" ]; then
		rm "/etc/init/@{SERVICE_NAME}.override"
	fi
}
function s_disable {
	echo "disabling service @{SERVICE_NAME} by override file"
	echo manual | tee "/etc/init/@{SERVICE_NAME}.override"
}
function s_start {
	local OUTPUT=/tmp/starting
	service "@{SERVICE_NAME}" start >"${OUTPUT}" 2>&1
	RET=$?
	if [ ${RET} -eq 1 ]; then
		if cat "${OUTPUT}" | grep -q "is already running" ; then
			RET=0
		fi
	fi
	cat "${OUTPUT}"
	return ${RET}
}
function sys_status_started {
	service $1 status -q
}
function sys_start {
	echo "service $1 start"
	service $1 start
}
function sys_restart {
	echo "service $1 restart"
	service $1 restart
}
function sys_exists {
	echo -e "\t/etc/init/${1}.conf"
	[ -e "/etc/init/${1}.conf" ]
}
function s_stop {
	service "@{SERVICE_NAME}" stop
}
function s_status {
	service "@{SERVICE_NAME}" status
}
function s_install {
	echo "installing service @{SERVICE_NAME} to /etc/init"
	echo "    file: /etc/init/@{SERVICE_NAME}.conf"
	cat "@{PWD}/upstart.conf" | tee "/etc/init/@{SERVICE_NAME}.conf" >/dev/null
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
