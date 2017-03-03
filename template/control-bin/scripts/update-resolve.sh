#!/bin/sh

if [ -z "${HOST_LOOP_IP}" ]; then
	if [ -n "${RUN_IN_DOCKER}" ]; then
		echo "something worng... no HOST_LOOP_IP set." >&2
		exit 1
	fi
	echo "update-resolve: direct run on host, ignore."
else
	echo "npm layer enabled, rewrite /etc/resolv.conf"
	
	if [ "yes" = "${USE_LOCAL_DNS}" ]; then
		echo "nameserver ${HOST_LOOP_IP}" >/etc/resolv.conf
	else
		cp /etc/resolv.conf /tmp/xxxxxresolve.conf
		head -n 1 /tmp/xxxxxresolve.conf >/etc/resolv.conf
		echo "nameserver ${HOST_LOOP_IP}" >>/etc/resolv.conf
		tail -n +2 /tmp/xxxxxresolve.conf >>/etc/resolv.conf
		unlink /tmp/xxxxxresolve.conf
	fi
fi

echo "${HOST_LOOP_IP} localhost-loop HOST_LOOP_IP" >> /etc/hosts

echo '--------------'
cat /etc/resolv.conf
echo '--------------'
