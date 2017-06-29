import {MicroBuildConfig} from "../microbuild-config";
import {isSystemdRunning} from "../system/detect-system-type";
import {walkValueKey, safeScriptValue} from "../../replace/parts/wrapper";
import {getGeneratePath} from "../common/file-paths";
import {resolve} from "path";

export function createDockerRunArgument(config: MicroBuildConfig) {
	const ret: string[] = [];
	const storage = config.toJSON();
	
	walkValueKey(storage.volume, (hostFolder, mountPoint: string) => {
		if (hostFolder.path) {
			ret.push(`--volume=${hostFolder.path}:${mountPoint}`);
		} else {
			ret.push(`--volume=${mountPoint}`);
		}
	});
	
	if (storage.dnsConfig.onlyLocalCacheRunning) {
		ret.push('--dns=${HOST_LOOP_IP}');
		ret.push('--env=HOST_LOOP_IP=${HOST_LOOP_IP}');
		ret.push('--env=USE_LOCAL_DNS=yes');
	}
	
	ret.push(`--net=${storage.networking.bridge? 'bridge' : 'host'}`);
	
	walkValueKey(storage.dockerRunArguments, (arg) => {
		ret.push(arg);
	});
	
	walkValueKey(storage.forwardPort, ({host, client, method}) => {
		if (host !== null) {
			const map = `${host}:${client}${(method? '/' + method : '')}`;
			ret.push(`--publish=${map}`);
		}
	});
	
	if (storage.service.type === 'notify') {
		ret.push('--env=WATCHDOG_USEC=${WATCHDOG_USEC}');
		ret.push('--env=WATCHDOG_PID=${WATCHDOG_PID}');
	}
	
	ret.push(`--name=${config.getContainerName()}`);
	ret.push(config.getImageTagName());
	
	return ret.map(safeScriptValue);
}

export function createDockerClientArgument(config: MicroBuildConfig) {
	const storage = config.toJSON();
	
	if (isSystemdRunning()) {
		const pid = resolve(getGeneratePath(), 'service.pid');
		const type = (storage.service.type || 'simple').toLowerCase();
		const ret = ['systemd-docker'];
		if (type === 'notify') {
			ret.push('--notify');
		}
		return ret.concat([
			'--cgroups',
			'name=systemd',
			`--pid-file=${pid}`,
			'run',
		]).map(safeScriptValue);
	} else {
		return ['docker', 'run'].map(safeScriptValue);
	}
}
