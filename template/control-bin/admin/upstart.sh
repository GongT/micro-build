#!/bin/sh

function s_enable {
	if [ -e "/etc/init/@{SERVICE_NAME}.override" ]; then
		rm "/etc/init/@{SERVICE_NAME}.override"
	fi
}
function s_disable {
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
	cat "@{PWD}/upstart.conf" > "/etc/init/@{SERVICE_NAME}.conf"
}
function s_uninstall {
	enable && stop && rm "/etc/init/@{SERVICE_NAME}.conf"
}
