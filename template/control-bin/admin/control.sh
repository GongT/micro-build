#!/bin/sh

source ./detect-current.sh

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
disable)
	s_disable
   ;;
esac
