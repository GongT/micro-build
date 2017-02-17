import {lstatSync, readlinkSync, existsSync} from "fs";

export function isSystemdRunning() {
	let file = '/proc/1/exec';
	while (lstatSync(file).isSymbolicLink()) {
		file = readlinkSync(file);
	}
	return /systemd/.test(file);
}

export function isUpstartExists() {
	return existsSync('/usr/share/upstart');
}
