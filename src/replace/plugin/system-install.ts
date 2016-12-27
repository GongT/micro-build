import {MicroBuildConfig} from "../../library/microbuild-config";
import {alpineInstall} from "./alpine";

export function systemInstall(config: MicroBuildConfig) {
	if (config.toJSON().systemInstall.length === 0) {
		return '# no system install';
	}
	
	let method = config.toJSON().systemMethod;
	if (!method) {
		const base = config.toJSON().base;
		if (base.indexOf('alpine')) {
			method = 'apk';
		}
	}
	switch (method) {
	case 'apk':
		return alpineInstall(config);
	default:
		throw new Error(`unknown system install method: ${method || 'undefined'}.`);
	}
}
