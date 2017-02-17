import {spawnSync} from "child_process";

let isSystemd;
export function isSystemdRunning() {
	if (isSystemd !== undefined) {
		return isSystemd;
	}
	const ret = spawnSync('systemctl', ['status', '--', '-.mount'], {
		encoding: 'utf8'
	});
	
	isSystemd = !ret.error && ret.stdout.toString().indexOf('active') !== -1;
	console.error('running systemd: %s', isSystemd);
	return isSystemd
}

let isUpstart;
export function isUpstartRunning() {
	if (isUpstart !== undefined) {
		return isUpstart;
	}
	const ret = spawnSync('/sbin/init', ['--version'], {
		encoding: 'utf8'
	});
	
	isUpstart = !ret.error && ret.stdout.toString().indexOf('upstart') !== -1;
	console.error('running upstart: %s', isUpstart);
	return isUpstart;
}
