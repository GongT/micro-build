#!/usr/bin/env bash

#{DETECT_CURRENT}

source "@{PWD}/functions.sh"

case "${1}" in
start)
	if s_status_started ; then
		if is_container_running "@{SERVICE_NAME}" ; then
			echo -e "\e[38;5;10mservice is already started, and container is running.\e[0m"
			exit 0
		else
			s_stop
		fi
	fi
	if [ -t 0 ] ; then
		trap '[ -n "$(jobs -p)" ] && kill $(jobs -p) ; echo ""' EXIT
		
		journalctl  -o cat -fu "@{SERVICE_NAME}" &
		PID=$!
		
		s_start
		RET=$?
		if [ ${RET} -ne 0 ]; then
			s_status
			set +x
			echo -e "
\x1B[38;5;9mservice failed to start.\x1B[0m
" >&2
			exit ${RET}
		fi
		
		i=5
		while [ $((i--)) -gt 0 ]; do
			sleep 1
			echo -ne '\rwaitting....\e[K\r'
		done
		
		kill "${PID}"
		
		if ! s_status_started; then
			s_status
			echo -e "
\x1B[38;5;9mservice failed to start.\x1B[0m
" >&2
			exit ${RET}
		fi
		
		echo -e "
		
service started, but we can't know if there is any async fail.
  \x1B[38;5;14myou can view more log with\x1B[0m:
        journalctl -fu '@{SERVICE_NAME}'
  \x1B[38;5;14mcheck service status with\x1B[0m:
        systemctl status '@{SERVICE_NAME}'
"
	else
		s_start
	fi
	;;
stop)
	s_stop
	;;
status)
	s_status
	echo ""
	;;
restart)
	s_restart
	;;
enable)
	s_enable
	;;
disable)
	s_disable
	;;
install)
	s_install
	;;
uninstall)
	s_uninstall
	;;
*)
	echo "Unknown action: ${1}
  Usage:
   $0 <start|stop|restart|status>"
	exit 1
esac
