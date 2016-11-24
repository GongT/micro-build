#!/usr/bin/env bash

#{DETECT_CURRENT}

case $@ in
start)
	if [ -t 1 ] ; then
		trap 'sleep 1 && [ -n "$(jobs -p)" ] && kill $(jobs -p)' EXIT
		
		( journalctl -fu "@{SERVICE_NAME}" 2> /dev/null & echo $! > /tmp/microbuild_start_pid )
		PID=$(</tmp/microbuild_start_pid)
		unlink /tmp/microbuild_start_pid
		
		s_start
		sleep 5
		
		kill "${PID}"
		
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
	;;
restart)
	s_stop
	s_start
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
disable)
	s_disable
	;;
*)
	echo "Unknown action: ${1}
  Usage:
   $0 <start|stop|restart|status>" >&2
	exit 1
esac
