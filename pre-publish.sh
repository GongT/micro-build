#!/usr/bin/env bash

set -e

rm -rf dist/

mkdir -p dist

cp -vur --dereference -p package/. -t dist/

tsc -p src/micro-build
tsc -p src/plugins
