#!/bin/sh

#{DETECT_CURRENT}

case $@ in
start)
	if [ -t 1 ] ; then
		trap '[ -n "$(jobs -p)" ] && kill $(jobs -p)' EXIT
		
		journalctl -u "@{SERVICE_NAME}" -f &
		PID=$!
		
		s_start
		sleep 5
		
		kill ${PID}
		
		echo "view log with \`journalctl -u '@{SERVICE_NAME}' -f\`"
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
