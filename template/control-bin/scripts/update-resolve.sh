if [ -z "${HOST_LOOP_IP}" ]
then echo "something worng... no HOST_LOOP_IP set." >&2
	exit 1
fi
echo "npm layer enabled, rewrite /etc/resolv.conf"
echo "nameserver ${HOST_LOOP_IP}" > /etc/resolv.conf
echo "nameserver 8.8.8.8" >> /etc/resolv.conf
echo "nameserver 100.100.2.136" >> /etc/resolv.conf
