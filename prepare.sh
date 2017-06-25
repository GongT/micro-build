#!/usr/bin/env bash

if [ ! -e node_modules ]; then
	echo "no node_modules folder in current path" >&2
	exit 1
fi
mkdir -p dist

cp -vur --dereference -p package/. -t dist/
