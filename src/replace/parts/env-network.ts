import {MicroBuildConfig} from "../../library/microbuild-config";
import {walkValueKey, safeEnvStringInValue} from "./wrapper";

export function NetworkConfig(config: MicroBuildConfig) {
	return [
		walkValueKey(config.getNetworkConfig(), (v, k) => {
			if (v) {
				return `"-e" "${k}=${safeEnvStringInValue(v)}"`;
			}
		}, ' '),
		config.getNetworkTypeArg().join(' '),
	].join(' ');
}

export function DnsNetworkConfig(config: MicroBuildConfig) {
	if (config.toJSON().dnsConfig.onlyLocalCache) {
		return '"--dns=${HOST_LOOP_IP}"';
	} else {
		return ""
	}
}
