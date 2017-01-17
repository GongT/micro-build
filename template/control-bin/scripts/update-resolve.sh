if [ -z "${HOST_LOOP_IP}" ]
then echo "something worng... no HOST_LOOP_IP set." >&2
	exit 1
fi
echo "npm layer enabled, rewrite /etc/resolv.conf"

cp /etc/resolv.conf /tmp/xxxxxresolve.conf
head -n 1 /tmp/xxxxxresolve.conf >/etc/resolv.conf
echo "nameserver ${HOST_LOOP_IP}" >>/etc/resolv.conf
tail -n +2 /tmp/xxxxxresolve.conf >>/etc/resolv.conf

cat /etc/resolv.conf
