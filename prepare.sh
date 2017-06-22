#!/usr/bin/env bash

if [ ! -e node_modules ]; then
	echo "no node_modules folder in current path" >&2
	exit 1
fi
mkdir -p node_modules/@gongt/micro-build

cp -vur --dereference -p package/. -t node_modules/@gongt/micro-build
