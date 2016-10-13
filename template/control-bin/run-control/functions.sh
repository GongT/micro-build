#!/usr/bin/env bash

function is_image_exists {
	docker inspect --type image $1 &>/dev/null
}
function is_container_exists {
	docker inspect --type container $1 &>/dev/null
}
function is_container_running {
	docker inspect --type container $1 2>/dev/null | grep -q '"Status": "running"'
}
function is_image_has_hash { # image_name hash_string
	docker inspect --type image $1 2>/dev/null | grep -q "$2"
}
function remove_container {
	if is_container_exists "$@" ; then
		docker rm -f "$@" >/dev/null
	fi
}
