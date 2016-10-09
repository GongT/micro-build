#!/bin/sh

#{DETECT_CURRENT}

case $@ in
start)
	s_start
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
