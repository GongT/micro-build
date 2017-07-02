#!/usr/bin/env bash

function tscp {
	echo -en "typescript compiling (source: $1)..."
	tsc -w -p "$1"
	echo "tsc process died with code $?"
}
export -f tscp

timing () {
	echo "timing command: $*"
	set +e
	local START=$(date +%s.%N)
	"$@"
	local RET=$?
	local END=$(date +%s.%N)
	set -e
	LAST_TIMING=$(echo "scale=2; $END - $START" | bc)
	echo "timing complete, return ${RET}, time ${LAST_TIMING}"
	return ${RET}
}

function handle_fail () {
	echo "not completed."
}

mkdir -p dist
cp package/bin.js dist/bin.js
for i in package/* ; do
	[ ! -e "dist/$(basename "$i")" ] && ln -s "../$i" dist/
done

timing tsc -p src/micro-build || handle_fail
echo "compile spent ${LAST_TIMING}s"
TIME_MAIN=$( echo "$LAST_TIMING + 0.5" | bc )

echo -e '\ec'

concurrently --color --kill-others \
	--prefix '[{name}]' \
	--names 'MAIN,PLUGIN' \
	--prefix-colors 'red,cyan' \
	"tscp src/micro-build" \
	"sleep ${TIME_MAIN}; tscp src/plugins" \
	| sed 's/^.*File change detected/\x1Bc\0/g'
