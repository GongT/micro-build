import {MicroBuildConfig} from "../microbuild-config";
import {isSystemdRunning} from "../system/detect-system-type";
import {safeScriptValue, safeEnvStringInValue, walkValueKey} from "../../replace/parts/wrapper";
import {getGeneratePath} from "../common/file-paths";
import {resolve} from "path";

export function createDockerRunArgument(config: MicroBuildConfig) {
	const ret: string[] = [];
	const storage = config.toJSON();
	
	walkValueKey(storage.volume, (hostFolder, mountPoint: string) => {
		if (hostFolder.path) {
			ret.push(`"--volume" "${safeEnvStringInValue(hostFolder.path)}:${safeEnvStringInValue(mountPoint)}"`);
		} else {
			ret.push(`"--volume" "${safeEnvStringInValue(mountPoint)}"`);
		}
	});
	
	if (storage.dnsConfig.onlyLocalCache) {
		ret.push('--dns=${HOST_LOOP_IP}');
	}
	
	walkValueKey(config.getNetworkConfig(), (v, k) => {
		if (v) {
			ret.push(`-env=${k}=${v}`);
		}
	});
	
	ret.push(`--net=${storage.networking.bridge? 'bridge' : 'host'}`);
	
	walkValueKey(storage.dockerRunArguments, (arg) => {
		ret.push(arg);
	});
	
	walkValueKey(storage.forwardPort, ({host, client, method}) => {
		if (host !== null) {
			const map = `${host}:${client}${(method? '/' + method : '')}`;
			ret.push(`"--publish" ${safeScriptValue(map)}`);
		}
	}, ' ');
	
	return ret;
}

export function createDockerClientArgument(config: MicroBuildConfig) {
	const storage = config.toJSON();
	
	if (isSystemdRunning()) {
		const pid = safeScriptValue(resolve(getGeneratePath(), 'service.pid'));
		const sdType = (storage.service.type || 'simple').toLowerCase();
		const NOTIFY_ARG = sdType === 'notify'? '--notify' : '';
		
		return `systemd-docker ${NOTIFY_ARG} '--cgroups' 'name=systemd' --pid-file=${pid} run`;
	} else {
		return `docker run`
	}
}
