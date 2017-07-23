#!/usr/bin/env bash

echo "aaaaaaaaaa"

bash -c "set -o posix ; set" >/tmp/variables.before
source $1
bash -c "set -o posix ; set" >/tmp/variables.after
diff -B /tmp/variables.before /tmp/variables.after  | grep -E '^>' | sed 's/^> //g'
rm /tmp/variables.before /tmp/variables.after
