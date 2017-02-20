#!/usr/bin/env bash

set -e

function die {
	echo "$@" >&2
	exit 1
}

oIFS="$IFS"
IFS=: PATH_ARR=( $GOPATH )
IFS="$oIFS"

for i in "${PATH_ARR[@]}"; do
	PATH+=":$i/bin"
done

if ! command -v systemd-docker 2>&1 >/dev/null ; then
	echo -e "\e[38;5;9m" >&2
	echo "command \`systemd-docker\` not found in path
you can install with:
	git clone https://github.com/ibuildthecloud/systemd-docker.git
	cd systemd-docker
	./build
you may set proxy with:
	HTTP_PROXY=http://x.x.x.x:7070 go get xxxxx
" >&2
	
	if ! command -v go 2>&1 >/dev/null ; then
		echo
		echo "* the \`go\` (go lang) command not found in PATH, you must install." >&2
		echo
	fi
	
	if ! go version | grep -q 'go version' 2>/dev/null ; then
		echo "* the \`go\` command not a valid golang compiler. you must fix this." >&2
		echo
	fi
	
	if [ -z "$GOPATH" ]; then
		echo "* you must configure the GOPATH environment variable first:
	eg:   echo 'export GOLANG=/opt/golang' > /etc/profile.d/golang.sh" >&2
	fi
	
	echo -e "\e[0m" >&2
	die
fi
