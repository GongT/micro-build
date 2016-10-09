#!/usr/bin/env bash

function is_image_exists {
	docker inspect --type image $1 &>/dev/null
}
function is_container_exists {
	docker inspect --type container $1 &>/dev/null
}
function is_container_running {
	docker inspect --type container $1 | grep -q '"Status": "running"' &>/dev/null
}
function is_image_has_hash { # image_name hash_string
	docker inspect --type image $1 | grep -q "$2" &>/dev/null
}
function remove_container {
	if is_container_exists "$@" ; then
		docker rm -f "$@" >/dev/null
	fi
}
