import {lstatSync, readlinkSync, existsSync} from "fs";

export function isUpstartExists() {
	return existsSync('/usr/share/upstart');
}
export function isSystemdExists() {
	if (lstatSync('/sbin/init').isSymbolicLink()) {
		const init = readlinkSync('/sbin/init');
		if (init.indexOf('/systemd') !== -1) {
			return true;
		}
	}
	return false;
}
