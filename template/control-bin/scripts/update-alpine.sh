#!/bin/sh

VERSION=$(grep -oE '^\d\.\d' /etc/alpine-release)
if [ $? -ne 0 ]; then
	exit 1
fi

# http://dl-cdn.alpinelinux.org/alpine
# http://mirrors.aliyun.com/alpine

if [ "${IS_IN_CHINA}" = "yes" ] ; then
	echo "http://mirrors.aliyun.com/alpine/v${VERSION}/main" > /etc/apk/repositories
	echo "http://mirrors.aliyun.com/alpine/v${VERSION}/community" >> /etc/apk/repositories
else
	echo "update-alpine: not in china"
fi
