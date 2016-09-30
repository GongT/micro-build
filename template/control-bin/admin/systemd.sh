#!/bin/sh

function s_enable {
	systemctl enable "@{SERVICE_NAME}"
}
function s_disable {
	systemctl disable "@{SERVICE_NAME}"
}
function s_start {
	systemctl start "@{SERVICE_NAME}"
}
function s_stop {
	systemctl stop "@{SERVICE_NAME}"
}
function s_status {
	systemctl status "@{SERVICE_NAME}"
}
function s_install {
	if [ -e /lib/systemd/system ]; then
		TARGET="/lib/systemd/system/@{SERVICE_NAME}.service"
	elif [ -e /usr/lib/systemd/system ]; then
		TARGET="/usr/lib/systemd/system/@{SERVICE_NAME}.service"
	else
		echo "no systemd config folder." >&2
		exit 2
	fi
	cat "@{PWD}/systemd.service" > "${TARGET}"
}
function s_uninstall {
	disable && stop && {
		if [ -e "/lib/systemd/system/@{SERVICE_NAME}.service" ]; then
			rm "/lib/systemd/system/@{SERVICE_NAME}.service"
		elif [ -e "/usr/lib/systemd/system/@{SERVICE_NAME}.service" ]; then
			rm "/usr/lib/systemd/system/@{SERVICE_NAME}.service"
		fi
	}
}
