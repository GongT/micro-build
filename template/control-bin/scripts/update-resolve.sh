#!/bin/sh

if [ "yes" = "${NPM_LAYER_ENABLED}" ]; then
	if [ -z "${HOST_LOOP_IP}" ]; then
		die "something worng... no HOST_LOOP_IP set."
	fi
	echo "npm layer enabled, rewrite /etc/resolv.conf"
	echo "nameserver ${HOST_LOOP_IP}" > /etc/resolv.conf
fi
