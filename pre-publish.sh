#!/usr/bin/env bash

set -e

rm -rf node_moduls/@gongt/micro-build
sh prepare.sh

tsc -p src/micro-build
tsc -p src/plugins
